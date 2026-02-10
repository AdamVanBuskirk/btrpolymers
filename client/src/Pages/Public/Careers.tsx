import React, { useEffect } from "react";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

export default function Careers() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Replace these with your real openings later
  const openings = [
    {
      title: "Account Manager",
      location: "Location • On-site",
      type: "Full-time",
      href: "/careers/account-manager",
    },
    {
      title: "Forklift Driver",
      location: "Location • On-site",
      type: "Full-time",
      href: "/careers/forklift-driver",
    },
    {
      title: "Logistics Coordinator",
      location: "Location • On-site",
      type: "Full-time",
      href: "/careers/logistics-coordinator",
    },
  ];

  const values = [
    {
      title: "Operational excellence",
      body: "We sweat the details-because reliability is built, not claimed.",
    },
    {
      title: "Straight talk, clear expectations",
      body: "We value clarity, ownership, and fast feedback over politics.",
    },
    {
      title: "Customer-first thinking",
      body: "We solve real problems in real manufacturing environments.",
    },
    {
      title: "Long-term mindset",
      body: "We build durable relationships and durable systems.",
    },
  ];

  const perks = [
    { title: "Competitive pay", body: "Market-aligned compensation and room to grow." },
    { title: "Health benefits", body: "Typical medical, dental, and vision options." },
    { title: "Paid time off", body: "Time to recharge and come back sharp." },
    { title: "Flexible work where possible", body: "Roles vary-some onsite, some hybrid, some remote." },
    { title: "High ownership roles", body: "Small teams, big impact, clear decision rights." },
    { title: "Real-world work", body: "Close to the market-where decisions matter." },
  ];

  const hiringSteps = [
    { step: "1", title: "Apply", body: "Send your resume and a short note on why the role fits." },
    { step: "2", title: "Intro call", body: "Quick alignment on role, expectations, and logistics." },
    { step: "3", title: "Role interview(s)", body: "Deep dive on experience, problem-solving, and execution." },
    { step: "4", title: "Practical exercise", body: "A lightweight case or task related to the role (when relevant)." },
    { step: "5", title: "Decision", body: "Fast, clear feedback and next steps." },
  ];

  return (
    <div style={{ width: "100%", background: "#FFFFFF" }}>
      <Navigation />

      {/* HERO */}
      <section
        style={{
          width: "100%",
          height: "520px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/team-work.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.92)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 36%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px" }}>
            <div style={{ maxWidth: "760px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(40px, 5vw, 64px)",
                  lineHeight: 1.05,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                  textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                }}
              >
                Careers at BTR Polymers
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2.2vw, 22px)",
                  lineHeight: 1.6,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.92)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }}
              >
                Join a team that operates with discipline, moves fast, and takes pride in doing the work
                the right way-building reliable supply chains and circular manufacturing outcomes.
              </p>

              <a
                href="#openings"
                style={{
                  display: "inline-block",
                  marginTop: "26px",
                  padding: "14px 26px",
                  background: "#003A5D",
                  //background: "#319C17",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
                }}
              >
                View open roles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section
        style={{
          width: "100%",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1100px", textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4vw, 54px)",
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#2F3A3A",
            }}
          >
            High ownership. Clear expectations. Real impact.
          </h2>

          <p
            style={{
              margin: "22px auto 0 auto",
              maxWidth: "920px",
              fontSize: "clamp(18px, 2vw, 22px)",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "#4A4A4A",
            }}
          >
            We’re building a modern materials and recycling business that values reliability, transparency,
            and long-term thinking. If you like clear goals, measurable outcomes, and working close to the
            market-this is the place.
          </p>
        </div>
      </section>

      {/* VALUES (cards) */}
      <section
        style={{
          width: "100%",
          background: "#E9EEF0",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(32px, 3.6vw, 46px)",
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#2F3A3A",
              textAlign: "center",
            }}
          >
            How we operate
          </h2>

          <div
            className="cards-grid"
            style={{
              marginTop: "42px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "18px",
            }}
          >
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  padding: "22px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#003A5D",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {v.title}
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "#4A4A4A",
                    fontWeight: 300,
                  }}
                >
                  {v.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPENINGS */}
      <section
        id="openings"
        style={{
          width: "100%",
          background: "#FFFFFF",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px" }}>
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: "64px",
              alignItems: "start",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(32px, 3.6vw, 46px)",
                  lineHeight: 1.1,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "#2F3A3A",
                }}
              >
                Open positions
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "700px",
                }}
              >
                We hire people who execute, communicate clearly, and care about the outcome. If you don’t see
                a perfect match, you can still reach out-great operators are always worth talking to.
              </p>

              <a
                href="/contact"
                style={{
                  display: "inline-block",
                  marginTop: "22px",
                  padding: "14px 26px",
                  background: "#003A5D",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                General application
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {openings.map((o) => (
                <a
                  key={o.href}
                  href={o.href}
                  style={{
                    textDecoration: "none",
                    background: "#EEF4F2",
                    borderRadius: "16px",
                    padding: "18px 18px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    display: "block",
                  }}
                >
                  <div style={{ color: "#003A5D", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.01em" }}>
                    {o.title}
                  </div>
                  <div style={{ marginTop: "6px", color: "#4A4A4A", fontWeight: 300, lineHeight: 1.6 }}>
                    {o.location} • {o.type}
                  </div>
                  <div style={{ marginTop: "10px", color: "#003A5D", fontWeight: 700 }}>
                    View role →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section
        style={{
          width: "100%",
          background: "#E9EEF0",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(32px, 3.6vw, 46px)",
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#2F3A3A",
              textAlign: "center",
            }}
          >
            What you can expect
          </h2>

          <div
            className="cards-grid"
            style={{
              marginTop: "42px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "18px",
            }}
          >
            {perks.map((p) => (
              <div
                key={p.title}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  padding: "22px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ color: "#003A5D", fontWeight: 800, fontSize: "16px" }}>{p.title}</div>
                <div style={{ marginTop: "10px", color: "#4A4A4A", fontWeight: 300, lineHeight: 1.6 }}>
                  {p.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section
        style={{
          width: "100%",
          background: "#FFFFFF",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px" }}>
          <div
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: "64px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "clamp(34px, 4vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#003A5D",
                }}
              >
                Clear
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "clamp(34px, 4vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#8A8A8A",
                }}
              >
                fast
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "clamp(34px, 4vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#00A3E0",
                }}
              >
                hiring
              </div>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "520px",
                }}
              >
                We try to keep it simple: practical conversations, clear expectations, and quick decisions.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {hiringSteps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    background: "#EEF4F2",
                    borderRadius: "16px",
                    padding: "18px",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 900, color: "#003A5D", letterSpacing: "0.08em" }}>{s.step}</div>
                    <div style={{ fontWeight: 800, color: "#2F3A3A", fontSize: "18px" }}>{s.title}</div>
                  </div>
                  <div style={{ marginTop: "8px", color: "#4A4A4A", fontWeight: 300, lineHeight: 1.6 }}>
                    {s.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          width: "100%",
          background: "#EEF4F2",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px", textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(32px, 3.6vw, 46px)",
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#2F3A3A",
            }}
          >
            Don’t see the right role?
          </h2>

          <p
            style={{
              margin: "18px auto 0 auto",
              maxWidth: "860px",
              fontSize: "clamp(18px, 2vw, 22px)",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "#4A4A4A",
            }}
          >
            Send a note with what you do best and what you’re looking for. If there’s a fit, we’ll reach out.
          </p>

          <a
            href="/contact"
            style={{
              display: "inline-block",
              marginTop: "26px",
              padding: "14px 28px",
              background: "#003A5D",
              color: "#FFFFFF",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Contact us
          </a>
        </div>
      </section>

      {/* Global styles (80% width mobile + responsive grids) */}
      <style>
        {`
          @media (max-width: 900px) {
            .content-wrap { width: 80% !important; }

            .two-col {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            .cards-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 500px) {
            .content-wrap { width: 92% !important; }
          }
        `}
      </style>

      <Footer />
    </div>
  );
}
