import React, { useEffect } from "react";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";
import { useIsMobile } from "../../Core/hooks";

export default function Solutions() {
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const solutionsIncludes = [
    "Program design and optimization",
    "Material flow analysis and segregation strategies",
    "On-site handling and storage recommendations",
    "Transportation and logistics coordination",
    "Market access for recycled materials",
    "Ongoing performance monitoring and improvement",
  ];

  const manufacturerBenefits = [
    "Strong market positioning for recycled materials",
    "Reduced disposal costs",
    "Improved revenue recovery",
    "Stable, long-term recycling programs",
    "Support through changing market conditions",
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
            backgroundImage: "url(/images/large-factory.jpg)",
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
                Solutions that make recycling work in the real world
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
                Every facility is different-so we take a customized, hands-on approach to build programs
                that fit your site’s operational realities, material streams, and business objectives.
              </p>

              <a
                href="/contact"
                style={{
                  display: "inline-block",
                  marginTop: "26px",
                  padding: "14px 26px",
                  //background: "#003A5D",
                  background: "#319C17",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
                }}
              >
                Talk to our team
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
            Industrial recycling programs designed for efficiency and value
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
            At BTR Polymers, we deliver comprehensive industrial recycling solutions designed to help
            manufacturers operate more efficiently, reduce waste, and unlock greater value from their
            recyclable materials.
          </p>
        </div>
      </section>

      {/* SECTION: Site-Specific Programs */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "64px",
              alignItems: "center",
            }}
            className="two-col"
          >
            {/* Left */}
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
                Site-specific recycling programs
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
                BTR partners directly with manufacturing locations to evaluate current material flows,
                handling processes, and logistics. From there, we develop tailored recycling strategies
                that integrate seamlessly into daily operations.
              </p>

              <p
                style={{
                  marginTop: "14px",
                  fontSize: "18px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "700px",
                }}
              >
                The result is a recycling program that is practical, scalable, and aligned with your
                production environment.
              </p>
            </div>

            {/* Right: Card list */}
            <div
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
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#003A5D",
                }}
              >
                Our solutions may include
              </div>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {solutionsIncludes.map((x) => (
                  <div
                    key={x}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "#EEF4F2",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#003A5D",
                        marginTop: "7px",
                        flex: "0 0 auto",
                      }}
                    />
                    <div style={{ color: "#2F3A3A", fontSize: "16px", lineHeight: 1.5, fontWeight: 400 }}>
                      {x}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Operational Efficiency */}
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
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              gap: "64px",
              alignItems: "center",
            }}
            className="two-col reverse-on-mobile"
          >
            {/* Left: Big statement */}
            <div style={{ textAlign: isMobile ? "left" : "left" }}>
              <div
                style={{
                  fontSize: "clamp(34px, 4vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#003A5D",
                }}
              >
                Operational efficiency
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
                Lower handling cost
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
                Better outcomes
              </div>
            </div>

            {/* Right: Copy */}
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 3.2vw, 40px)",
                  lineHeight: 1.15,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "#2F3A3A",
                }}
              >
                Driving operational efficiency inside the plant
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "760px",
                }}
              >
                Beyond diverting material from disposal, BTR focuses on improving how recycling programs
                function inside the plant. We identify opportunities to streamline processes, reduce
                handling costs, minimize downtime, and improve overall program performance.
              </p>

              <p
                style={{
                  marginTop: "14px",
                  fontSize: "18px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "760px",
                }}
              >
                By refining collection methods, simplifying logistics, and aligning material specifications
                with market demand, BTR helps manufacturers turn recycling from a cost center into a
                value-generating component of operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Maximize Value */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "64px",
              alignItems: "start",
            }}
            className="two-col"
          >
            {/* Left */}
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
                Maximizing material value
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "760px",
                }}
              >
                BTR works aggressively in the marketplace to secure the best possible outcomes for our
                manufacturing partners’ recyclable streams. Through our broad network of processors,
                compounders, and end-users, we create competitive tension and transparent pathways to
                market-helping ensure materials are placed into the highest-value outlets available.
              </p>

              <p
                style={{
                  marginTop: "14px",
                  fontSize: "18px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "760px",
                }}
              >
                We treat every ton as an opportunity to create value.
              </p>
            </div>

            {/* Right: Benefits card */}
            <div
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
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#003A5D",
                }}
              >
                Manufacturers benefit from
              </div>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {manufacturerBenefits.map((x) => (
                  <div
                    key={x}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "#EEF4F2",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#00A3E0",
                        marginTop: "7px",
                        flex: "0 0 auto",
                      }}
                    />
                    <div style={{ color: "#2F3A3A", fontSize: "16px", lineHeight: 1.5, fontWeight: 400 }}>
                      {x}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: True Partner */}
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
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "18px",
              textAlign: "left",
            }}
          >
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
              A true recycling partner
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: "clamp(18px, 2vw, 22px)",
                lineHeight: 1.7,
                fontWeight: 300,
                color: "#4A4A4A",
                maxWidth: "980px",
              }}
            >
              BTR Polymers is more than a service provider-we act as an extension of your team. Our
              experienced professionals stay engaged long after a program is launched, continually
              looking for ways to enhance performance, respond to market shifts, and adapt as production
              changes.
            </p>

            <p
              style={{
                marginTop: "10px",
                fontSize: "18px",
                lineHeight: 1.7,
                fontWeight: 300,
                color: "#4A4A4A",
                maxWidth: "980px",
              }}
            >
              Whether you operate a single facility or a multi-site manufacturing network, BTR brings the
              market insight, operational know-how, and commercial discipline needed to build durable,
              high-performing recycling programs.
            </p>
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
            Ready to build a high-performing recycling program?
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
            Tell us about your facility and material streams. We’ll help you design a practical program
            that improves efficiency, reduces waste, and delivers better outcomes.
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
            Contact Us
          </a>
        </div>
      </section>

      {/* Global page styles */}
      <style>
        {`
          @media (max-width: 900px) {
            .content-wrap { width: 80% !important; }

            .two-col {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            .reverse-on-mobile {
              display: grid !important;
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
