import { useMemo, useState } from "react";
import { useIsMobile } from "../Core/hooks";

type MeetingMode = "huddle" | "leadership";

type BulletLink = {
  type: "link";
  label: string;
  href: string;
  target?: string;
  rel?: string;
};

type Bullet = string | BulletLink;

type Section = {
  title: string;
  bullets: Bullet[];
};

type Content = {
  title: string;
  when: string;
  who: string;
  purpose: string;
  structure: string;
  sections: Section[];
};

function MeetingsWeeklyTab() {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<MeetingMode>("huddle");

  const content: Content = useMemo(() => {
    if (mode === "leadership") {
      return {
        title: "Outgrow Leadership Weekly Huddle (30 Minutes, Max)",
        when: "Ideally Fridays or first thing Monday morning.",
        who: "Owner or COO / Visionary, or Presidents (the top leaders in their respective business or business unit) lead their managers through this meeting.",
        purpose: "To prepare the managers for the Monday Weekly Huddles.",
        structure: "Approximately 50% backwards looking, 50% forwards looking.",
        sections: [
          {
            title: "A Quick Review of Your Key Metrics (5 Minutes)",
            bullets: [
              "Total actions submitted last week, noting if they are up or down over the week before.",
              "Participation percentage among your team",
              "Proposal or quote counts, product sales volume (quantity, length, or weight), and/or sales dollars closed last week, noting if they are up or down over the week prior.",
              "If you have a fast sales cycle, you can use actual dollar sales and quote quantity. For longer sales cycles, count proposals written and perhaps focus on follow-ups made.",
              "Remember to focus on positives and successes.",
            ],
          },
          {
            title: "Managers Share Two or Three Success Stories from the Last Week (5 Minutes)",
            bullets: [
              "Come prepared with two or three of your favorite submissions that were marked Success of the Week by your Outgrowers.",
              "Ask the manager to (briefly) tell their Outgrowers stories.",
              "Rotate between managers so that over time every manager gets to share.",
            ],
          },
          {
            title: "Manager Share How They Run Outgrow (5–10 Minutes)",
            bullets: [
              "Prepared in advance, one manager presents how they run Outgrow in their branch.",
              "What do they do? How do they oversee it?",
              "How do they gain buy-in/participation?",
              "How do they make sure their people are taking swings?",
            ],
          },
          {
            title: "Target Actions For The Week (5–10 Minutes)",
            bullets: [
              "The leader sets next week's targets for the managers to drive to their Outgrowers during their huddles.",
              "Who will we call next week?",
              "The leader can bring specific customers and prescribe, or tell the managers to do the proactive call planner exercise.",
              "Zero Dark 30?",
              "Declining revenue customers?",
              "Past customers who are at zero?",
              "Focus on Quote Follow-Ups?",
              "This can be a Proactive Call Planner exercise.",
              "What will your Outgrowers focus on next week and how will they talk about them?",
              "Specific lines?",
              "Specific product categories?",
              "Specials / promotions?",
              "Specific locations?",
              "Specific verticals?",
              "The leader prescribes these actions that managers assign to their teams during their Monday huddle.",
            ],
          },
        ],
      };
    }

    // Weekly Huddle
    return {
      title: "Outgrow Weekly Huddle (15–20 Minutes)",
      when: "Ideally Monday mornings to set up the week.",
      who: "Sales & customer service managers lead their Outgrowers through it.",
      purpose:
        "Fast, packed with proactive productivity, and avoids complaining/negativity. The huddle is for opportunities, not problems.",
      structure: "Approximately 20% backwards looking, 80% forward looking.",
      sections: [
        {
          title: "A Quick Review of Your Key Metrics (2 Minutes)",
          bullets: [
            "Total actions submitted last week, noting if they are up or down over the week before.",
            "Participation percentage among your team",
            "Proposal or quote counts, product sales volume (quantity, length, or weight), and/or sales dollars closed last week, noting if they are up or down over the week prior.",
            "For longer sales cycles, consider counting proposals written and perhaps focus on follow-ups made.",
          ],
        },
        {
          title: "Share One or Two Top Success Stories from the Last Week (3 Minutes)",
          bullets: [
            "Come prepared with one or two favorite submissions marked Success of the Week.",
            "Ask participants to (briefly) tell their own stories.",
            "Name the customer and the specific actions taken; if not stated, ask them to be specific.",
            "This recognizes good work and teaches what’s working.",
          ],
        },
        {
          title: "Option 1: Review Customer Lists (10–15 Minutes)",
          bullets: [
            "Bring one or more customer lists (e.g., outstanding quotes/proposals, Zero Dark 30, customers who used to buy but stopped).",
            "Discuss the buyers and quickly assign follow-ups to individuals so there’s no ambiguity.",
            "Encourage people to write down additional names as they listen.",
          ],
        },
        {
          title: "Option 2: Use the Proactive Call Planner (10–15 Minutes)",
          bullets: [
            "Pass around a proactive call planner and give two minutes to write down as many names as possible.",
            "Direct them to references that help recall names (email, texts, quotes list, etc.).",
            "Use remaining time for people to read off names while others react and add ideas.",
            "Encourage attendees to add more names as they listen.",
          ],
        },
        {
          title: "Reiterate Your Target Actions for the Week (3 Minutes)",
          bullets: [
            "With calls assigned and planners filled out, reiterate targets and quantities for the week.",
            "Remind people to call 5, 10, or your preferred number from the list.",
            "Now it’s time to go help more people this week.",
          ],
        },
        {
          title: "Tools",
          bullets: [
            {
              type: "link",
              label: "Outgrow Proactive Call Planner",
              href: "/images/outgrow-proactive-call-planner.pdf",
              target: "_blank",
              rel: "noreferrer",
            },
          ],
        },
      ],
    };
  }, [mode]);

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

  const PillToggle = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          borderRadius: "9999px",
          padding: "3px",
          background:
            "linear-gradient(135deg, rgba(219,53,20,0.12), rgba(15,118,110,0.12))",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <button
          onClick={() => setMode("huddle")}
          style={{
            border: "none",
            borderRadius: "9999px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            minWidth: isMobile ? "50%" : "140px",
            background: mode === "huddle" ? "#ffffff" : "transparent",
            color: mode === "huddle" ? "#111827" : "#6b7280",
            boxShadow: mode === "huddle" ? "0 4px 10px rgba(0,0,0,0.10)" : "none",
            transition: "all 0.18s ease-in-out",
          }}
        >
          Huddle
        </button>
        <button
          onClick={() => setMode("leadership")}
          style={{
            border: "none",
            borderRadius: "9999px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            minWidth: isMobile ? "50%" : "180px",
            background: mode === "leadership" ? "#ffffff" : "transparent",
            color: mode === "leadership" ? "#111827" : "#6b7280",
            boxShadow:
              mode === "leadership" ? "0 4px 10px rgba(0,0,0,0.10)" : "none",
            transition: "all 0.18s ease-in-out",
          }}
        >
          Leadership Huddle
        </button>
      </div>
    </div>
  );

  const renderBullet = (b: Bullet) => {
    if (typeof b === "string") return b;

    if (b.type === "link") {
      return (
        <a
          href={b.href}
          target={b.target ?? "_blank"}
          rel={b.rel ?? "noreferrer"}
          style={{
            color: "#2563eb",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {b.label}
        </a>
      );
    }

    return null;
  };

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
      {/* Sticky header (same vibe as Scripts) */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#f9fafb",
          padding: "10px 12px 8px 12px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <PillToggle />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          Weekly meeting playbooks
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
        <Card style={{ marginTop: "6px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              lineHeight: 1.6,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  marginBottom: "6px",
                  fontSize: isMobile ? "18px" : "20px",
                  color: "#111827",
                }}
              >
                {content.title}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                    When
                  </div>
                  <div style={{ color: "#374151" }}>{content.when}</div>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                    Who
                  </div>
                  <div style={{ color: "#374151" }}>{content.who}</div>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                    Purpose
                  </div>
                  <div style={{ color: "#374151" }}>{content.purpose}</div>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                    Structure
                  </div>
                  <div style={{ color: "#374151" }}>{content.structure}</div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {content.sections.map((s) => (
                <div
                  key={s.title}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: isMobile ? "14px 14px" : "16px 18px",
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: "8px",
                    }}
                  >
                    {s.title}
                  </div>

                  <ul style={{ margin: 0, paddingLeft: "18px", color: "#374151" }}>
                    {s.bullets.map((b, idx) => (
                      <li key={`${s.title}-${idx}`} style={{ marginBottom: "6px" }}>
                        {renderBullet(b)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MeetingsWeeklyTab;
