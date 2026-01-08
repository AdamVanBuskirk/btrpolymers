import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../Core/hooks";
import { getCompany } from "../../Store/Company";

interface DataFiltersProps {
  filterText: string;
  setFilterText: (val: string) => void;

  filterProspectType: string;
  setFilterProspectType: (val: string) => void;

  startDate: string;
  setStartDate: (val: string) => void;

  endDate: string;
  setEndDate: (val: string) => void;

  prospectTypes: Array<{ _id: string; name: string }>;

  teams?: Array<{ _id: string; name: string }>;
  dataTeams: string[];
  setDataTeams: (teamIds: string[]) => void;

  showProspectType?: boolean;
  showTeams?: boolean;
}

const DataFilters: React.FC<DataFiltersProps> = ({
  filterText,
  setFilterText,
  filterProspectType,
  setFilterProspectType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  prospectTypes,

  teams = [],
  dataTeams,
  setDataTeams,

  showProspectType = true,
  showTeams = true,
}) => {
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);

  const selectedTeamsLabel = useMemo(() => {
    if (!teams.length) return "Teams";
    if (!dataTeams.length) return "All Teams";

    const names = teams
      .filter((t) => dataTeams.includes(t._id))
      .map((t) => t.name);

    if (names.length === 0) return "All Teams";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]}, ${names[1]}`;
    return `${names[0]}, ${names[1]} +${names.length - 2}`;
  }, [teams, dataTeams]);

  const toggleTeam = (teamId: string) => {
    const exists = dataTeams.includes(teamId);
    const next = exists ? dataTeams.filter((id) => id !== teamId) : [...dataTeams, teamId];
    setDataTeams(next);
  };

  const clearTeams = () => setDataTeams([]);

  const companyState = useAppSelector(getCompany);
  const meMember = companyState.members.find(m => m.me);
  const role = meMember?.role;          // string | undefined
  const roleReady = !!role;             // only true once populated
  const canSeeTeamFilter = roleReady && role !== "member";

  // Match your site better than purple (navy/blue accent)
  const ACCENT = "#0B2230";      // deep navy (matches left nav vibe)
  const ACCENT_SOFT = "#E7EEF4"; // soft navy tint for selected row

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px",
        marginTop: "5px",
        alignItems: "center",
      }}
      className="data-filters"
    >
      {/* Text filter */}
      <input
        type="text"
        placeholder="Filter by name, notes, company..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="form-control"
        style={{ flex: "1 1 240px", minWidth: "200px" }}
      />

      {/* Teams button (light) */}
      {(showTeams && canSeeTeamFilter) && (
        <button
          type="button"
          className="form-control"
          onClick={() => setTeamDialogOpen(true)}
          style={{
            flex: "1 1 240px",
            minWidth: "200px",
            width: "100%",

            height: "38px",
            padding: "10px 14px",
            borderRadius: "999px",

            background: "#ffffff",
            border: "1px solid #ced4da",
            color: "#212529",
            boxShadow: "none",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            cursor: "pointer",
          }}
          aria-label="Select teams"
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedTeamsLabel}
          </span>

          <span
            style={{
              fontSize: "10pt",
              color: dataTeams.length ? "#0d6efd" : "#6c757d",
              whiteSpace: "nowrap",
            }}
            title={dataTeams.length ? `${dataTeams.length} selected` : "All teams"}
          >
            {dataTeams.length ? `${dataTeams.length} selected` : "All"}
          </span>
        </button>
      )}

      {/* Prospect type filter */}
      {showProspectType && (
        <select
          value={filterProspectType}
          onChange={(e) => setFilterProspectType(e.target.value)}
          className="form-control"
          style={{ flex: "1 1 180px", minWidth: "150px" }}
        >
          <option value="">All Types</option>
          {prospectTypes.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      {/* Date range */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="form-control"
        style={{ flex: "1 1 150px", minWidth: "130px" }}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="form-control"
        style={{ flex: "1 1 150px", minWidth: "130px" }}
      />

      {/* Team dialog (smaller, matches your light modal sizing) */}
      {teamDialogOpen && (
        <div
          onClick={() => setTeamDialogOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.30)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "92%",
              maxWidth: "520px",            // ✅ smaller than before
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",         // ✅ closer to your other modal
              padding: "18px 18px 16px",
              boxShadow: "0 18px 55px rgba(0,0,0,0.20)",
              maxHeight: "70vh",            // ✅ prevents jumbo feel
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div>
                <div style={{ color: "#111827", fontSize: "22px", fontWeight: 800, lineHeight: 1.1 }}>
                  Filter by Teams
                </div>
                <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "6px" }}>
                  Click teams to toggle. Leave none selected to include all teams.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTeamDialogOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6b7280",
                  fontSize: "22px",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "2px 4px",
                }}
                aria-label="Close"
                title="Close"
              >
                ×
              </button>
            </div>

            {/* List */}
            {!teams.length ? (
              <div style={{ color: "#6b7280", fontSize: "13px", padding: "10px 2px" }}>
                No teams exist within the company.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "10px",
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {teams.map((t) => {
                  const isSelected = dataTeams.includes(t._id);

                  return (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => toggleTeam(t._id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        borderRadius: "999px",
                        padding: "12px 16px",     // ✅ less jumbo
                        cursor: "pointer",
                        transition: "transform 0.12s ease, background 0.12s ease, border-color 0.12s ease",
                        background: isSelected ? ACCENT_SOFT : "#ffffff",
                        border: isSelected ? `1px solid ${ACCENT}` : "1px solid #e5e7eb",
                        color: "#111827",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "18px", fontWeight: 600 }}>{t.name}</span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: isSelected ? ACCENT : "#6b7280",
                          whiteSpace: "nowrap",
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        {isSelected ? "Selected" : "Tap to select"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                marginTop: "14px",
                paddingTop: "14px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <button
                type="button"
                onClick={clearTeams}
                style={{
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#374151",
                  borderRadius: "999px",
                  padding: "10px 16px",     // ✅ smaller
                  cursor: "pointer",
                  fontSize: "16px",
                  minWidth: "110px",
                }}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setTeamDialogOpen(false)}
                style={{
                  background: "#14804A",     // matches your Save green
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "999px",
                  padding: "10px 18px",      // ✅ smaller
                  cursor: "pointer",
                  fontSize: "16px",
                  minWidth: "110px",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilters;
