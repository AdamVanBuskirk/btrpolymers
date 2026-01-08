import React, { CSSProperties, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector, useIsMobile } from "../Core/hooks";
import { getCompany } from "../Store/Company";
import {
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdShowChart,
  MdDownload,
} from "react-icons/md";
import {
  getSettings,
  setScorecardActions,
  setScorecardCalls,
  setScorecardRevenue,
  setScorecardTab,
  setScorecardTouchPoints,
} from "../Store/Settings";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DataFilters from "../Components/Controls/DataFilters"; // adjust path if needed

// ---- Types ----

type DateRange = {
  label: string;
  start: Date;
  end: Date;
};

type OutreachAction = {
  name: string;
  value: string;
};

type OutreachAmount = {
  name: string;
  value: string;
};

type OutreachDoc = {
  _id: string;
  actions?: OutreachAction[];
  amounts?: OutreachAmount[];
  created: any;
  [key: string]: any;
};

type ChartSection = "revenue" | "touchPoints" | "calls" | "actions" | null;
type ChartPoint = { label: string; qty: number };

const timeTabs = ["Weekly", "Monthly", "Quarterly", "Annual"];

// ---- Filters ----
type ScorecardFilters = {
  filterText: string;
  filterProspectType: string;
  startDate: string;
  endDate: string;
  dataTeams: string[];
};

// ---- Shared logic hook ----

function useScorecardData(filters?: ScorecardFilters) {
  const companyState = useAppSelector(getCompany);
  const settingsState = useAppSelector(getSettings);

  // Map of prospectId → prospect doc
  const prospectMap = useMemo(() => {
    const map = new Map<string, any>();
    (companyState.prospects || []).forEach((p: any) => {
      map.set(String(p._id), p);
    });
    return map;
  }, [companyState.prospects]);

  // --- Members map (userId → member)
  const memberMap = useMemo(() => {
    const map = new Map<string, any>();
    (companyState.members || []).forEach((m: any) => {
      map.set(String(m.userId), m);
    });
    return map;
  }, [companyState.members]);

  // ---- Date helpers ----
  const toDate = (value: any): Date => {
    if (value instanceof Date) return value;

    if (typeof value === "string" || typeof value === "number") {
      return new Date(value);
    }

    if (value && typeof value === "object" && value.$date) {
      const inner = value.$date;
      if (typeof inner === "string" || typeof inner === "number") {
        return new Date(inner);
      }
      if (inner && typeof inner === "object" && inner.$numberLong) {
        const ms = parseInt(inner.$numberLong, 10);
        return new Date(ms);
      }
    }

    return new Date(NaN);
  };

  const isInRange = (created: any, range: DateRange) => {
    const d = toDate(created);
    if (isNaN(d.getTime())) return false;
    d.setHours(0, 0, 0, 0);
    return d >= range.start && d <= range.end;
  };

  // --- Filter outreach by includeInReports (+ DataFilters, without changing other behavior)
  const outreach: OutreachDoc[] = useMemo(() => {
    const filterText = (filters?.filterText || "").toLowerCase().trim();
    const filterProspectType = filters?.filterProspectType || "";
    const startDate = filters?.startDate || "";
    const endDate = filters?.endDate || "";
    const dataTeams = filters?.dataTeams || [];

    // build date bounds once
    const parseLocalDateInput = (s: string): Date | null => {
      if (!s) return null;
      // expected "YYYY-MM-DD"
      const [y, m, d] = s.split("-").map((n) => parseInt(n, 10));
      if (!y || !m || !d) return null;
      return new Date(y, m - 1, d); // <-- local midnight
    };
    
    // build date bounds once (LOCAL)
    const startBound = parseLocalDateInput(startDate);
    if (startBound) startBound.setHours(0, 0, 0, 0);
    
    const endBound = parseLocalDateInput(endDate);
    if (endBound) endBound.setHours(23, 59, 59, 999);
    
    return (companyState.outreach || []).filter((o: any) => {
      const prospectId = o.prospectId && (o.prospectId._id || o.prospectId);
      if (!prospectId) return false;

      const prospect = prospectMap.get(String(prospectId));
      if (!prospect || !prospect.userId) return false;

      const member = memberMap.get(String(prospect.userId));

      // ✅ original behavior: include if includeInReports missing/true, exclude only if false
      if (member?.includeInReports === false) return false;

      // ✅ Team filter (match the prospect owner’s teams)
      if (dataTeams.length > 0) {
        const ownerTeams = Array.isArray(member?.teams)
          ? member.teams.map((t: any) => String(t))
          : [];
        const matchesTeam = ownerTeams.some((tid: string) =>
          dataTeams.includes(tid)
        );
        if (!matchesTeam) return false;
      }

      // ✅ Prospect type filter
      if (filterProspectType) {
        const pTypeId = prospect.typeId?._id || prospect.typeId;
        if (String(pTypeId) !== String(filterProspectType)) return false;
      }

      // ✅ Date filter (use outreach.created)
      if (startBound || endBound) {
        const created = toDate(o.created);
        if (isNaN(created.getTime())) return false;

        if (startBound && created < startBound) return false;
        if (endBound && created > endBound) return false;
      }

      // ✅ Text filter (match notes + prospect + owner name)
      if (filterText) {
        const ownerName = `${member?.firstName || ""} ${member?.lastName || ""}`
          .toLowerCase()
          .trim();

        const haystack = [
          o.notes || "",
          prospect.company || "",
          prospect.firstName || "",
          prospect.lastName || "",
          ownerName,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(filterText)) return false;
      }

      return true;
    });
  }, [companyState.outreach, prospectMap, memberMap, filters]);

  // Map of typeId → prospectType doc
  const prospectTypeMap = useMemo(() => {
    const map = new Map<string, any>();
    (companyState.prospectTypes || []).forEach((pt: any) => {
      map.set(String(pt._id), pt);
    });
    return map;
  }, [companyState.prospectTypes]);

  const getTouchPointNameFromOutreach = (o: any): string | null => {
    const prospectId = o.prospectId && (o.prospectId._id || o.prospectId);
    if (!prospectId) return null;

    const prospect = prospectMap.get(String(prospectId));
    if (!prospect || !prospect.typeId) return null;

    const typeId = prospect.typeId._id || prospect.typeId;
    const type = prospectTypeMap.get(String(typeId));

    return type ? type.name : null;
  };

  // ---- Date range generators (newest → oldest) ----

  function getWeeks(): DateRange[] {
    const weeks: DateRange[] = [];
    const today = new Date();

    const currentSunday = new Date(today);
    currentSunday.setHours(0, 0, 0, 0);
    currentSunday.setDate(today.getDate() - today.getDay()); // Sunday

    for (let i = 0; i < 12; i++) {
      const start = new Date(currentSunday);
      start.setDate(currentSunday.getDate() - i * 7);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const format = (d: Date): string => `${d.getMonth() + 1}/${d.getDate()}`;

      weeks.push({
        label: `${format(start)}-${format(end)}`,
        start,
        end,
      });
    }

    return weeks;
  }

  function getMonths(): DateRange[] {
    const months: DateRange[] = [];
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < 12; i++) {
      const start = new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() - i,
        1
      );
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

      months.push({
        label: monthNames[start.getMonth()],
        start,
        end,
      });
    }

    return months;
  }

  function getQuarters(): DateRange[] {
    const quarters: DateRange[] = [];
    const today = new Date();

    let currentQuarterIndex = Math.floor(today.getMonth() / 3); // 0–3
    const currentYear = today.getFullYear();

    for (let i = 0; i < 12; i++) {
      const qIndex = (currentQuarterIndex - i + 4 * 10) % 4;
      const quarterNumber = qIndex + 1;

      const yearOffset = Math.floor((currentQuarterIndex - i) / 4);
      const qYear = currentYear + yearOffset;

      const startMonth = qIndex * 3;
      const start = new Date(qYear, startMonth, 1);
      const end = new Date(qYear, startMonth + 3, 0);

      quarters.push({
        label: `Q${quarterNumber}`,
        start,
        end,
      });
    }

    return quarters;
  }

  function getYears(): DateRange[] {
    const years: DateRange[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const year = currentYear - i;
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);

      years.push({
        label: year.toString(),
        start,
        end,
      });
    }

    return years;
  }

  const weekRanges = useMemo(getWeeks, []);
  const monthRanges = useMemo(getMonths, []);
  const quarterRanges = useMemo(getQuarters, []);
  const yearRanges = useMemo(getYears, []);

  // ---- Value parsing helpers ----

  const parseNumber = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  };

  const parseActionValue = (value: string): number => {
    if (value === "true") return 1;
    if (value === "false" || value === "") return 0;
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  };

  // ---- Aggregators ----

  const sumAmountForRange = (amountId: string, range: DateRange): number => {
    return outreach
      .filter((doc) => isInRange(doc.created, range))
      .reduce((sum, doc) => {
        const arr = doc.amounts || [];
        const amt = arr.find((a) => String(a.name) === String(amountId));
        if (!amt) return sum;
        return sum + parseNumber(amt.value);
      }, 0);
  };

  const sumActionForRange = (actionId: string, range: DateRange): number => {
    return outreach
      .filter((doc) => isInRange(doc.created, range))
      .reduce((sum, doc) => {
        const arr = doc.actions || [];
        const action = arr.find((a) => String(a.name) === String(actionId));
        if (!action) return sum;
        return sum + parseActionValue(action.value);
      }, 0);
  };

  const countCallTypeForRange = (
    callTypeValue: string,
    range: DateRange
  ): number => {
    return outreach
      .filter((doc) => isInRange(doc.created, range))
      .filter((doc) => {
        const arr = doc.actions || [];
        let callType = arr.find((a) => a.name === "Call Type");
        if (!callType) {
          let callTypeId = companyState.actions.find((a) => a.name === "Call Type");
          if (callTypeId) {
            callType = arr.find((a) => a.name === callTypeId!._id);
          }
        }
        return callType && callType.value === callTypeValue;
      }).length;
  };

  const countTouchPointsForRange = (
    typeName: string,
    range: DateRange
  ): number => {
    return outreach
      .filter((o) => isInRange(o.created, range))
      .filter((o) => {
        const tp = getTouchPointNameFromOutreach(o);
        return tp === typeName;
      }).length;
  };

  // ---- Ranges / dimensions ----

  const amounts = useMemo(
    () => [...companyState.amounts].sort((a, b) => a.sort - b.sort),
    [companyState.amounts]
  );

  const touchPoints = useMemo(
    () => [...companyState.prospectTypes].sort((a, b) => a.sort - b.sort),
    [companyState.prospectTypes]
  );

  const actions = useMemo(
    () =>
      [...companyState.actions]
        .filter((a) => a.name !== "Call Type")
        .sort((a, b) => a.sort - b.sort),
    [companyState.actions]
  );

  const calls = useMemo(() => {
    const callAction = [...companyState.actions].find((a) => a.name === "Call Type");
    const values: string[] = [];
    if (callAction) {
      callAction.values.forEach((value: string) => {
        values.push(value);
      });
    }
    return values;
  }, [companyState.actions]);

  const reportingRanges: DateRange[] = useMemo(() => {
    if (settingsState.scorecardTab === "Weekly") return weekRanges;
    if (settingsState.scorecardTab === "Monthly") return monthRanges;
    if (settingsState.scorecardTab === "Quarterly") return quarterRanges;
    if (settingsState.scorecardTab === "Annual") return yearRanges;
    return weekRanges;
  }, [settingsState.scorecardTab, weekRanges, monthRanges, quarterRanges, yearRanges]);

  return {
    companyState,
    settingsState,
    reportingRanges,
    amounts,
    touchPoints,
    actions,
    calls,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  };
}

// ---- Shared chart modal ----

interface ChartModalProps {
  open: boolean;
  title: string;
  data: ChartPoint[];
  section: ChartSection;
  onClose: () => void;
}

const ChartModal: React.FC<ChartModalProps> = ({
  open,
  title,
  data,
  section,
  onClose,
}) => {
  if (!open) return null;

  const isRevenue = section === "revenue";

  const modalBackdropStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const modalStyle: CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
    maxWidth: "800px",
    width: "90%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  };

  const modalHeaderStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontWeight: 600,
    fontSize: "14px",
  };

  const modalCloseButtonStyle: CSSProperties = {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div style={modalBackdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <span>{title}</span>
          <button style={modalCloseButtonStyle} onClick={onClose}>
            ✕
          </button>
        </div>
        {data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No data available for this period.
          </div>
        ) : (
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 20, bottom: 10, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis
                  tickFormatter={(value: any): string =>
                    isRevenue ? formatCurrency(Number(value)) : String(value)
                  }
                />
                <Tooltip
                  formatter={(value: any) =>
                    isRevenue && typeof value === "number"
                      ? formatCurrency(value)
                      : String(value)
                  }
                />
                <Line type="monotone" dataKey="qty" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Desktop layout ----

const ScorecardDesktop: React.FC<{ filters: ScorecardFilters }> = ({ filters }) => {
  const dispatch = useAppDispatch();
  const {
    companyState,
    settingsState,
    reportingRanges,
    amounts,
    touchPoints,
    actions,
    calls,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  } = useScorecardData(filters);

  const [chartSection, setChartSection] = useState<ChartSection>(null);

  // filter out ranges where all 4 sections are zero
  const activeRanges = useMemo(() => {
    return reportingRanges.filter((range) => {
      const revenueTotal = amounts.reduce(
        (sum, a) => sum + sumAmountForRange(a._id, range),
        0
      );
      const touchTotal = touchPoints.reduce(
        (sum, tp) => sum + countTouchPointsForRange(tp.name, range),
        0
      );
      const callTotal = calls.reduce(
        (sum, value) => sum + countCallTypeForRange(value, range),
        0
      );
      const actionTotal = actions.reduce(
        (sum, a) => sum + sumActionForRange(a._id, range),
        0
      );

      return revenueTotal || touchTotal || callTotal || actionTotal;
    });
  }, [
    reportingRanges,
    amounts,
    touchPoints,
    calls,
    actions,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  ]);

  const openChart = (section: ChartSection) => setChartSection(section);
  const closeChart = () => setChartSection(null);

  const chartTitle = useMemo(() => {
    switch (chartSection) {
      case "revenue":
        return "Revenue Over Time";
      case "touchPoints":
        return "Client/Prospect Types Over Time";
      case "calls":
        return "Calls Over Time";
      case "actions":
        return "Actions Over Time";
      default:
        return "";
    }
  }, [chartSection]);

  const chartData: ChartPoint[] = useMemo(() => {
    if (!chartSection) return [];

    const raw = activeRanges.map((range) => {
      let total = 0;

      if (chartSection === "revenue") {
        total = amounts.reduce(
          (sum, a) => sum + sumAmountForRange(a._id, range),
          0
        );
      } else if (chartSection === "touchPoints") {
        total = touchPoints.reduce(
          (sum, tp) => sum + countTouchPointsForRange(tp.name, range),
          0
        );
      } else if (chartSection === "calls") {
        total = calls.reduce(
          (sum, value) => sum + countCallTypeForRange(value, range),
          0
        );
      } else if (chartSection === "actions") {
        total = actions.reduce(
          (sum, a) => sum + sumActionForRange(a._id, range),
          0
        );
      }

      return { label: range.label, qty: total };
    });

    // chart oldest → newest
    return raw.slice().reverse();
  }, [
    chartSection,
    activeRanges,
    amounts,
    touchPoints,
    calls,
    actions,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  ]);

  // ---- "no data to show" helpers per card ----
  const hasAnyValue = (vals: number[]) => vals.some((v) => (v ?? 0) !== 0);

  const hasRevenueData = useMemo(() => {
    return amounts.some((a) =>
      hasAnyValue(activeRanges.map((r) => sumAmountForRange(a._id, r)))
    );
  }, [amounts, activeRanges, sumAmountForRange]);

  const hasTouchPointData = useMemo(() => {
    return touchPoints.some((tp) =>
      hasAnyValue(activeRanges.map((r) => countTouchPointsForRange(tp.name, r)))
    );
  }, [touchPoints, activeRanges, countTouchPointsForRange]);

  const hasCallData = useMemo(() => {
    return calls.some((value) =>
      hasAnyValue(activeRanges.map((r) => countCallTypeForRange(value, r)))
    );
  }, [calls, activeRanges, countCallTypeForRange]);

  const hasActionData = useMemo(() => {
    return actions.some((a) =>
      hasAnyValue(activeRanges.map((r) => sumActionForRange(a._id, r)))
    );
  }, [actions, activeRanges, sumActionForRange]);

  const noDataStyle: React.CSSProperties = {
    textAlign: "center",
    fontStyle: "italic",
    padding: "22px 10px",
    color: "#666",
  };

  const colStyle: CSSProperties = {
    fontSize: "10pt",
    textAlign: "right",
  };

  const headerRow = (
    <>
      <div style={{ ...colStyle, fontWeight: 600 }}></div>
      {activeRanges.map((range, idx) => (
        <div
          style={{ ...colStyle, fontWeight: 600 }}
          key={"hdr-" + range.label + idx}
        >
          {range.label}
        </div>
      ))}
    </>
  );

  // Revenue grid rows
  const formattedAmounts = amounts.map((a) => {
    const companyAmount = companyState.companyAmounts.find(
      (ca: any) => ca.actionId === a._id
    );
    const label = companyAmount ? companyAmount.label : a.label;

    return (
      <React.Fragment key={a._id}>
        <div style={colStyle}>{label}</div>
        {activeRanges.map((range, idx) => {
          const total = sumAmountForRange(a._id, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {total
                ? total.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  // Actions grid rows
  const formattedActions = actions.map((a) => {
    const companyAction = companyState.companyActions.find(
      (ca: any) => ca.actionId === a._id
    );
    const label = companyAction ? companyAction.name : a.name;

    return (
      <React.Fragment key={a._id}>
        <div style={colStyle}>{label}</div>
        {activeRanges.map((range, idx) => {
          const value = sumActionForRange(a._id, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {value || "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  // TouchPoints grid rows
  const formattedTouchPoints = touchPoints.map((tp) => {
    const label = tp.name;

    return (
      <React.Fragment key={tp._id}>
        <div style={colStyle}>{label}</div>
        {activeRanges.map((range, idx) => {
          const count = countTouchPointsForRange(label, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {count || "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  // Calls grid rows
  const formattedCalls = calls.map((value) => {
    return (
      <React.Fragment key={value}>
        <div style={colStyle}>{value}</div>
        {activeRanges.map((range, idx) => {
          const count = countCallTypeForRange(value, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {count || "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  const divStyle: CSSProperties = {
    backgroundColor: "#f7f8fa",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: 550,
    marginBottom: "20px",
    boxShadow: "4px 4px 14px 0px rgba(0, 0, 0, 0.08)",
  };

  const subDivStyle: CSSProperties = {
    marginTop: "5px",
    padding: "10px",
    borderBottomRightRadius: "10px",
    borderBottomLeftRadius: "10px",
    backgroundColor: "#fff",
    fontWeight: "normal",
  };

  const formattedTimeTabs = timeTabs.map((value) => {
    const timeDivStyle: CSSProperties = {
      marginRight: "30px",
      marginBottom: "10px",
      paddingBottom: "5px",
      fontWeight: 500,
      cursor: "pointer",
      color: value === settingsState.scorecardTab ? "#000" : "#555",
      borderBottom:
        value === settingsState.scorecardTab ? "2px solid #f5330c" : "unset",
    };
    return (
      <div
        style={timeDivStyle}
        onClick={() => dispatch(setScorecardTab(value))}
        key={value}
      >
        {value}
      </div>
    );
  });

  const headerRightStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const graphIconStyle: CSSProperties = { cursor: "pointer" };

  const handleDownloadCsv = () => {
    const csvEscape = (value: any): string => {
      const s = value === null || value === undefined ? "" : String(value);
      const escaped = s.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const header = ["Section", "Metric", ...activeRanges.map((r) => r.label)];
    const lines: string[] = [];
    lines.push(header.map(csvEscape).join(","));

    const addRow = (section: string, metric: string, values: number[]) => {
      const row = [section, metric, ...values];
      lines.push(row.map(csvEscape).join(","));
    };

    amounts.forEach((a) => {
      const companyAmount = companyState.companyAmounts?.find(
        (ca: any) => ca.actionId === a._id
      );
      const label = companyAmount ? companyAmount.label : a.label;

      const vals = activeRanges.map((range) => sumAmountForRange(a._id, range));
      addRow("Revenue", label, vals);
    });

    touchPoints.forEach((tp) => {
      const label = tp.name;
      const vals = activeRanges.map((range) =>
        countTouchPointsForRange(label, range)
      );
      addRow("Client/Prospect Types", label, vals);
    });

    calls.forEach((value) => {
      const vals = activeRanges.map((range) => countCallTypeForRange(value, range));
      addRow("Call Types", value, vals);
    });

    actions.forEach((a) => {
      const companyAction = companyState.companyActions?.find(
        (ca: any) => ca.actionId === a._id
      );
      const label = companyAction ? companyAction.name : a.name;

      const vals = activeRanges.map((range) => sumActionForRange(a._id, range));
      addRow("Actions", label, vals);
    });

    const csvContent = lines.join("\r\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "salesdoing_scorecard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (amounts.length === 0 && actions.length === 0 && calls.length === 0) {
    return (
      <div
        style={{
          margin: "200px auto",
          textAlign: "center",
          fontStyle: "italic",
          color: "#555",
        }}
      >
        Please log some sales actions to start getting insights.
      </div>
    );
  }

  return (
    <div style={{ marginLeft: "20px", marginRight: "15px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex" }}>{formattedTimeTabs}</div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            fontSize: "11px",
            color: "#555",
          }}
          onClick={handleDownloadCsv}
          title="Download CSV"
        >
          <MdDownload size={18} color="#555" />
          <span>CSV</span>
        </div>
      </div>

      {/* Revenue */}
      <div style={divStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(setScorecardRevenue(settingsState.scorecardRevenue ? false : true))
          }
        >
          <div>Revenue</div>
          <div style={headerRightStyle}>
            <div
              style={graphIconStyle}
              onClick={(e) => {
                e.stopPropagation();
                openChart("revenue");
              }}
            >
              <MdShowChart size={22} color="#555" />
            </div>
            <div style={{ position: "relative", top: "-2px" }}>
              {settingsState.scorecardRevenue ? (
                <MdOutlineExpandMore size={30} color="#555" />
              ) : (
                <MdOutlineExpandLess size={30} color="#555" />
              )}
            </div>
          </div>
        </div>

        {settingsState.scorecardRevenue && (
          <div style={subDivStyle}>
            {!hasRevenueData ? (
              <div style={noDataStyle}>no data to show</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${activeRanges.length}, 1fr)`,
                  columnGap: "8px",
                  rowGap: "6px",
                  alignItems: "end",
                }}
              >
                {headerRow}
                {formattedAmounts}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TouchPoints */}
      <div style={divStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(
              setScorecardTouchPoints(settingsState.scorecardTouchPoints ? false : true)
            )
          }
        >
          <div>Client/Prospect Types</div>
          <div style={headerRightStyle}>
            <div
              style={graphIconStyle}
              onClick={(e) => {
                e.stopPropagation();
                openChart("touchPoints");
              }}
            >
              <MdShowChart size={22} color="#555" />
            </div>
            <div style={{ position: "relative", top: "-2px" }}>
              {settingsState.scorecardTouchPoints ? (
                <MdOutlineExpandMore size={30} color="#555" />
              ) : (
                <MdOutlineExpandLess size={30} color="#555" />
              )}
            </div>
          </div>
        </div>

        {settingsState.scorecardTouchPoints && (
          <div style={subDivStyle}>
            {!hasTouchPointData ? (
              <div style={noDataStyle}>no data to show</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${activeRanges.length}, 1fr)`,
                  columnGap: "8px",
                  rowGap: "6px",
                  alignItems: "end",
                }}
              >
                {headerRow}
                {formattedTouchPoints}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calls */}
      <div style={divStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(setScorecardCalls(settingsState.scorecardCalls ? false : true))
          }
        >
          <div>Call Types</div>
          <div style={headerRightStyle}>
            <div
              style={graphIconStyle}
              onClick={(e) => {
                e.stopPropagation();
                openChart("calls");
              }}
            >
              <MdShowChart size={22} color="#555" />
            </div>
            <div style={{ position: "relative", top: "-2px" }}>
              {settingsState.scorecardCalls ? (
                <MdOutlineExpandMore size={30} color="#555" />
              ) : (
                <MdOutlineExpandLess size={30} color="#555" />
              )}
            </div>
          </div>
        </div>

        {settingsState.scorecardCalls && (
          <div style={subDivStyle}>
            {!hasCallData ? (
              <div style={noDataStyle}>no data to show</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${activeRanges.length}, 1fr)`,
                  columnGap: "8px",
                  rowGap: "6px",
                  alignItems: "end",
                }}
              >
                {headerRow}
                {formattedCalls}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={divStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(setScorecardActions(settingsState.scorecardActions ? false : true))
          }
        >
          <div>Actions</div>
          <div style={headerRightStyle}>
            <div
              style={graphIconStyle}
              onClick={(e) => {
                e.stopPropagation();
                openChart("actions");
              }}
            >
              <MdShowChart size={22} color="#555" />
            </div>
            <div style={{ position: "relative", top: "-2px" }}>
              {settingsState.scorecardActions ? (
                <MdOutlineExpandMore size={30} color="#555" />
              ) : (
                <MdOutlineExpandLess size={30} color="#555" />
              )}
            </div>
          </div>
        </div>

        {settingsState.scorecardActions && (
          <div style={subDivStyle}>
            {!hasActionData ? (
              <div style={noDataStyle}>no data to show</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${activeRanges.length}, 1fr)`,
                  columnGap: "8px",
                  rowGap: "6px",
                  alignItems: "end",
                }}
              >
                {headerRow}
                {formattedActions}
              </div>
            )}
          </div>
        )}
      </div>

      <ChartModal
        open={!!chartSection}
        title={chartTitle}
        data={chartData}
        section={chartSection}
        onClose={closeChart}
      />
    </div>
  );
};

// ---- Mobile layout ----

const ScorecardMobile: React.FC<{ filters: ScorecardFilters }> = ({ filters }) => {
  const dispatch = useAppDispatch();
  const {
    companyState,
    settingsState,
    reportingRanges,
    amounts,
    touchPoints,
    actions,
    calls,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  } = useScorecardData(filters);

  const [chartSection, setChartSection] = useState<ChartSection>(null);
  const [openSection, setOpenSection] = useState<ChartSection>(null);

  const activeRanges = useMemo(() => {
    return reportingRanges.filter((range) => {
      const revenueTotal = amounts.reduce(
        (sum, a) => sum + sumAmountForRange(a._id, range),
        0
      );
      const touchTotal = touchPoints.reduce(
        (sum, tp) => sum + countTouchPointsForRange(tp.name, range),
        0
      );
      const callTotal = calls.reduce(
        (sum, value) => sum + countCallTypeForRange(value, range),
        0
      );
      const actionTotal = actions.reduce(
        (sum, a) => sum + sumActionForRange(a._id, range),
        0
      );

      return revenueTotal || touchTotal || callTotal || actionTotal;
    });
  }, [
    reportingRanges,
    amounts,
    touchPoints,
    calls,
    actions,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  ]);

  const openChart = (section: ChartSection) => setChartSection(section);
  const closeChart = () => setChartSection(null);

  const chartTitle = useMemo(() => {
    switch (chartSection) {
      case "revenue":
        return "Revenue Over Time";
      case "touchPoints":
        return "Client/Prospect Types Over Time";
      case "calls":
        return "Calls Over Time";
      case "actions":
        return "Actions Over Time";
      default:
        return "";
    }
  }, [chartSection]);

  const chartData: ChartPoint[] = useMemo(() => {
    if (!chartSection) return [];

    const raw = activeRanges.map((range) => {
      let total = 0;

      if (chartSection === "revenue") {
        total = amounts.reduce(
          (sum, a) => sum + sumAmountForRange(a._id, range),
          0
        );
      } else if (chartSection === "touchPoints") {
        total = touchPoints.reduce(
          (sum, tp) => sum + countTouchPointsForRange(tp.name, range),
          0
        );
      } else if (chartSection === "calls") {
        total = calls.reduce(
          (sum, value) => sum + countCallTypeForRange(value, range),
          0
        );
      } else if (chartSection === "actions") {
        total = actions.reduce(
          (sum, a) => sum + sumActionForRange(a._id, range),
          0
        );
      }

      return { label: range.label, qty: total };
    });

    return raw.slice().reverse();
  }, [
    chartSection,
    activeRanges,
    amounts,
    touchPoints,
    calls,
    actions,
    sumAmountForRange,
    sumActionForRange,
    countCallTypeForRange,
    countTouchPointsForRange,
  ]);

  // ---- "no data to show" helpers per card ----
  const hasAnyValue = (vals: number[]) => vals.some((v) => (v ?? 0) !== 0);

  const hasRevenueData = useMemo(() => {
    return amounts.some((a) =>
      hasAnyValue(activeRanges.map((r) => sumAmountForRange(a._id, r)))
    );
  }, [amounts, activeRanges, sumAmountForRange]);

  const hasTouchPointData = useMemo(() => {
    return touchPoints.some((tp) =>
      hasAnyValue(activeRanges.map((r) => countTouchPointsForRange(tp.name, r)))
    );
  }, [touchPoints, activeRanges, countTouchPointsForRange]);

  const hasCallData = useMemo(() => {
    return calls.some((value) =>
      hasAnyValue(activeRanges.map((r) => countCallTypeForRange(value, r)))
    );
  }, [calls, activeRanges, countCallTypeForRange]);

  const hasActionData = useMemo(() => {
    return actions.some((a) =>
      hasAnyValue(activeRanges.map((r) => sumActionForRange(a._id, r)))
    );
  }, [actions, activeRanges, sumActionForRange]);

  const noDataStyle: React.CSSProperties = {
    textAlign: "center",
    fontStyle: "italic",
    padding: "18px 10px",
    color: "#666",
  };

  const formattedTimeTabs = timeTabs.map((value) => {
    const timeDivStyle: CSSProperties = {
      marginRight: "16px",
      marginBottom: "10px",
      paddingBottom: "5px",
      fontWeight: 500,
      cursor: "pointer",
      fontSize: "12px",
      color: value === settingsState.scorecardTab ? "#000" : "#555",
      borderBottom:
        value === settingsState.scorecardTab ? "2px solid #f5330c" : "unset",
    };
    return (
      <div
        style={timeDivStyle}
        onClick={() => dispatch(setScorecardTab(value))}
        key={value}
      >
        {value}
      </div>
    );
  });

  const cardStyle: CSSProperties = {
    backgroundColor: "#f7f8fa",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: 500,
    marginBottom: "15px",
    boxShadow: "4px 4px 14px 0px rgba(0, 0, 0, 0.08)",
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const headerRightStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const graphIconStyle: CSSProperties = { cursor: "pointer" };
  const sectionLabelStyle: CSSProperties = { fontSize: "14px" };

  const colStyle: CSSProperties = {
    fontSize: "9pt",
    textAlign: "right",
  };

  const headerRow = (
    <>
      <div style={{ ...colStyle, fontWeight: 600, textAlign: "left" }}></div>
      {activeRanges.map((range, idx) => (
        <div
          style={{ ...colStyle, fontWeight: 600 }}
          key={"hdr-m-" + range.label + idx}
        >
          {range.label}
        </div>
      ))}
    </>
  );

  const revenueRows = amounts.map((a) => {
    const companyAmount = companyState.companyAmounts.find(
      (ca: any) => ca.actionId === a._id
    );
    const label = companyAmount ? companyAmount.label : a.label;

    return (
      <React.Fragment key={"m-rev-" + a._id}>
        <div style={{ ...colStyle, textAlign: "left" }}>{label}</div>
        {activeRanges.map((range, idx) => {
          const total = sumAmountForRange(a._id, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {total
                ? total.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  const actionsRows = actions.map((a) => {
    const companyAction = companyState.companyActions.find(
      (ca: any) => ca.actionId === a._id
    );
    const label = companyAction ? companyAction.name : a.name;

    return (
      <React.Fragment key={"m-act-" + a._id}>
        <div style={{ ...colStyle, textAlign: "left" }}>{label}</div>
        {activeRanges.map((range, idx) => {
          const value = sumActionForRange(a._id, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {value || "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  const touchRows = touchPoints.map((tp) => {
    const label = tp.name;
    return (
      <React.Fragment key={"m-tp-" + tp._id}>
        <div style={{ ...colStyle, textAlign: "left" }}>{label}</div>
        {activeRanges.map((range, idx) => {
          const count = countTouchPointsForRange(label, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {count || "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  const callRows = calls.map((value) => {
    return (
      <React.Fragment key={"m-call-" + value}>
        <div style={{ ...colStyle, textAlign: "left" }}>{value}</div>
        {activeRanges.map((range, idx) => {
          const count = countCallTypeForRange(value, range);
          return (
            <div style={colStyle} key={range.label + idx}>
              {count || "-"}
            </div>
          );
        })}
      </React.Fragment>
    );
  });

  const gridWrapperStyle: CSSProperties = {
    marginTop: "8px",
    overflowX: "auto",
  };

  const gridStyle = (firstColWidth: number): CSSProperties => ({
    display: "grid",
    gridTemplateColumns: `${firstColWidth}px repeat(${activeRanges.length}, 1fr)`,
    columnGap: "8px",
    rowGap: "6px",
    alignItems: "end",
    minWidth: `${(activeRanges.length + 1) * 80}px`,
  });

  if (amounts.length === 0 && actions.length === 0 && calls.length === 0) {
    return (
      <div
        style={{
          margin: "150px auto",
          textAlign: "center",
          fontStyle: "italic",
          color: "#555",
          padding: "0 16px",
        }}
      >
        Please log some sales actions to start getting insights.
      </div>
    );
  }

  const renderSectionCard = (
    label: string,
    sectionKey: Exclude<ChartSection, null>,
    rows: React.ReactNode
  ) => {
    const isOpen = openSection === sectionKey;

    const sectionHasData =
      sectionKey === "revenue"
        ? hasRevenueData
        : sectionKey === "touchPoints"
        ? hasTouchPointData
        : sectionKey === "calls"
        ? hasCallData
        : hasActionData;

    return (
      <div style={cardStyle} key={sectionKey}>
        <div
          style={headerStyle}
          onClick={() => setOpenSection(isOpen ? null : sectionKey)}
        >
          <div style={sectionLabelStyle}>{label}</div>
          <div style={headerRightStyle}>
            <div
              style={graphIconStyle}
              onClick={(e) => {
                e.stopPropagation();
                openChart(sectionKey);
              }}
            >
              <MdShowChart size={22} color="#555" />
            </div>
            <div style={{ position: "relative", top: "-2px" }}>
              {isOpen ? (
                <MdOutlineExpandMore size={26} color="#555" />
              ) : (
                <MdOutlineExpandLess size={26} color="#555" />
              )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div style={gridWrapperStyle}>
            {!sectionHasData ? (
              <div style={noDataStyle}>no data to show</div>
            ) : (
              <div style={gridStyle(130)}>
                {headerRow}
                {rows}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginLeft: "10px", marginRight: "10px" }}>
      <div style={{ display: "flex" }}>{formattedTimeTabs}</div>

      {renderSectionCard("Revenue", "revenue", revenueRows)}
      {renderSectionCard("Client/Prospect Types", "touchPoints", touchRows)}
      {renderSectionCard("Call Types", "calls", callRows)}
      {renderSectionCard("Actions", "actions", actionsRows)}

      <ChartModal
        open={!!chartSection}
        title={chartTitle}
        data={chartData}
        section={chartSection}
        onClose={closeChart}
      />
    </div>
  );
};

// ---- Wrapper: choose desktop vs mobile (includes DataFilters) ----

function ScorecardTab() {
  const isMobile = useIsMobile();
  const companyState = useAppSelector(getCompany);

  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterProspectType, setFilterProspectType] = useState("");
  const [dataTeams, setDataTeams] = useState<string[]>([]);

  const filters: ScorecardFilters = useMemo(
    () => ({ filterText, filterProspectType, startDate, endDate, dataTeams }),
    [filterText, filterProspectType, startDate, endDate, dataTeams]
  );

  return (
    <div style={{ paddingBottom: "20px" }}>
      <DataFilters
        filterText={filterText}
        setFilterText={setFilterText}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        filterProspectType={filterProspectType}
        setFilterProspectType={setFilterProspectType}
        prospectTypes={companyState.prospectTypes || []}
        teams={companyState.teams || []}
        dataTeams={dataTeams}
        setDataTeams={setDataTeams}
      />

      {isMobile ? (
        <ScorecardMobile filters={filters} />
      ) : (
        <ScorecardDesktop filters={filters} />
      )}
    </div>
  );
}

export default ScorecardTab;
