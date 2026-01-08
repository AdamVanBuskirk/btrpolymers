import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { ProspectType } from "../../Models/ProspectType";
import { getCompany, saveOutreach, setOutreach } from "../../Store/Company";
import { Outreach } from "../../Models/Outreach";
import { fireConfetti } from "../Controls/Confetti";
import { maskPhone } from "../../Helpers/maskphone";
import { cleanPhone } from "../../Helpers/cleanPhone";
import { isValidMaskedPhone } from "../../Helpers/isValidMaskedPhone";

interface Props {
    mode: string;
    outreach?: Outreach;
    cancelEditHandler?: () => void;
    //cancelDeleteHandler?: () => void;
}

function Work(props: Props) {
    
    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const [type, setType] = useState("");
    const [company, setCompany] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [success, setSuccess] = useState(false);
    const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({});
    const [values, setValues] = useState<{ [key: string]: string }>({});
    const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [successMessage, setSuccessMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const messageRef = useRef<HTMLDivElement | null>(null);
    const successTimerRef = useRef<number | null>(null);
    const [prospectId, setProspectId] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [activeField, setActiveField] = useState<"company" | "firstName" | "lastName" | null>(null);

    useEffect(() => {
        return () => {
          if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (props.mode === "update" && props.outreach) {
          const o = props.outreach;
      
          // Map actions: separate checkbox vs others
          const checkboxMap: { [key: string]: boolean } = {};
          const valueMap: { [key: string]: string } = {};
      
          if (Array.isArray(o.actions)) {
            o.actions.forEach(a => {
              if (a.value === "true" || a.value === "false") {
                checkboxMap[a.name] = a.value === "true";
              } else {
                valueMap[a.name] = a.value;
              }
            });
          }

          const amountsMap = Array.isArray(o.amounts)
          ? Object.fromEntries(o.amounts.map(a => [a.name, a.value]))
          : {};
      
          setNotes(o.notes || "");
          setSuccess(o.success || false);
          setCheckboxes(checkboxMap);
          setValues(valueMap);
          setAmounts(amountsMap);
          setProspectId(o.prospectId || null);
        }
    }, [props.mode, props.outreach]);
      

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.currentTarget.value);
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        setCompany(val);
        setProspectId(null); // reset if typing
        setActiveField("company");
        handleSuggest(val);
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        setFirstName(val);
        setProspectId(null);
        setActiveField("firstName");
        handleSuggest(val);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        setLastName(val);
        setProspectId(null);
        setActiveField("lastName");
        handleSuggest(val);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(maskPhone(cleanPhone(e.currentTarget.value)));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.currentTarget.value);
    };

    const handleSuccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSuccess(e.currentTarget.checked);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCheckboxes(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmounts(prev => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleSuggest = (value: string) => {
        if (!value.trim()) {
          setSuggestions([]);
          return;
        }
      
        const text = value.toLowerCase();
        const matches = companyState.prospects.filter(
          (p: any) =>
            p.company.toLowerCase().includes(text) ||
            p.firstName.toLowerCase().includes(text) ||
            p.lastName.toLowerCase().includes(text)
        );
      
        setSuggestions(matches.slice(0, 5)); // limit to 5 suggestions
    };
    
    const handleSelectSuggestion = (s: any) => {
        setCompany(s.company);
        setFirstName(s.firstName);
        setLastName(s.lastName);
        setPhone(maskPhone(s.phone) || "");
        setEmail(s.email || "");
        setProspectId(s._id);

        let prospect = companyState.prospects.find(p => p._id === s._id);
        if (prospect) {
            let prospectType = companyState.prospectTypes.find(t => t._id === prospect?.typeId);
            if (prospectType) {
                setType(prospectType._id);
            }
        }
        setSuggestions([]); // hide suggestions
        setActiveField(null);
    };

    const isValidEmail = (val: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(val.trim());
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
            if (!phone || !isValidMaskedPhone(phone)) newErrors.phone = true;
            if (!email || !isValidEmail(email)) newErrors.email = true;
        }
        
        if (!notes) newErrors.notes = true;
      
        // Check dollar fields
        Object.entries(amounts).forEach(([key, value]) => {
            const raw = String(value ?? "").replace(/[$,]/g, "");
        
            if (raw !== "" && isNaN(Number(raw))) {
                newErrors[key] = true;
            } else {
                cleanedAmounts[key] = raw === "" ? "0" : raw;
            }
        });
        
        setErrors(newErrors);
      
        // Only proceed if no errors
        if (Object.keys(newErrors).length === 0) {
            
            // save frontend
            if (props.mode === "update" && props.outreach) {
                let outreach = [...companyState.outreach];
                let index = outreach.findIndex(o => o._id === props.outreach?._id);
                if (index !== -1) {
                    const safeAmounts = (amounts && typeof amounts === "object" && !Array.isArray(amounts)) ? amounts : {};
                    const safeCheckboxes = (checkboxes && typeof checkboxes === "object" && !Array.isArray(checkboxes)) ? checkboxes : {};
                    const safeValues = (values && typeof values === "object" && !Array.isArray(values)) ? values : {};

                    const checkboxStrings = Object.fromEntries(
                        Object.entries(safeCheckboxes).map(([k, v]) => [k, String(v)])
                    );

                    const formattedAmounts = Object.entries(cleanedAmounts).map(
                        ([name, value]) => ({ name, value })
                    );
                    
                    const formattedActions = Object.entries({
                        ...checkboxStrings,
                        ...safeValues,
                    }).map(([name, value]) => ({ name, value: String(value) }));

                    outreach[index] = {
                        ...props.outreach,
                        notes: notes, 
                        actions: formattedActions, 
                        amounts: formattedAmounts, 
                        success,
                    };
                    dispatch(setOutreach(outreach));
                }
            }

            // 🔹 How many actions are on the form right now
            const newOutreachActionsCount = getOutreachActionsCount();

            // 🔹 For updates, only count the *net new* actions vs what was already saved
            let deltaActions = newOutreachActionsCount;

            if (props.mode === "update" && props.outreach) {
                const previousActionsCount = getSavedOutreachActionsCount(props.outreach);
                deltaActions = Math.max(0, newOutreachActionsCount - previousActionsCount);
            }

            const actionGoal = companyState.company?.actionGoal ?? 15;
            const weeklyActions = getWeeklyActionsCompleted();

            console.log(
                "Weekly Actions:", weeklyActions,
                " New Outreach Actions:", newOutreachActionsCount,
                " Delta:", deltaActions,
                " Action Goal:", actionGoal
            );

            if (deltaActions > 0 && weeklyActions + deltaActions >= actionGoal) {
                fireConfetti();
            }

            // save backend
            dispatch(saveOutreach({ 
                outreachId: props.outreach,
                companyId: companyState.company?._id,
                prospectId,
                type, 
                company, 
                firstName, 
                lastName, 
                phone,
                email,
                notes, 
                success, 
                checkboxes, 
                values, 
                amounts: cleanedAmounts
            }));

            // update logic 
            if (props.mode === "update") {
                props.cancelEditHandler?.();
            } else {                
                // Clear all form values
                setType("");
                setCompany("");
                setFirstName("");
                setLastName("");
                setPhone("");
                setEmail("");
                setNotes("");
                setSuccess(false);
                setCheckboxes({});
                setValues({});
                setAmounts({});
            }

            // Show success message
            setSuccessMessage("Outreach saved successfully");
            
            if (messageRef.current) {
                messageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            } else if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        
            if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
            successTimerRef.current = window.setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        }
    };
      

    let types = [...companyState.prospectTypes].sort((a, b) => a.sort - b.sort);
    let actions = [...companyState.actions].sort((a, b) => a.sort - b.sort);
    let dollars = [...companyState.amounts].sort((a, b) => a.sort - b.sort);

    let options = types.map(t => {
        return (
            <option value={t._id}>{t.name}</option>
        )
    })

    let formattedActionsCheckboxes = [...actions].filter(a => a.type === "boolean").map(action => {
        let name = action.name;
        let companyAction = companyState.companyActions.find(c => c.actionId === action._id);
        if (companyAction) {
            name = companyAction.name;
        }
        if (action.type === "boolean") {
            return (
                <div key={action._id} style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        name={action._id}
                        style={{ border: "1px solid #f7f8fa" }}    
                        checked={checkboxes[action._id] || false}
                        onChange={handleCheckboxChange}
                    /> {name}
                </div>
            );
        }
    })

    let formattedActionsNoCheckboxes = [...actions].filter(a => a.type !== "boolean").map(action => {
        let name = action.name;
        let companyAction = companyState.companyActions.find(c => c.actionId === action._id);
        if (companyAction) {
            name = companyAction.name;
        }
        if (action.type === "integer") {
            return (
                <div key={action._id} style={{ marginRight: "10px"  }}>
                    <select
                        name={action._id}
                        className={`form-control ${errors[action._id] ? "form-control-error" : ""}`}
                        value={values[action._id] || "0"} // default
                        onChange={handleSelectChange}    
                    >
                        <option value="">{name}</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
            );
        } else if (action.type === "string") {
            return (
                <div key={action._id} style={{ marginRight: "10px"  }}>
                    <select
                        name={action._id}
                        className={`form-control ${errors[action._id] ? "form-control-error" : ""}`}
                        value={values[action._id] || ""} // default
                        onChange={handleSelectChange}
                    >
                        <option value="">{name}</option>
                        {action.values.map(value => {
                            return (
                                <option value={value}>{value}</option>
                            )
                        })}
                    </select>
                </div>
            );
        }
    });

    // 🔹 Count "actions" for this outreach
    const getOutreachActionsCount = () => {
        let count = 0;

        actions.forEach((action) => {
          if (action.type === "boolean") {
            if (checkboxes[action._id]) {
              count += 1;
            }
          } else if (action.type === "integer") {
            const val = values[action._id];
            if (val) {
              const n = Number(val);
              if (!isNaN(n)) count += n;
            }
          }
        });

        return count;
    };

    let formattedDollars = [...dollars].map(dollar => {
        let label = dollar.label;
        let placeholder = dollar.placeholder;
        let companyAmount = companyState.companyAmounts.find(c => c.actionId === dollar._id);
        if (companyAmount) {
            label = companyAmount.label;
            placeholder = companyAmount.placeholder;
        }
        return (
            <div style={{ marginRight: "10px" }}>
                <input
                    type="text"
                    name={dollar._id}
                    className={`form-control ${errors[label] ? "form-control-error" : ""}`}
                    placeholder={label} 
                    value={amounts[dollar._id] || ""} // default
                    onChange={handleAmountChange} 
                /> 
            </div>
        );
    })

    const dropdownStyle: React.CSSProperties = {
        position: "absolute",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "10px",
        zIndex: 10,
        marginTop: "5px",
        width: "300px"
    };
      
    const itemStyle: React.CSSProperties = {
        padding: "5px",
        cursor: "pointer"
    };


    // 🔹 Get total actions completed this week (Sun–Sat) from all outreach
    const getWeeklyActionsCompleted = () => {
        const now = new Date();
        
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sun

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        let total = 0;

        (companyState.outreach || []).forEach((o) => {
          const created = new Date(o.created);
          if (created >= startOfWeek && created <= endOfWeek) {
            o.actions?.forEach((a) => {
              const val = String(a.value).toLowerCase().trim();
              if (!isNaN(Number(val)) && val !== "") total += Number(val);
              else if (val === "true") total += 1;
            });
          }
        });

        return total;
    };

    // 🔹 Count actions for an existing outreach record (from backend)
    const getSavedOutreachActionsCount = (o: Outreach) => {
        let count = 0;
      
        o.actions?.forEach((a) => {
          const val = String(a.value).toLowerCase().trim();
          if (!isNaN(Number(val)) && val !== "") {
            count += Number(val);
          } else if (val === "true") {
            count += 1;
          }
        });
      
        return count;
    };
  
      
    return (
        <div className={`${props.mode === "update" ? "" : "rightContentDefault"}`}
            style={{ position: "relative" }}>

            {successMessage && (
                <div 
                    ref={messageRef}
                    style={{ 
                        backgroundColor: "#d1fae5", 
                        color: "#065f46", 
                        padding: "10px 15px", 
                        borderRadius: "30px", 
                        margin: "20px 10px 0px 10px",
                        fontWeight: "500"
                }}>
                    {successMessage}
                </div>
            )}
            <div ref={scrollRef} style={{ width: "100%", height: "100%", marginLeft: "10px", overflowY: "auto" }}>

                <div style={{ marginTop: "20px", marginRight: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", backgroundColor: "#f7f8fa", padding: "10px 10px 10px 20px", borderRadius: "30px" }}>
                        {props.mode === "update" ?
                            <div style={{ fontWeight: "550" }}>
                                Notes
                            </div>
                        :
                            <>
                            <div style={{ fontWeight: "550" }}>
                                Client / Prospect
                            </div>
                            <div style={{ paddingLeft: "10px", fontStyle: "italic", fontSize: "10pt", position: "relative", top: "2px" }}>
                                * indicates a required field
                            </div>
                            </>
                        }
                    </div>
                </div>
                {props.mode === "create" && 
                    <div
                        style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                        gap: "10px",
                        marginBottom: "10px",
                        marginRight: "20px",
                        alignItems: "flex-start",
                        }}
                    >
                        {/* ---- TYPE ---- */}
                        <div>
                        <select
                            className={`form-control ${errors.type ? "form-control-error" : ""}`}
                            style={{ width: "100%" }}
                            value={type}
                            onChange={handleTypeChange}
                        >
                            <option value="">Select a Type*</option>
                            {options}
                        </select>
                        </div>

                        {/* ---- COMPANY ---- */}
                        <div style={{ position: "relative" }}>
                        <input
                            className={`form-control ${errors.company ? "form-control-error" : ""}`}
                            style={{ width: "100%" }}
                            placeholder="Company*"
                            value={company}
                            onChange={handleCompanyChange}
                        />
                        {activeField === "company" && suggestions.length > 0 && (
                            <div style={dropdownStyle}>
                            {suggestions.map((s) => (
                                <div key={s._id} style={itemStyle} onClick={() => handleSelectSuggestion(s)}>
                                {s.company} - {s.firstName} {s.lastName}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>

                        {/* ---- FIRST NAME ---- */}
                        <div style={{ position: "relative" }}>
                        <input
                            className={`form-control ${errors.firstName ? "form-control-error" : ""}`}
                            style={{ width: "100%" }}
                            placeholder="First Name*"
                            value={firstName}
                            onChange={handleFirstNameChange}
                        />
                        {activeField === "firstName" && suggestions.length > 0 && (
                            <div style={dropdownStyle}>
                            {suggestions.map((s) => (
                                <div key={s._id} style={itemStyle} onClick={() => handleSelectSuggestion(s)}>
                                {s.company} - {s.firstName} {s.lastName}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>

                        {/* ---- LAST NAME ---- */}
                        <div style={{ position: "relative" }}>
                        <input
                            className={`form-control ${errors.lastName ? "form-control-error" : ""}`}
                            style={{ width: "100%" }}
                            placeholder="Last Name*"
                            value={lastName}
                            onChange={handleLastNameChange}
                        />
                        {activeField === "lastName" && suggestions.length > 0 && (
                            <div style={dropdownStyle}>
                            {suggestions.map((s) => (
                                <div key={s._id} style={itemStyle} onClick={() => handleSelectSuggestion(s)}>
                                {s.company} - {s.firstName} {s.lastName}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>

                        {/* ---- PHONE ---- */}
                        <div>
                        <input
                            className={`form-control ${errors.phone ? "form-control-error" : ""}`}
                            style={{ width: "100%" }}
                            placeholder="Phone*"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                        </div>

                        {/* ---- EMAIL ---- */}
                        <div>
                        <input
                            className={`form-control ${errors.email ? "form-control-error" : ""}`}
                            style={{ width: "100%" }}
                            placeholder="Email*"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        </div>
                    </div>
                    }

                <div style={{ marginTop: "20px" }}>
                    <textarea
                        rows={10}
                        className={`form-control form-control-10px-border ${errors.notes ? "form-control-error" : ""}`} 
                        style={{ width: "50%", borderRadius: "10px !important" }}
                        placeholder="Briefly describe your communication here, and the customer's response, as well as your next follow up action(s).*" 
                        value={notes}
                        onChange={handleNotesChange}    
                    />
                </div>
                <div style={{ marginTop: "10px" }}>
                    <input
                        type="checkbox" 
                        style={{ border: "1px solid #f7f8fa" }} 
                        checked={success}
                        onChange={handleSuccessChange}   
                    /> Success of the Week?
                </div>
                <div style={{ marginTop: "15px", marginRight: "20px", fontWeight: "550" }}>
                    <div style={{ backgroundColor: "#f7f8fa", padding: "10px 10px 10px 20px", borderRadius: "30px" }}>
                        Proactive Actions
                    </div>
                </div>
                <div style={{ marginTop: "20px", marginRight: "20px"  }}>      
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px 10px"
                    }}>  
                        {formattedActionsCheckboxes}  
                    </div> 
                </div>
                <div style={{ marginTop: "20px", marginRight: "20px"  }}>      
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px 10px"
                    }}>  
                        {formattedActionsNoCheckboxes}
                    </div> 
                </div>
                <div style={{ marginTop: "15px", marginRight: "20px", fontWeight: "550" }}>
                    <div style={{ backgroundColor: "#f7f8fa", padding: "10px 10px 10px 20px", borderRadius: "30px" }}>
                        Sales Growth Amounts
                    </div>
                </div>
                <div style={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px"  }}> 
                    <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "20px 10px"
                        }}>        
                        {formattedDollars}
                    </div>
                </div>
                <div>
                    {props.mode === "update" && props.cancelEditHandler &&
                        <button
                            onClick={() => props.cancelEditHandler?.()}
                            className="button-primary-cancel"
                            style={{
                                marginRight: "10px"
                            }}
                        >
                            Cancel
                        </button>
                    }
                    <button onClick={() => handleSaveOutreach()} className="button-primary">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Work;
