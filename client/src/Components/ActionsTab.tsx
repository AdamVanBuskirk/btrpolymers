import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Core/hooks";
import {
  getCompany,
  saveCustomActionsAndAmmounts,
  saveGoal,
  setCompanyActions,
  setCompanyAmounts,
} from "../Store/Company";
import { CompanyAction } from "../Models/CompanyAction";
import { CompanyAmount } from "../Models/CompanyAmount";

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpointPx}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // set immediately + subscribe
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [breakpointPx]);

  return isMobile;
}

function ActionsTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);

  const isMobile = useIsMobile(768);

  const [goal, setGoal] = useState("");
  const [prospectVisibility, setProspectVisibility] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const successTimerRef = useRef<number | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [companyActions, setStateCompanyActions] = useState<CompanyAction[]>([]);
  const [companyAmounts, setStateCompanyAmounts] = useState<CompanyAmount[]>([]);
  const [amountErrors, setAmountErrors] = useState<
    Record<string, { label?: boolean; placeholder?: boolean }>
  >({});

  // Sync when companyState changes
  useEffect(() => {
    if (companyState.company) {
      setGoal(companyState.company.actionGoal?.toString() || "");
      setProspectVisibility(companyState.company.prospectVisibility || "");
    }

    if (companyState.companyActions?.length) {
      setStateCompanyActions(companyState.companyActions);
    } else {
      // keep local edits if user is typing; don’t force-clear
    }

    if (companyState.companyAmounts?.length) {
      setStateCompanyAmounts(companyState.companyAmounts);
    } else {
      // keep local edits if user is typing; don’t force-clear
    }
  }, [companyState.company, companyState.companyActions, companyState.companyAmounts]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(e.currentTarget.value);
  };

  const handleProspectVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProspectVisibility(e.currentTarget.value);
  };

  const handleActionChange = (id: string, value: string) => {
    const customActions = [...companyActions];
    const idx = customActions.findIndex((a) => a.actionId === id);

    if (idx !== -1) {
      customActions[idx] = { ...customActions[idx], name: value };
    } else {
      const actions = [...companyState.actions];
      const baseIdx = actions.findIndex((a) => a._id === id);
      if (baseIdx !== -1) {
        customActions.push({ ...actions[baseIdx], actionId: id, name: value });
      }
    }

    setStateCompanyActions(customActions);
  };

  const handleAmountChange = (id: string, key: "label" | "placeholder", value: string) => {
    const customAmounts = [...companyAmounts];
    const idx = customAmounts.findIndex((a) => a.actionId === id);

    if (idx !== -1) {
      customAmounts[idx] = {
        ...customAmounts[idx],
        actionId: id,
        ...(key === "label" ? { label: value } : { placeholder: value }),
      };
    } else {
      const amounts = [...companyState.amounts];
      const baseIdx = amounts.findIndex((a) => a._id === id);
      if (baseIdx !== -1) {
        customAmounts.push({
          ...amounts[baseIdx],
          actionId: id,
          ...(key === "label" ? { label: value } : { placeholder: value }),
        });
      }
    }

    setStateCompanyAmounts(customAmounts);
  };

  const handleSaveCompanySettings = () => {
    const companyId = companyState.company?._id;
    if (!companyId) return;

    // Desktop logic: goal can be blank; if filled, must be valid int > 0
    const num = Number(goal);
    if (goal !== "") {
      if (!Number.isInteger(num) || num <= 0) {
        setError("goal");
        return;
      }
    }

    setError("");

    // Validate all company amounts and record field-level errors
    const newAmountErrors: Record<string, { label?: boolean; placeholder?: boolean }> = {};
    const cleanedAmounts: CompanyAmount[] = [];

    companyAmounts.forEach((amt) => {
      const hasLabel = amt.label?.trim();
      const hasPlaceholder = amt.placeholder?.trim();

      // If both empty, skip it (delete behavior)
      if (!hasLabel && !hasPlaceholder) return;

      // If one missing, record error
      if (!hasLabel || !hasPlaceholder) {
        newAmountErrors[amt.actionId] = {
          label: !hasLabel,
          placeholder: !hasPlaceholder,
        };
      }

      cleanedAmounts.push(amt);
    });

    if (Object.keys(newAmountErrors).length > 0) {
      setAmountErrors(newAmountErrors);
      return;
    }

    setAmountErrors({});

    // update backend: keep desktop behavior (conditional goal + prospectVisibility)
    dispatch(
      saveGoal({
        companyId,
        ...(goal !== "" ? { goal: Number(goal) } : {}),
        ...(prospectVisibility && prospectVisibility !== "" ? { prospectVisibility } : {}),
      })
    );

    // update frontend
    dispatch(setCompanyActions(companyActions));
    dispatch(setCompanyAmounts(cleanedAmounts));

    // update backend
    dispatch(
      saveCustomActionsAndAmmounts({
        companyId,
        actions: companyActions,
        amounts: cleanedAmounts,
      })
    );

    // success banner
    setSuccessMessage("Actions settings saved successfully");

    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    successTimerRef.current = window.setTimeout(() => setSuccessMessage(""), 2000);
  };

  const inputStyleMobile: CSSProperties = useMemo(
    () => ({
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "16px",
      boxSizing: "border-box",
    }),
    []
  );

  const goalInputStyle: CSSProperties = isMobile
    ? inputStyleMobile
    : {
        width: "30%",
      };

  const selectStyle: CSSProperties = isMobile
    ? inputStyleMobile
    : {
        width: "35%",
      };

  const cardHeaderStyle: CSSProperties = isMobile
    ? {
        backgroundColor: "#f7f8fa",
        padding: "10px 15px",
        borderRadius: "8px",
        fontWeight: 600,
        marginBottom: "10px",
      }
    : {
        backgroundColor: "#f7f8fa",
        padding: "10px 10px 10px 20px",
        borderRadius: "30px",
      };

  const actionGridStyle: CSSProperties = isMobile
    ? { display: "flex", flexDirection: "column", gap: "10px" }
    : {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px 10px",
      };

  const amountInputsWrapStyle: CSSProperties = isMobile
    ? { display: "flex", flexDirection: "column", gap: "10px" }
    : {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px 10px",
      };

  const actionElements = companyState.actions.map((a) => {
    const companyAction = companyActions.find((ca) => ca.actionId === a._id);
    return (
      <div key={a._id}>
        <input
          className="form-control"
          type="text"
          placeholder={a.name}
          value={companyAction?.name || ""}
          onChange={(e) => handleActionChange(a._id, e.target.value)}
          style={isMobile ? inputStyleMobile : undefined}
        />
      </div>
    );
  });

  const amountElements = companyState.amounts.map((a) => {
    const companyAmount = companyAmounts.find((ca) => ca.actionId === a._id);

    return (
      <div key={a._id} style={{ marginBottom: isMobile ? "20px" : "0px" }}>
        <div
          style={{
            margin: isMobile ? "12px 0px" : "10px 0px",
            fontSize: isMobile ? "15px" : undefined,
            lineHeight: isMobile ? 1.4 : undefined,
          }}
        >
          <b>Label:</b> <i>{a.label}</i>
          {isMobile ? (
            <>
              <br />
              <b>Placeholder:</b> <i>{a.placeholder}</i>
            </>
          ) : (
            <span style={{ paddingLeft: "10px" }}>
              <b>Placeholder:</b> <i>{a.placeholder}</i>
            </span>
          )}
        </div>

        <div style={amountInputsWrapStyle}>
          <input
            className={`form-control ${amountErrors[a._id]?.label ? "form-control-error" : ""}`}
            type="text"
            placeholder="Enter new label"
            value={companyAmount?.label || ""}
            onChange={(e) => handleAmountChange(a._id, "label", e.target.value)}
            style={isMobile ? inputStyleMobile : undefined}
          />
          <input
            className={`form-control ${
              amountErrors[a._id]?.placeholder ? "form-control-error" : ""
            }`}
            type="text"
            placeholder="Enter new placeholder"
            value={companyAmount?.placeholder || ""}
            onChange={(e) => handleAmountChange(a._id, "placeholder", e.target.value)}
            style={isMobile ? inputStyleMobile : undefined}
          />
        </div>
      </div>
    );
  });

  return (
    <div
      ref={scrollRef}
      style={{
        width: "100%",
        height: "100%",
        padding: isMobile ? "15px" : "0px 15px 15px 15px",
        overflowY: "auto",
        background: isMobile ? "#fff" : undefined,
        boxSizing: "border-box",
      }}
    >
      {successMessage && (
        <div
          ref={messageRef}
          style={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: isMobile ? "12px 16px" : "10px 15px",
            borderRadius: isMobile ? "12px" : "30px",
            marginBottom: "20px",
            fontWeight: "500",
            textAlign: isMobile ? "center" : undefined,
          }}
        >
          {successMessage}
        </div>
      )}

      <div
        style={{
          background: "#f7f8fa",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "16px",
          fontSize: "13px",
          color: "#374151",
          lineHeight: 1.5,
        }}
      >
        Use this tab to set your company-wide settings.
      </div>

      {/* Goal */}
      <div style={{ marginBottom: isMobile ? "20px" : "15px" }}>

        <div style={{
          marginBottom: "10px",
          color: "#555",
          fontSize: isMobile ? "14px" : "11pt",
          lineHeight: isMobile ? 1.4 : undefined,
        }}>
          Enter how many actions each member should perform weekly. The default is <b><i>15</i></b>.
          This setting can also be set at the Team and User level.
        </div>

        <input
          onChange={handleGoalChange}
          type="text"
          className={`form-control ${error === "goal" ? "form-control-error" : ""}`}
          placeholder="Weekly Action Goal (defaults to 15)"
          value={goal}
          style={goalInputStyle}
        />
      </div>

      {/* Prospect visibility (desktop logic retained; mobile UI stacked) */}
      <div style={{ marginBottom: isMobile ? "20px" : "15px" }}>
        <div style={{ marginBottom: "10px", color: "#555", fontSize: "11pt" }}>
          Select which prospects each member can view and submit forms for. The default is{" "}
          <b><i>The member sees only the prospects they own</i></b>.
        </div>

        <select
          value={prospectVisibility}
          onChange={handleProspectVisibilityChange}
          className="form-control"
          style={selectStyle}
        >
          <option value="">- Select -</option>
          <option value="me">The member sees only the prospects they own</option>
          <option value="team">The member sees all prospects owned by their team</option>
          <option value="company">The member sees all prospects company-wide</option>
        </select>
      </div>

      {/* Rename Actions */}
      <div style={{ marginBottom: isMobile ? "25px" : "15px" }}>
        <div style={{ marginTop: "15px", marginBottom: "15px", fontWeight: "550" }}>
          <div style={cardHeaderStyle}>Rename Actions</div>
        </div>

        <div style={actionGridStyle}>{actionElements}</div>
      </div>

      {/* Rename Amounts */}
      <div style={{ marginBottom: isMobile ? "25px" : "15px" }}>
        <div style={{ marginTop: "15px", fontWeight: "550" }}>
          <div style={cardHeaderStyle}>Rename Amounts</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "20px" : "0px" }}>
          {amountElements}
        </div>
      </div>

      <div>
        <button
          onClick={handleSaveCompanySettings}
          className="button-primary"
          style={isMobile ? { width: "100%" } : undefined}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ActionsTab;
