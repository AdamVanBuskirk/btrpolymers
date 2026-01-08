import React from "react";
import { useAppDispatch, useAppSelector, useIsMobile } from "../Core/hooks";
import { getOtherCompanies, getSettings, loadSubComponent, setStatsScope, setStatsTeam, setStatsTimeframe, updateLoadedCompanyId } from "../Store/Settings";
import { getCompany, getCompanyInfoById } from "../Store/Company";
import { AiOutlineClose } from "react-icons/ai";
import { Company } from "../Models/Company";
import { handleLoadComponent } from "../Helpers/handleLoadComponent";

interface Props {
  onClose: () => void;
}

const SwitchCompany: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const settingsState = useAppSelector(getSettings);
  const companyState = useAppSelector(getCompany);
  const companies = settingsState.otherCompanies || [];

  const handleSelect = (companyId: string) => {
    dispatch(updateLoadedCompanyId(companyId));
    dispatch(getCompanyInfoById(companyId));
    dispatch(getOtherCompanies(companyId));
    dispatch(setStatsScope("me"));
    dispatch(setStatsTeam(""));
    dispatch(setStatsTimeframe("week"));
    onClose();
  };

  const modalStyle: React.CSSProperties = isMobile
  ? {
      position: "fixed",
      top: "15%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      background: "#fff",
      borderRadius: "14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      overflowY: "auto",
      maxHeight: "70%",
      zIndex: 2001,
      animation: "fadeIn 0.25s ease",
    }
  : {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "500px",
      maxHeight: "80vh",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      overflowY: "auto",
      zIndex: 2001,
      animation: "fadeIn 0.25s ease",
    };


  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            borderBottom: "1px solid #eee",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "14pt" }}>Switch Company</h3>
          <AiOutlineClose
            size={18}
            color="#555"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </div>

        {/* Company list */}
        <div style={{ padding: "20px" }}>
          {companies.length === 0 ? (
            <div style={{ textAlign: "center", color: "#777" }}>
              No other companies found.
            </div>
          ) : (
            companies.map((company: Company) => {
              let industry = companyState.industries.find(i => i._id === company.industryId);
              const hasInfo = company.name || company.logo || company.industryId;
              return (
                <div
                  key={company._id}
                  onClick={() => handleSelect(company._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "10px 12px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f4f5f7")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: "10pt", color: "#999" }}>🏢</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "11pt" }}>
                      {company.name || "Unknown Company"}
                    </div>
                    <div style={{ fontSize: "9pt", color: "#777" }}>
                      {(company.industryId && industry) ? `Industry: ${industry.name}` : "No industry info"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default SwitchCompany;
