import { useMemo } from "react";
import { useIsMobile } from "../Core/hooks";

function MeetingsQuarterlyTab() {
  const isMobile = useIsMobile();

  const content = useMemo(() => {
    return {
      title: "Outgrow Quarterly Planning Meeting",
      subtitle: "90 Minutes Every Three Months",
      overview:
        "The Outgrow Quarterly Planning Meeting is 90 minutes long and is designed to be attended by leadership and all customer-facing participants.",
      lookBackTitle: "Looking Back (Prep in Advance)",
      lookBackIntro:
        "The look back is for you or your leaders to think about and prepare before the meeting.",
      lookBackBullets: [
        "Did your team swing the bat, and did the group meet your minimum target action count?",
        "The next two sections should be prepared in advance before the meeting.",
      ],
      topPerformersTitle: "Top Performers",
      topPerformersBullets: [
        "Go to the scorecards and data and identify your top performers.",
        "Have they been recognized among the team? If not, the quarterly meeting is a great time to do so.",
        "Have they been otherwise incentivized or rewarded?",
      ],
      topUnderTitle: "Top Underperformers",
      topUnderIntro:
        "List the people who underperformed your expectations—perhaps even surprising you—then answer two questions for each person:",
      topUnderBullets: [
        "Do you believe buy-in is possible for them? (Your instinct will probably be correct.)",
        "If yes, what is the buy-in plan?",
      ],
      buyInPlanExamplesTitle: "Buy-in plan examples",
      buyInPlanExamples: [
        "A one-on-one conversation",
        "A public analysis of the data and why some people are not participating",
        "Weekly check-ins from you or the person’s manager (a light performance improvement plan)",
      ],
      lookForwardTitle: "Looking Forward: Outgrow Priorities for the Next 90 Days",
      lookForwardIntro:
        "This planning should be done with your entire customer-facing team in a 90-minute meeting. The Six Outgrow Focuses should be examined and discussed as a team, category by category and customer by customer.",
      lookForwardProcess: [
        "Use the focus areas below to spark rich conversation.",
        "Assign someone to scribe as items are discussed.",
        "Circulate a summary report to everyone who attended for reference after the meeting.",
      ],
      focusesTitle: "Outgrow Focus Areas to Discuss",
      focuses: [
        "Wallet Share Expansion focus — reviewing the top opportunities to sell more to your current customers.",
        "DYK product or service focus — identifying the offerings you want your people to concentrate on over the coming months.",
        "Referral focus — identifying who should be asked for internal and external referrals.",
        "Pre-quote or proposal follow-up focus — identifying the top opportunities to move toward a quote or proposal this quarter.",
        "Quote or proposal follow-up focus — listing the most important quotes and proposals that need following up next quarter.",
      ],
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

  const Badge = ({ text, title }: { text: string; title?: string }) => (
    <div
      title={title}
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
    >
      {text}
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
                Quarterly planning playbook
              </div>
            </div>

            <Badge text="⏱️ 90 min" title="Recommended duration" />
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

              <SectionCard title="Overview">
                <div>{content.overview}</div>
              </SectionCard>

              <SectionCard title={content.lookBackTitle}>
                <div style={{ marginBottom: 10 }}>{content.lookBackIntro}</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {content.lookBackBullets.map((b, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </SectionCard>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 12,
                }}
              >
                <SectionCard title={content.topPerformersTitle}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.topPerformersBullets.map((b, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title={content.topUnderTitle}>
                  <div style={{ marginBottom: 10 }}>{content.topUnderIntro}</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.topUnderBullets.map((b, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div
                    style={{
                      marginTop: 12,
                      border: "1px solid rgba(17,24,39,0.10)",
                      background: "#f9fafb",
                      borderRadius: 12,
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "#111827", marginBottom: 6 }}>
                      {content.buyInPlanExamplesTitle}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
                      {content.buyInPlanExamples.map((b, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionCard>
              </div>

              <SectionCard title={content.lookForwardTitle}>
                <div style={{ marginBottom: 10 }}>{content.lookForwardIntro}</div>
                <ul style={{ margin: "0 0 10px 0", paddingLeft: 18 }}>
                  {content.lookForwardProcess.map((b, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      {b}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    marginTop: 10,
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: 12,
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                    {content.focusesTitle}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {content.focuses.map((f, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionCard>

              {/* Notes & Tools */}
              <SectionCard title="Tools">
                <PdfLink
                  href="/images/outgrow-quarterly-planner-1.pdf"
                  label="Outgrow Quarterly Planner - A Look Back At Last Quarter"
                />
                <PdfLink
                  href="/images/outgrow-quarterly-planner-2.pdf"
                  label="Outgrow Quarterly Planner - A Look Forward To Next Quarter"
                />
              </SectionCard>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MeetingsQuarterlyTab;
