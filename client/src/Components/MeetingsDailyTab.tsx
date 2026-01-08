import { useMemo } from "react";
import { useIsMobile } from "../Core/hooks";

function MeetingsDailyTab() {
  const isMobile = useIsMobile();

  const content = useMemo(() => {
    return {
      title: "Outgrow Daily Mentions (2 Minutes)",
      intro:
        "As your team implements their daily actions, and you receive the details of the Outgrow Tracking Form, you can touch base with them briefly by sharing:",
      bullets: [
        "An encouraging word in person.",
        "A short email, phone call, or in-person thanks about an Outgrow activity they submitted.",
        "An email, phone call, or in-person tip or idea based on their submission, for example:",
      ],
      examples: [
        "“This seems like a good opportunity to ask an rDYK and pivot (what else, and when).”",
        "“Don’t forget to follow up on that big quote with company xyz.”",
      ],
      outro:
        "You can also suggest DYK products or proactive calls in your regular conversations with your colleagues. These little daily touch points are gentle feedback and motivation for your team’s Outgrow work. You are reminding them that you are interested in their work on this important effort to intentionally and proactively grow sales.",
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
      {/* Sticky header (same feel as other tabs) */}
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
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "12px",
            maxWidth: 980,
            margin: "0 auto",
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
              Daily Meetings
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
              Quick daily touch points to reinforce Outgrow
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
            title="Recommended duration"
          >
            ⏱️ 2 min
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 32px 16px",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Card style={{ marginTop: "6px" }}>
            <h2
              style={{
                margin: 0,
                marginBottom: "10px",
                fontSize: isMobile ? "18px" : "20px",
                color: "#111827",
              }}
            >
              {content.title}
            </h2>

            <p style={{ margin: "0 0 12px 0", color: "#374151", lineHeight: 1.7 }}>
              {content.intro}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "12px",
                marginTop: "6px",
              }}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: isMobile ? "14px" : "16px",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  What to do
                </div>

                <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
                  {content.bullets.map((b, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: isMobile ? "14px" : "16px",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Example prompts
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {content.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: "#f9fafb",
                        color: "#111827",
                        fontWeight: 650,
                      }}
                    >
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                borderTop: "1px solid #e5e7eb",
                paddingTop: 14,
                color: "#374151",
                lineHeight: 1.7,
              }}
            >
              {content.outro}
            </div>
          </Card>

          {/* Optional callout block (safe placeholder for future attachment/link) */}
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                border: "1px solid rgba(219,53,20,0.25)",
                background: "rgba(219,53,20,0.06)",
                borderRadius: 14,
                padding: isMobile ? "12px 12px" : "12px 14px",
                color: "#111827",
                fontSize: 13,
                fontWeight: 650,
                lineHeight: 1.5,
              }}
            >
              Tip: Keep these mentions lightweight and positive. The goal is momentum—signal you’re paying
              attention and you care about the proactive work.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingsDailyTab;
