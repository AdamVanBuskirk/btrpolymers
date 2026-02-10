import React, { useEffect } from "react";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

export default function Materials() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const materialStreams = [
    "Wide-spec materials",
    "Off-spec and transitional production runs",
    "Reprocessed resins",
    "Regrinds",
    "Post-industrial and post-commercial feedstocks",
    "Custom-blended or application-driven materials",
  ];

  const polymers = [
    "Polypropylene (PP)",
    "Polyethylene (PE)",
    "Polystyrene (PS)",
    "Polyethylene terephthalate (PET)",
    "Polyvinyl chloride (PVC)",
    "Thermoplastic polyolefins (TPO)",
    "ABS",
    "Polyamides (PA)",
    "Specialty & engineering polymers",
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
            backgroundImage: "url(/images/materials-photo.jpg)",
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
                Recycled polymers, sourced with discipline
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
                The recycled plastics marketplace is dynamic and complex-and that’s exactly where we thrive.
                We connect buyers with consistent, cost-effective feedstocks while helping suppliers move
                material efficiently and responsibly.
              </p>

              <a
                href="/contact"
                style={{
                  display: "inline-block",
                  padding: "12px 22px",
                  background: "#003A5D",
                  //background: "#319C17",
                  color: "#fff",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Request materials
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
            A market-driven approach to recycled materials
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
            BTR Polymers specializes in sourcing, processing, and supplying a broad spectrum of recycled
            polymer materials to support manufacturers across diverse end-markets. Rather than focusing on
            a limited catalog, we continually identify new streams and opportunities to meet evolving needs.
          </p>
        </div>
      </section>

      {/* SECTION: Comprehensive Offering */}
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
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: "64px",
              alignItems: "center",
            }}
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
                A comprehensive recycled polymer offering
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
                BTR Polymers provides access to an extensive range of recycled polymer streams. Our flexible
                sourcing model allows us to match material characteristics to your requirements-whether the
                priority is performance, price, availability, or sustainability goals.
              </p>

              <div
                style={{
                  marginTop: "18px",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "999px",
                    color: "#003A5D",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.03em",
                  }}
                >
                  Performance
                </span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "999px",
                    color: "#003A5D",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.03em",
                  }}
                >
                  Price
                </span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "999px",
                    color: "#003A5D",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.03em",
                  }}
                >
                  Availability
                </span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "999px",
                    color: "#003A5D",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.03em",
                  }}
                >
                  Sustainability
                </span>
              </div>
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
                Streams we source & supply
              </div>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {materialStreams.map((x) => (
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

      {/* SECTION: Broad Polymer Coverage */}
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
            className="two-col reverse-on-mobile"
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              gap: "64px",
              alignItems: "start",
            }}
          >
            {/* Left: big word stack */}
            <div className="materials-wordstack">
              <div
                style={{
                  fontSize: "clamp(34px, 4vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#003A5D",
                }}
              >
                Broad
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
                Polymer
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
                Coverage
              </div>
            </div>

            {/* Right: Copy + polymer chips */}
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
                The resin families manufacturers rely on
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "820px",
                }}
              >
                We work across many of the most widely used resin families in the market-covering commodity
                materials, engineering polymers, and specialty streams. Because we operate with a market-driven
                approach, we can adapt as opportunities shift and needs evolve.
              </p>

              <div
                style={{
                  marginTop: "18px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {polymers.map((p) => (
                  <span
                    key={p}
                    style={{
                      display: "inline-block",
                      padding: "10px 12px",
                      background: "#EEF4F2",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "999px",
                      color: "#2F3A3A",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Market-Driven Solutions */}
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
            className="two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: "64px",
              alignItems: "center",
            }}
          >
            {/* Left copy */}
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
                Market-driven solutions that keep production moving
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "820px",
                }}
              >
                Every customer and application is different. Our experienced sales and sourcing professionals
                collaborate closely with buyers to understand processing requirements, performance expectations,
                and commercial objectives. From there, we leverage our supplier network and logistical expertise
                to deliver practical recycled material solutions.
              </p>

              <p
                style={{
                  marginTop: "14px",
                  fontSize: "18px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "820px",
                }}
              >
                Whether you’re seeking a dependable alternative to prime resin, managing supply-chain volatility,
                or advancing sustainability initiatives, BTR works as a strategic partner-not just a distributor.
              </p>
            </div>

            {/* Right: “partner” card */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "18px",
                padding: "26px",
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
                What you can expect
              </div>

              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { k: "Consistency", v: "Repeatable supply and clear communication." },
                  { k: "Fit", v: "Materials aligned to your processing and performance needs." },
                  { k: "Speed", v: "Responsive sourcing when markets shift." },
                  { k: "Practicality", v: "Solutions that work in real manufacturing environments." },
                ].map((row) => (
                  <div
                    key={row.k}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: "#EEF4F2",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "#2F3A3A", fontSize: "16px" }}>{row.k}</div>
                    <div style={{ marginTop: "4px", color: "#4A4A4A", fontWeight: 300, lineHeight: 1.6 }}>
                      {row.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Reliable Supply. Responsible Outcomes. */}
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
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "64px",
              alignItems: "center",
            }}
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
                Reliable supply. Responsible outcomes.
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "900px",
                }}
              >
                Sustainability is built into what we do. By diverting valuable polymers back into productive use,
                we help reduce waste, conserve resources, and support circular manufacturing models-while staying
                focused on reliability, transparency, and service so customers can source recycled materials with
                confidence.
              </p>

              <a
                href="/solutions"
                style={{
                  display: "inline-block",
                  marginTop: "22px",
                  padding: "14px 26px",
                  //background: "#003A5D",
                  background: "#319C17",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Explore Solutions
              </a>
            </div>

            {/* Right: word stack */}
            <div className="beliefs-values">
              <div
                style={{
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#003A5D",
                }}
              >
                Sustainable.
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#8A8A8A",
                }}
              >
                Reliable.
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#00A3E0",
                }}
              >
                Practical.
              </div>
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
            Need a specific stream or spec?
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
            Tell us what you’re running and what you need. We’ll help you source a recycled resin solution that
            fits performance, availability, and commercial targets.
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

      {/* Global styles */}
      <style>
        {`
          @media (max-width: 900px) {
            .content-wrap { width: 80% !important; }

            .two-col {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            .beliefs-values {
              text-align: center;
            }

            .materials-wordstack {
              text-align: left;
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
