// src/Components/Mobile/Work.tsx
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getCompany, saveOutreach } from "../../Store/Company";
import { Outreach } from "../../Models/Outreach";
import { isValidMaskedPhone } from "../../Helpers/isValidMaskedPhone";
import { maskPhone } from "../../Helpers/maskphone";
import { cleanPhone } from "../../Helpers/cleanPhone";

interface Props {
  mode: string;
  outreach?: Outreach;
  cancelEditHandler?: () => void;
}

function Work(props: Props) {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);

  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // ✅ NEW
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({});
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeField, setActiveField] = useState<"company" | "firstName" | "lastName" | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (props.mode === "update" && props.outreach) {
      const o: any = props.outreach;

      const checkboxMap: { [key: string]: boolean } = {};
      const valueMap: { [key: string]: string } = {};

      if (Array.isArray(o.actions)) {
        o.actions.forEach((a: any) => {
          if (a.value === "true" || a.value === "false") checkboxMap[a.name] = a.value === "true";
          else valueMap[a.name] = a.value;
        });
      }

      const amountsMap = Array.isArray(o.amounts)
        ? Object.fromEntries(o.amounts.map((a: any) => [a.name, a.value]))
        : {};

      setNotes(o.notes || "");
      setSuccess(o.success || false);
      setCheckboxes(checkboxMap);
      setValues(valueMap);
      setAmounts(amountsMap);
      setProspectId(o.prospectId || null);

      // ✅ NEW: allow update screen to show these if your outreach payload includes them
      setPhone(o.phone || "");
      setEmail(o.email || "");
    }
  }, [props.mode, props.outreach]);

  const isValidEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const handleSuggest = (value: string) => {
    if (!value.trim()) return setSuggestions([]);
    const text = value.toLowerCase();
    const matches = (companyState.prospects || []).filter(
      (p: any) =>
        (p.company || "").toLowerCase().includes(text) ||
        (p.firstName || "").toLowerCase().includes(text) ||
        (p.lastName || "").toLowerCase().includes(text)
    );
    setSuggestions(matches.slice(0, 5));
  };

  const handleSelectSuggestion = (s: any) => {
    setCompany(s.company || "");
    setFirstName(s.firstName || "");
    setLastName(s.lastName || "");

    // ✅ NEW
    setPhone(maskPhone(s.phone) || "");
    setEmail(s.email || "");

    setProspectId(s._id);

    const prospect = (companyState.prospects || []).find((p: any) => p._id === s._id);
    if (prospect) {
      const prospectType = (companyState.prospectTypes || []).find((t: any) => t._id === prospect?.typeId);
      if (prospectType) setType(prospectType._id);
    }

    setSuggestions([]);
    setActiveField(null);
  };

  const handleSaveOutreach = () => {
    const newErrors: { [key: string]: boolean } = {};
    const cleanedAmounts: { [key: string]: string } = {};

    // ✅ Require "Call Type" to be selected
    const callTypeAction = actions.find((a) => a.name === "Call Type"); // uses your sorted actions array

    if (callTypeAction) {
    const selected = (values[callTypeAction._id] ?? "").trim(); // values keyed by action._id (the select name)
    if (!selected) {
        newErrors[callTypeAction._id] = true; // <-- this is the key you want
    }
    } else {
    // Optional: if Call Type should ALWAYS exist in config, treat as an error
    // newErrors.callTypeMissing = true;
    }

    if (props.mode !== "update") {
      if (!type) newErrors.type = true;
      if (!company) newErrors.company = true;
      if (!firstName) newErrors.firstName = true;
      if (!lastName) newErrors.lastName = true;

      // ✅ NEW validations
      if (!phone || !isValidMaskedPhone(phone)) newErrors.phone = true;
      if (!email || !isValidEmail(email)) newErrors.email = true;
    }

    if (!notes) newErrors.notes = true;

    Object.entries(amounts).forEach(([key, value]) => {
      const raw = String(value ?? "").replace(/[$,]/g, "");
      if (raw !== "" && isNaN(Number(raw))) newErrors[key] = true;
      else cleanedAmounts[key] = raw === "" ? "0" : raw;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    dispatch(
      saveOutreach({
        outreachId: props.outreach,
        companyId: companyState.company?._id,
        prospectId,
        type,
        company,
        firstName,
        lastName,

        // ✅ NEW
        phone,
        email,

        notes,
        success,
        checkboxes,
        values,
        amounts: cleanedAmounts,
      })
    );

    if (props.mode === "update") props.cancelEditHandler?.();
    else {
      setType("");
      setCompany("");
      setFirstName("");
      setLastName("");

      // ✅ NEW
      setPhone("");
      setEmail("");

      setNotes("");
      setSuccess(false);
      setCheckboxes({});
      setValues({});
      setAmounts({});
      setProspectId(null);
      setSuggestions([]);
      setActiveField(null);
    }

    setSuccessMessage("Outreach saved successfully");

    setTimeout(() => {
      if (messageRef.current) messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      else scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    successTimerRef.current = window.setTimeout(() => setSuccessMessage(""), 3000);
  };

  const types = Array.from(companyState.prospectTypes || []).sort((a: any, b: any) => a.sort - b.sort);
  const actions = Array.from(companyState.actions || []).sort((a: any, b: any) => a.sort - b.sort);
  const dollars = Array.from(companyState.amounts || []).sort((a: any, b: any) => a.sort - b.sort);

  const options = types.map((t: any) => (
    <option key={t._id} value={t._id}>
      {t.name}
    </option>
  ));

  const formattedActionsCheckboxes = actions
    .filter((a: any) => a.type === "boolean")
    .map((action: any) => {
      const name =
        companyState.companyActions.find((c: any) => c.actionId === action._id)?.name || action.name;

      return (
        <div key={action._id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            name={action._id}
            checked={checkboxes[action._id] || false}
            onChange={(e) => setCheckboxes((prev) => ({ ...prev, [action._id]: e.target.checked }))}
          />
          <label>{name}</label>
        </div>
      );
    });

  const formattedActionsNoCheckboxes = actions
    .filter((a: any) => a.type !== "boolean")
    .map((action: any) => {
      const name =
        companyState.companyActions.find((c: any) => c.actionId === action._id)?.name || action.name;

      const choices = action.type === "integer" ? [1, 2, 3, 4, 5] : action.values || [];

      return (
        <div key={action._id}>
          <select
            name={action._id}
            className={`form-control ${errors[action._id] ? "form-control-error" : ""}`}
            value={values[action._id] || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [action._id]: e.target.value }))}
          >
            <option value="">{name}</option>
            {choices.map((v: any) => (
              <option key={`${action._id}-${v}`} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      );
    });

  const formattedDollars = dollars.map((d: any) => {
    const companyAmount = companyState.companyAmounts.find((c: any) => c.actionId === d._id);
    const label = companyAmount?.label || d.label;

    return (
      <div key={d._id}>
        <input
          type="text"
          name={d._id}
          className={`form-control ${errors[d._id] ? "form-control-error" : ""}`}
          placeholder={label}
          value={amounts[d._id] || ""}
          onChange={(e) => setAmounts((prev) => ({ ...prev, [d._id]: e.target.value }))}
        />
      </div>
    );
  });

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    zIndex: 9999,
    marginTop: "4px",
    width: "100%",
    maxHeight: "150px",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const suggestionItemStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  };

  return (
    <div
      ref={scrollRef}
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "18px 20px 100px 20px",
        boxSizing: "border-box",
        position: "relative",
        background: "#f7f8fa",
      }}
    >
      {successMessage && (
        <div
          ref={messageRef}
          style={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "10px 15px",
            borderRadius: "20px",
            margin: "10px 0",
            fontWeight: "500",
          }}
        >
          {successMessage}
        </div>
      )}

      {props.mode === "create" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
          <select
            className={`form-control ${errors.type ? "form-control-error" : ""}`}
            value={type}
            onChange={(e) => setType(e.currentTarget.value)}
          >
            <option value="">Select a Type*</option>
            {options}
          </select>

          {(["company", "firstName", "lastName"] as const).map((field) => (
            <div key={field} style={{ position: "relative" }}>
              <input
                className={`form-control ${errors[field] ? "form-control-error" : ""}`}
                placeholder={field === "company" ? "Company*" : field === "firstName" ? "First Name*" : "Last Name*"}
                value={field === "company" ? company : field === "firstName" ? firstName : lastName}
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  if (field === "company") setCompany(val);
                  else if (field === "firstName") setFirstName(val);
                  else setLastName(val);

                  setProspectId(null);
                  setActiveField(field);
                  handleSuggest(val);
                }}
              />

              {activeField === field && suggestions.length > 0 && (
                <div style={dropdownStyle}>
                  {suggestions.map((s) => (
                    <div key={s._id} style={suggestionItemStyle} onClick={() => handleSelectSuggestion(s)}>
                      {s.company} - {s.firstName} {s.lastName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* ✅ NEW: PHONE */}
          <input
            className={`form-control ${errors.phone ? "form-control-error" : ""}`}
            placeholder="Phone*"
            value={phone}
            onChange={(e) => setPhone(maskPhone(cleanPhone(e.currentTarget.value)))}
          />

          {/* ✅ NEW: EMAIL */}
          <input
            className={`form-control ${errors.email ? "form-control-error" : ""}`}
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>
      )}

      <textarea
        rows={6}
        className={`form-control ${errors.notes ? "form-control-error" : ""}`}
        style={{
          width: "100%",
          marginTop: "20px",
          borderRadius: "10px",
          padding: "10px",
        }}
        placeholder="Briefly describe your communication here, and the customer's response, as well as your next follow up action(s).*"
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
      />

      <div style={{ marginTop: "10px" }}>
        <input type="checkbox" checked={success} onChange={(e) => setSuccess(e.currentTarget.checked)} /> Success of the
        Week?
      </div>

      <div style={{ marginTop: "20px", fontWeight: 600 }}>Proactive Actions</div>
      <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {formattedActionsCheckboxes}
      </div>

      <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {formattedActionsNoCheckboxes}
      </div>

      <div style={{ marginTop: "20px", fontWeight: 600 }}>Sales Growth Amounts</div>
      <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {formattedDollars}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
        {props.mode === "update" && props.cancelEditHandler && (
          <button onClick={props.cancelEditHandler} className="button-primary-cancel" style={{ flex: 1 }}>
            Cancel
          </button>
        )}
        <button onClick={handleSaveOutreach} className="button-primary" style={{ flex: 1 }}>
          Save
        </button>
      </div>

      <div style={{ height: "120px" }} />
    </div>
  );
}

export default Work;
