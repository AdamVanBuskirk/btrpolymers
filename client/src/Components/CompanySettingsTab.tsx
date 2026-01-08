import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useAppDispatch, useAppSelector, useIsMobile } from "../Core/hooks";
import { getCompany, saveCompany, setCompany } from "../Store/Company";

const TIMEZONE_OPTIONS = [
  { label: "Eastern - America/New_York", value: "America/New_York" },
  { label: "Central - America/Chicago", value: "America/Chicago" },
  { label: "Mountain - America/Denver", value: "America/Denver" },
  { label: "Arizona - America/Phoenix", value: "America/Phoenix" },
  { label: "Pacific - America/Los_Angeles", value: "America/Los_Angeles" },
  { label: "Alaska - America/Anchorage", value: "America/Anchorage" },
  { label: "Hawaii - Pacific/Honolulu", value: "Pacific/Honolulu" }
];

function CompanySettingsTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);

  const isMobile = useIsMobile();

  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [industry, setIndustry] = useState("");
  const [timezone, setTimezone] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Controls when we show "invalid" styling (prevents red border on initial load)
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync local state from store
  useEffect(() => {
    const company = companyState.company;
    if (!company) return;

    if (company.name !== name) setName(company.name || "");
    if (company.logo !== logo) setLogo(company.logo || "");
    if (company.industryId !== industry) setIndustry(company.industryId || "");

    const storeTimezone = ((company as any).timezone as string) || "";
    if (storeTimezone !== timezone) setTimezone(storeTimezone);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyState.company]);

  // Handle delete logo
  useEffect(() => {
    if (logo === "delete") {
      setLogo("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      handleSaveCompanySettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logo]);

  const styles = useMemo(() => {
    const desktopInputBase: CSSProperties = { width: "30%" };

    const mobileField: CSSProperties = {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "16px",
      backgroundColor: "#fff"
    };

    return {
      container: isMobile
        ? ({
            width: "100vw",
            padding: "20px",
            margin: "0px auto",
            background: "#fff"
          } as CSSProperties)
        : ({
            marginLeft: "20px",
            marginTop: "15px"
          } as CSSProperties),

      messageBoxSuccess: isMobile
        ? ({
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: "500",
            textAlign: "center"
          } as CSSProperties)
        : ({
            width: "30%",
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "10px 15px",
            borderRadius: "30px",
            margin: "0px 0px 20px 0px",
            fontWeight: "500"
          } as CSSProperties),

      messageBoxError: isMobile
        ? ({
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: "500",
            textAlign: "center"
          } as CSSProperties)
        : ({
            width: "30%",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "10px 15px",
            borderRadius: "30px",
            margin: "0px 0px 20px 0px",
            fontWeight: "500"
          } as CSSProperties),

      inputText: isMobile ? mobileField : desktopInputBase,
      select: isMobile ? mobileField : desktopInputBase,

      file: isMobile
        ? ({
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "15px"
          } as CSSProperties)
        : desktopInputBase,

      logoWrap: isMobile
        ? ({
            marginTop: "15px",
            marginBottom: "20px",
            textAlign: "center"
          } as CSSProperties)
        : ({
            width: "30%",
            marginTop: "15px",
            marginBottom: "15px"
          } as CSSProperties),

      logoImg: isMobile
        ? ({
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "8px",
            marginBottom: "8px"
          } as CSSProperties)
        : ({
            maxWidth: "100px"
          } as CSSProperties),

      deleteText: isMobile
        ? ({
            cursor: "pointer",
            textDecoration: "underline",
            color: "#6b7280",
            fontSize: "14px"
          } as CSSProperties)
        : ({
            cursor: "pointer",
            textDecoration: "underline",
            textAlign: "center",
            marginTop: "5px"
          } as CSSProperties),

      saveBtnStyle: isMobile ? ({ width: "100%" } as CSSProperties) : ({} as CSSProperties)
    };
  }, [isMobile]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.currentTarget.value);
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimezone(e.currentTarget.value);
    setErrorMessage("");
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const base64ToBlob = (base64: string): Blob => {
    if (!base64 || typeof base64 !== "string" || !base64.includes(",")) {
      return new Blob([], { type: "image/jpeg" });
    }

    const parts = base64.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const byteString = atob(parts[1]);

    let n = byteString.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = byteString.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  const handleSaveCompanySettings = () => {
    setHasAttemptedSave(true);

    if (!timezone) {
      setErrorMessage("Please select a timezone");
      setSuccessMessage("");
      window.setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setErrorMessage("");

    if (!logo) {
      saveCompanyInfo("");
      return;
    }

    try {
      Resizer.imageFileResizer(
        base64ToBlob(logo),
        300,
        300,
        "JPEG",
        80,
        0,
        async (uri) => {
          saveCompanyInfo(uri as string);
        },
        "base64",
        200,
        200
      );
    } catch (err) {
      saveCompanyInfo("");
    }
  };

  const saveCompanyInfo = (resizedLogo: string) => {
    const id = companyState.company?._id;

    dispatch(
      saveCompany({
        _id: id!,
        name,
        logo: resizedLogo,
        industryId: industry,
        timezone
      } as any)
    );

    dispatch(
      setCompany({
        _id: id!,
        name,
        logo: resizedLogo,
        created: new Date(),
        modified: new Date(),
        active: true,
        ...(industry !== "" && { industryId: industry }),
        ...(timezone !== "" && { timezone })
      } as any)
    );

    setSuccessMessage("Company saved successfully");
    setErrorMessage("");
    window.setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <div style={styles.container}>
      {errorMessage && <div style={styles.messageBoxError}>{errorMessage}</div>}
      {successMessage && <div style={styles.messageBoxSuccess}>{successMessage}</div>}

      <div style={{ marginBottom: "15px" }}>
        <input
          onChange={handleNameChange}
          type="text"
          className="form-control"
          placeholder="Company Name"
          value={name}
          style={styles.inputText}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <select
          onChange={handleIndustryChange}
          value={industry}
          className="form-control"
          style={styles.select}
        >
          <option value="">Select an Industry</option>
          {companyState.industries.map((ind) => (
            <option key={ind._id} value={ind._id}>
              {ind.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <select
          onChange={handleTimezoneChange}
          value={timezone}
          className="form-control"
          style={{
            ...styles.select,
            borderColor: hasAttemptedSave && !timezone ? "#dc2626" : undefined
          }}
        >
          <option value="">Select a Timezone</option>
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleLogoChange}
          ref={fileInputRef}
          style={styles.file}
        />
      </div>

      {companyState.company?.logo && (
        <div style={styles.logoWrap}>
          <div style={{ textAlign: "center" }}>
            <img src={logo} alt="Company Logo" style={styles.logoImg} />
          </div>

          <div onClick={() => setLogo("delete")} style={styles.deleteText}>
            Delete
          </div>
        </div>
      )}

      <div>
        <button
          onClick={handleSaveCompanySettings}
          className="button-primary"
          style={styles.saveBtnStyle}
          // ✅ IMPORTANT: do NOT disable the button, or validation can’t run
          title={!timezone ? "Select a timezone to save" : ""}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CompanySettingsTab;
