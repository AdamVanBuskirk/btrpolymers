import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  Legend,
} from "recharts";
import { useAppSelector } from "../../Core/hooks";
import { getCompany } from "../../Store/Company";
import DataFilters from "../Controls/DataFilters";
import { formatDollars } from "../../Helpers/formatDollars";

const MonthlyLegend = (props: any) => {
  const { payload } = props;
  if (!payload || payload.length === 0) return null;

  const map: Record<string, any> = {};
  payload.forEach((p: any) => {
    if (p && p.dataKey) map[p.dataKey] = p;
  });

  const order: string[] = ["actions", "newOpp", "quoted", "closed"];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
      {order.map((key) => {
        const item = map[key];
        if (!item) return null;
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: item.color || "#000",
                display: "inline-block",
              }}
            />
            <span>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};

const CustomMonthlyTooltip = (props: any) => {
  const { active, payload, label, opportunityLabel, quotedLabel, closedLabel } = props;

  if (!active || !payload || payload.length === 0) return null;

  const map: Record<string, any> = {};
  payload.forEach((p: any) => {
    if (p && p.dataKey) {
      map[p.dataKey] = p;
    }
  });

  return (
    <div
      style={{
        background: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        boxShadow: "0 0 8px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>

      {map.actions && (
        <div>
          <span>Actions : </span>
          <span>{map.actions.value}</span>
        </div>
      )}

      {map.newOpp && (
        <div style={{ color: "#2563eb" }}>
          <span>{opportunityLabel} : </span>
          <span>{formatDollars(map.newOpp.value)}</span>
        </div>
      )}

      {map.quoted && (
        <div style={{ color: "#f97316" }}>
          <span>{quotedLabel} : </span>
          <span>{formatDollars(map.quoted.value)}</span>
        </div>
      )}

      {map.closed && (
        <div style={{ color: "#16a34a" }}>
          <span>{closedLabel} : </span>
          <span>{formatDollars(map.closed.value)}</span>
        </div>
      )}
    </div>
  );
};

function DashboardsTab() {
  const companyState = useAppSelector(getCompany);
  const outreach = companyState.outreach || [];
  const prospects = companyState.prospects || [];
  const prospectTypes = companyState.prospectTypes || [];

  // Filters
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterProspectType, setFilterProspectType] = useState("");
  const [dataTeams, setDataTeams] = useState<string[]>([]);
  const teams = companyState.teams || [];

  const prospectById = useMemo(() => {
    const map: Record<string, any> = {};
    prospects.forEach((p: any) => {
      if (p?._id) map[String(p._id)] = p;
    });
    return map;
  }, [prospects]);

  const memberByUserId = useMemo(() => {
    const map: Record<string, any> = {};
    (companyState.members || []).forEach((m: any) => {
      if (m?.userId) map[String(m.userId)] = m;
    });
    return map;
  }, [companyState.members]);

  // ✅ include in reports: include if missing/true, exclude only if explicitly false
  const memberAllowedByUserId = useMemo(() => {
    const allowed = new Map<string, boolean>();
    (companyState.members || []).forEach((m: any) => {
      const uid = m?.userId ? String(m.userId) : "";
      if (!uid) return;
      allowed.set(uid, m?.includeInReports !== false);
    });
    return allowed;
  }, [companyState.members]);

  const filteredOutreach = useMemo(() => {
    const text = (filterText || "").toLowerCase();

    return outreach.filter((o: any) => {
      const p = prospectById[String(o.prospectId)];
      const ownerMember = p ? memberByUserId[String(p.userId)] : null;

      // ✅ INCLUDE-IN-REPORTS filter (missing/true => include; false => exclude)
      if (p?.userId) {
        const ok = memberAllowedByUserId.get(String(p.userId));
        // if member record exists -> ok will be true/false; if missing member record -> exclude (safer)
        if (ok === false || ok === undefined) return false;
      } else {
        return false;
      }

      // ✅ TEAM FILTER: outreach -> prospect -> member -> member.teams[]
      if (dataTeams.length > 0) {
        const ownerTeams = (ownerMember?.teams ?? []).map((id: any) => String(id));
        const matchesTeam = ownerTeams.some((id: string) => dataTeams.includes(id));
        if (!matchesTeam) return false;
      }

      // text filter (notes + company + names + owner)
      const ownerFullName = `${ownerMember?.firstName || ""} ${ownerMember?.lastName || ""}`.toLowerCase();

      const textMatch =
        (o.notes || "").toLowerCase().includes(text) ||
        (p?.company || "").toLowerCase().includes(text) ||
        (p?.firstName || "").toLowerCase().includes(text) ||
        (p?.lastName || "").toLowerCase().includes(text) ||
        ownerFullName.includes(text);

      // type filter
      const typeMatch = !filterProspectType || (p && p.typeId === filterProspectType);

      // date filter (outreach.created)
      const createdDate = new Date(o.created);
      const startBound = startDate ? new Date(`${startDate}T00:00:00.000Z`) : null;
      const endBound = endDate ? new Date(`${endDate}T23:59:59.999Z`) : null;

      const afterStart = !startBound || createdDate >= startBound;
      const beforeEnd = !endBound || createdDate <= endBound;

      return textMatch && typeMatch && afterStart && beforeEnd;
    });
  }, [
    outreach,
    prospectById,
    memberByUserId,
    memberAllowedByUserId,
    dataTeams,
    filterText,
    filterProspectType,
    startDate,
    endDate,
  ]);

  const filteredProspects = useMemo(() => {
    const text = (filterText || "").toLowerCase();

    return prospects.filter((p: any) => {
      const owner = memberByUserId[String(p.userId)];

      // ✅ INCLUDE-IN-REPORTS filter (missing/true => include; false => exclude)
      const ok = memberAllowedByUserId.get(String(p.userId));
      if (ok === false || ok === undefined) return false;

      const ownerFullName = `${owner?.firstName || ""} ${owner?.lastName || ""}`.toLowerCase();

      // ✅ TEAM FILTER (prospect owner teams)
      if (dataTeams.length > 0) {
        const ownerTeams = (owner?.teams ?? []).map((id: any) => String(id));
        const matchesTeam = ownerTeams.some((id: string) => dataTeams.includes(id));
        if (!matchesTeam) return false;
      }

      const textMatch =
        (p.firstName || "").toLowerCase().includes(text) ||
        (p.lastName || "").toLowerCase().includes(text) ||
        (p.company || "").toLowerCase().includes(text) ||
        ownerFullName.includes(text);

      const typeMatch = !filterProspectType || p.typeId === filterProspectType;

      const createdDate = new Date(p.created);
      const startBound = startDate ? new Date(`${startDate}T00:00:00.000Z`) : null;
      const endBound = endDate ? new Date(`${endDate}T23:59:59.999Z`) : null;

      const afterStart = !startBound || createdDate >= startBound;
      const beforeEnd = !endBound || createdDate <= endBound;

      return textMatch && typeMatch && afterStart && beforeEnd;
    });
  }, [
    prospects,
    memberByUserId,
    memberAllowedByUserId,
    dataTeams,
    filterText,
    filterProspectType,
    startDate,
    endDate,
  ]);

  // 🔹 Action Summary (count by action name)
  const actionSummaryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOutreach.forEach((o: any) => {
      o.actions?.forEach((a: any) => {
        let key = a.name;
        let action = companyState.actions.find((action: any) => action._id === a.name);
        if (action) {
          key = action.name; // outreach action name is actionId

          let companyAction = companyState.companyActions.find((c: any) => c.actionId === action?._id);
          if (companyAction) {
            key = companyAction.name;
          }
        }

        const val = String(a.value).toLowerCase().trim();
        if (!isNaN(Number(val)) && val !== "") {
          counts[key] = (counts[key] || 0) + Number(val);
        } else if (val === "true") {
          counts[key] = (counts[key] || 0) + 1;
        }
      });
    });

    return Object.entries(counts).map(([name, value]) => {
      if (name === "Internal Referral Request") name = "Internal Referral";
      else if (name === "External Referral Request") name = "External Referral";
      else if (name === "Pivot to Sales or Next Conversation") name = "Pivot";
      else if (name === "Proactive Call") name = "PC";
      else if (name === "Hand-Written Note") name = "HW Note";
      return { name, value };
    });
  }, [filteredOutreach, companyState.actions, companyState.companyActions]);

  // 🔹 Call Types
  const callTypesData = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredOutreach.forEach((o: any) => {
      o.actions?.forEach((a: any) => {
        let callType = companyState.actions.find((act: any) => act.name === "Call Type");

        if (!callType) {
          const callTypeId = companyState.actions.find((act: any) => act.name === "Call Type");
          if (callTypeId) {
            callType = companyState.actions.find((act: any) => act._id === callTypeId._id);
          }
        }

        if (!callType || (a.name !== callType._id && a.name !== "Call Type")) return;

        const label = a.value || "Unknown";
        counts[label] = (counts[label] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredOutreach, companyState.actions]);

  // 🔹 Client/Prospect Types
  const clientTypesData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProspects.forEach((p: any) => {
      const typeName = prospectTypes.find((t: any) => t._id === p.typeId)?.name || "Unknown";
      counts[typeName] = (counts[typeName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProspects, prospectTypes]);

  let opportunity_label = "New Opp";
  let quoted_label = "Quoted";
  let closed_label = "Closed";
  let annualized_label = "New Opp (Annualized)";
  let opportunity_guid = "";
  let quoted_guid = "";
  let closed_guid = "";
  let annualized_guid = "";

  let opportunity = companyState.amounts.find((a: any) => a.label === "New Opportunity $ Value");
  if (opportunity) {
    opportunity_guid = opportunity._id;
    let companyOpportunity = companyState.companyAmounts.find((a: any) => a.actionId === opportunity?._id);
    if (companyOpportunity) opportunity_label = companyOpportunity.label;
  }

  let quoted = companyState.amounts.find((a: any) => a.label === "Quote or Proposal Amount");
  if (quoted) {
    quoted_guid = quoted._id;
    let companyQuoted = companyState.companyAmounts.find((a: any) => a.actionId === quoted?._id);
    if (companyQuoted) quoted_label = companyQuoted.label;
  }

  let closed = companyState.amounts.find((a: any) => a.label === "Closed Amount");
  if (closed) {
    closed_guid = closed._id;
    let companyClosed = companyState.companyAmounts.find((a: any) => a.actionId === closed?._id);
    if (companyClosed) closed_label = companyClosed.label;
  }

  let annualized = companyState.amounts.find((a: any) => a.label === "Annualized Value");
  if (annualized) {
    annualized_guid = annualized._id;
    let companyAnnualized = companyState.companyAmounts.find((a: any) => a.actionId === annualized?._id);
    if (companyAnnualized) annualized_label = companyAnnualized.label;
  }

  // 🔹 Monthly Actions & Revenue
  const monthlyData = useMemo(() => {
    const grouped: Record<string, { newOpp: number; quoted: number; closed: number; actions: number }> = {};

    filteredOutreach.forEach((o: any) => {
      const d = new Date(o.created);
      const month = d.toLocaleString("default", { month: "short" }) + "-" + d.getFullYear();

      if (!grouped[month]) grouped[month] = { newOpp: 0, quoted: 0, closed: 0, actions: 0 };

      o.amounts?.forEach((amt: any) => {
        const val = Number(String(amt.value).replace(/[$,]/g, ""));
        if (isNaN(val)) return;
        if (amt.name === opportunity_guid) grouped[month].newOpp += val;
        if (amt.name === quoted_guid) grouped[month].quoted += val;
        if (amt.name === closed_guid) grouped[month].closed += val;
      });

      o.actions?.forEach((a: any) => {
        const val = String(a.value).toLowerCase().trim();
        if (!isNaN(Number(val)) && val !== "") grouped[month].actions += Number(val);
        else if (val === "true") grouped[month].actions += 1;
      });
    });

    return Object.entries(grouped).map(([month, values]) => ({ month, ...values }));
  }, [filteredOutreach, opportunity_guid, quoted_guid, closed_guid]);

  // 🔹 Totals
  const totals = useMemo(() => {
    let newOpp = 0,
      quotedTotal = 0,
      closedTotal = 0,
      annualizedTotal = 0;

    filteredOutreach.forEach((o: any) => {
      o.amounts?.forEach((amt: any) => {
        const val = Number(String(amt.value).replace(/[$,]/g, ""));
        if (isNaN(val)) return;
        if (amt.name === opportunity_guid) newOpp += val;
        if (amt.name === quoted_guid) quotedTotal += val;
        if (amt.name === closed_guid) closedTotal += val;
        if (amt.name === annualized_guid) annualizedTotal += val;
      });
    });

    return {
      newOpp: formatDollars(newOpp),
      annualized: formatDollars(annualizedTotal),
      quoted: formatDollars(quotedTotal),
      closed: formatDollars(closedTotal),
    };
  }, [filteredOutreach, opportunity_guid, quoted_guid, closed_guid, annualized_guid]);

  return (
    <div style={{ marginLeft: "20px", marginRight: "15px" }}>
      <DataFilters
        filterText={filterText}
        setFilterText={setFilterText}
        filterProspectType={filterProspectType}
        setFilterProspectType={setFilterProspectType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        prospectTypes={prospectTypes}
        teams={teams}
        dataTeams={dataTeams}
        setDataTeams={setDataTeams}
      />

      {filteredOutreach.length === 0 ? (
        <div style={{ margin: "200px auto", textAlign: "center", fontStyle: "italic", color: "#555" }}>
          No data to report on.
        </div>
      ) : (
        <>
          {/* Totals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
            <div style={{ background: "#fff", borderRadius: "12px", textAlign: "center" }}>
              <h2>{totals.newOpp}</h2>
              <p>{opportunity_label}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "12px", textAlign: "center" }}>
              <h2>{totals.annualized}</h2>
              <p>{annualized_label}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "12px", textAlign: "center" }}>
              <h2>{totals.quoted}</h2>
              <p>{quoted_label}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "12px", textAlign: "center" }}>
              <h2>{totals.closed}</h2>
              <p>{closed_label}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", marginBottom: "20px" }}>
            {/* Action Summary */}
            <div style={{ background: "#fff", padding: "10px", borderRadius: "12px" }}>
              <h3 style={{ textAlign: "center" }}>Action Summary</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={actionSummaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Call Types */}
            <div style={{ background: "#fff", padding: "10px", borderRadius: "12px" }}>
              <h3 style={{ textAlign: "center" }}>Call Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={callTypesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px" }}>
            {/* Client/Prospect Types */}
            <div style={{ background: "#fff", padding: "10px", borderRadius: "12px" }}>
              <h3 style={{ textAlign: "center" }}>Client/Prospect Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={clientTypesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Actions & Revenue */}
            <div style={{ background: "#fff", padding: "10px", borderRadius: "12px" }}>
              <h3 style={{ textAlign: "center" }}>Monthly Actions & Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => formatDollars(value)} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    content={
                      <CustomMonthlyTooltip
                        opportunityLabel={opportunity_label}
                        quotedLabel={quoted_label}
                        closedLabel={closed_label}
                      />
                    }
                  />
                  <Legend content={<MonthlyLegend />} />
                  <Bar yAxisId="left" dataKey="newOpp" stackId="a" fill="#2563eb" name={opportunity_label} />
                  <Bar yAxisId="left" dataKey="quoted" stackId="a" fill="#f97316" name={quoted_label} />
                  <Bar yAxisId="left" dataKey="closed" stackId="a" fill="#16a34a" name={closed_label} />
                  <Line yAxisId="right" type="monotone" dataKey="actions" stroke="#000" name="Actions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardsTab;
