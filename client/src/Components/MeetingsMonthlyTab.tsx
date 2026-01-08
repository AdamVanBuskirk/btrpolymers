import { useMemo } from "react";
import { useIsMobile } from "../Core/hooks";

function MeetingsMonthlyTab() {
  const isMobile = useIsMobile();

  const content = useMemo(() => {
    return {
      title: "Outgrow Monthly Review",
      subtitle: "For Managers: 10 Minutes Per Outgrower",
      overview: [
        "The Monthly Review is done individually, with managers meeting one-on-one with each Outgrower for no more than 10 minutes each.",
        "If you are the top executive and the implementation leader, you are having these meetings with your frontline, customer-facing Outgrow participants.",
        "For larger companies, managers have these meetings with each Outgrower on their team, and you meet separately to discuss the results with managers.",
      ],
      prep: [
        "The key is for each Outgrower to send their manager the details on the Monthly Review form in advance of the meeting.",
        "At a minimum, they should come to the meeting with this form filled out and submitted.",
      ],
      structure:
        "The meeting is a five-minute look back and a five-minute look forward. Because it’s so short, it can be added to another conversation you are having.",
      emphasis:
        "It’s important for the Outgrower to come prepared—especially with the top half of the form, looking back on the previous month.",
      lookBackTitle: "Look Back (5 Minutes)",
      lookBackBullets: [
        "Did I swing the bat and make proactive communications?",
        "Did I meet the target communications number?",
        "Top results for the month: Top 3 opportunities opened, Top 3 progressed forward, and Top 3 closed.",
      ],
      lookForwardTitle: "Look Forward (5 Minutes)",
      lookForwardBullets: [
        "Top Wallet Share Expansion priorities this month (customer name, how to expand volume on current products/services, products/services to add, internal referral opportunities).",
        "DYK product and service priorities.",
        "Referral focus and priorities: customers likely to have additional internal buyers and who should be asked for a referral to another buyer at another firm.",
      ],
      close:
        "This meeting sends each participant into a new month of Outgrow proactivity with clear guidelines and expectations—so they’re not wondering who to call and what to ask about.",
    };
  }, []);

  const Card = ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        padding: isMobile ? "18px 16px" : "22px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: isMobile ? "14px 14px" : "16px 18px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ color: "#374151", lineHeight: 1.7 }}>{children}</div>
    </div>
  );

  const PdfLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "block",
        fontWeight: 700,
        color: "#2563eb",
        textDecoration: "none",
        marginBottom: 8,
      }}
    >
      {label}
    </a>
  );

  return (
    <div
      className="rightContentDefault"
      style={{
        height: "calc(100vh - 53.16px)",
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#f9fafb",
          padding: "12px 12px 10px 12px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: 900,
                  color: "#111827",
                  lineHeight: 1.15,
                }}
              >
                Meetings
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                Monthly review playbook
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#111827",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
              title="Recommended duration per Outgrower"
            >
              ⏱️ 10 min / Outgrower
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px 16px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Card style={{ marginTop: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: 6,
                    fontSize: isMobile ? "18px" : "20px",
                    color: "#111827",
                  }}
                >
                  {content.title}
                </h2>
                <div style={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
                  {content.subtitle}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 12,
                }}
              >
                <SectionCard title="How it works">
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.overview.map((t, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title="Prep (required)">
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.prep.map((t, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>

              <SectionCard title="Meeting structure">
                <div style={{ marginBottom: 8 }}>{content.structure}</div>
                <div
                  style={{
                    border: "1px solid rgba(17,24,39,0.10)",
                    background: "#f9fafb",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontWeight: 650,
                    color: "#111827",
                  }}
                >
                  {content.emphasis}
                </div>
              </SectionCard>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 12,
                }}
              >
                <SectionCard title={content.lookBackTitle}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.lookBackBullets.map((b, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title={content.lookForwardTitle}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.lookForwardBullets.map((b, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: 14,
                  color: "#374151",
                  lineHeight: 1.7,
                }}
              >
                {content.close}
              </div>

              {/* Notes & Tools */}
              <SectionCard title="Tools">
                <PdfLink
                  href="/images/outgrow-monthly-review-1.pdf"
                  label="Outgrow Monthly Review - A Look Back At Last Month"
                />
                <PdfLink
                  href="/images/outgrow-monthly-review-2.pdf"
                  label="Outgrow Monthly Review - A Look Forward To This Month"
                />
                <PdfLink
                  href="/images/outgrow-wallet-share-expander.pdf"
                  label="Outgrow Wallet Share Expander"
                />
              </SectionCard>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MeetingsMonthlyTab;
