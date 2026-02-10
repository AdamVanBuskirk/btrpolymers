import React, { useEffect } from "react";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";
import { useIsMobile } from "../../Core/hooks";

export default function About() {

    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  const timeline = [
    {
      year: "2011",
      title: "Founded with an operational mindset",
      body:
        "Burdette Thomas Company LLC was founded with a simple goal: build a business grounded in quality products, strong partnerships, and disciplined execution.",
    },
    {
      year: "2012 - 2018",
      title: "Retail → national distribution platform",
      body:
        "What began as an online retailer of consumer goods-most notably backyard game products-scaled into a distribution platform serving customers across the United States.",
    },
    {
      year: "2019 - 2020",
      title: "Supply-chain focus becomes a strategic edge",
      body:
        "As the business matured, we doubled down on distribution and supply-chain solutions that supported our growth and improved reliability.",
    },
    {
      year: "2020 - 2022",
      title: "Post-COVID disruption drives expansion into recycled polymers",
      body:
        "When global shortages hit, we built creative sourcing solutions and expanded into recycled polymer markets using our distribution network and supplier relationships.",
    },
    {
      year: "2022 - Today",
      title: "Investing in circular manufacturing and vertical integration",
      body:
        "Recognizing long-term demand for sustainable materials, we expanded investment into polymer recycling operations and a vertically integrated approach from source material to end use.",
    },
    {
      year: "Next",
      title: "Scaling infrastructure, technology, and capabilities",
      body:
        "We continue investing in infrastructure, technology, and operational capabilities to support growth across additional polymer streams and end-use applications.",
    },
  ];

  return (
    <div style={{ width: "100%", background: "#FFFFFF" }}>
      <Navigation />

      {/* HERO */}
      <section
        style={{
          width: "100%",
          height: isMobile ? "600px" : "520px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/group-photo.jpg)",
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
          <div  className="content-wrap"  style={{ width: "100%", maxWidth: "1200px" }}>
            <div style={{ maxWidth: "720px" }}>
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
                Built Through Disruption. Focused on What Endures.
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
                Founded in 2011, Burdette Thomas Company evolved from a national
                distribution business into a vertically integrated recycled polymer
                partner-investing in infrastructure, market expertise, and sustainable
                manufacturing to deliver reliable outcomes for customers.
              </p>

              <a
                href="/solutions"
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
                Our Solutions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO (centered, whitespace-heavy) */}
      <section
        style={{
          width: "100%",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <div  className="content-wrap"  style={{ maxWidth: "1100px", textAlign: "center" }}>
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
            A distribution-first company evolving into circular manufacturing
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
            Burdette Thomas Company began as an online retailer of consumer goods-most notably
            backyard game products-and quickly grew into a scalable distribution platform serving
            customers across the United States. That operational foundation became a strategic edge
            during the post-COVID supply-chain disruption, driving expansion into recycled polymers
            and a broader commitment to circular manufacturing solutions that deliver real business value.
          </p>
        </div>
      </section>

      {/* TIMELINE (pulse circles, vertically centered in each card; dates inside cards) */}
      <section
        style={{
          width: "100%",
          background: "#E9EEF0",
          padding: "90px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div  className="content-wrap" style={{ width: "100%", maxWidth: "1200px" }}>
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
            Our story, by chapter
          </h2>

          <div
            style={{
                marginTop: "48px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
            >
            {timeline.map((t, idx) => {
              // circles progressively grow, capped so the last ones don’t overpower the layout
              const size = Math.min(18 + idx * 4, 34);

              return (
                <div
                  key={t.year + t.title}
                  style={{
                    position: "relative",
                    background: "#FFFFFF",
                    borderRadius: "18px",
                    padding: isMobile ? "40px" : "26px 26px 26px 96px", // reserve space for pulse
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Vertically centered pulse circle */}
                  {!isMobile &&
                  <div
                    style={{
                      position: "absolute",
                      left: "32px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: "50%",
                      background: "#003A5D",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
                    }}
                  >
                    {/* pulse rings */}
                    <span
                      style={{
                        position: "absolute",
                        inset: "-10px",
                        borderRadius: "50%",
                        border: "2px solid rgba(0,58,93,0.35)",
                        animation: "btrPulse 2.2s ease-out infinite",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        inset: "-18px",
                        borderRadius: "50%",
                        border: "2px solid rgba(0,58,93,0.18)",
                        animation: "btrPulse 2.2s ease-out infinite",
                        animationDelay: "0.35s",
                      }}
                    />
                  </div>
                }

                  {/* Card content */}
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#003A5D",
                        marginBottom: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.year}
                    </div>

                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#003A5D",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.title}
                    </div>

                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "18px",
                        lineHeight: 1.65,
                        color: "#4A4A4A",
                        fontWeight: 300,
                        maxWidth: "920px",
                      }}
                    >
                      {t.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <style>
            {`
              @keyframes btrPulse {
                0% { transform: scale(0.7); opacity: 0.6; }
                60% { transform: scale(1.05); opacity: 0.2; }
                100% { transform: scale(1.25); opacity: 0; }
              }
            `}
          </style>
        </div>
      </section>

{/* VALUES / BELIEFS (two-column statement) */}
<section
  style={{
    width: "100%",
    background: "#FFFFFF",
    padding: "clamp(48px, 8vw, 90px) 24px",
    display: "flex",
    justifyContent: "center",
  }}
>
  <div
    className="beliefs-grid content-wrap"
    style={{
      maxWidth: "1200px",
      width: "100%",
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: "80px",
      alignItems: "center",
    }}
  >
    {/* LEFT CONTENT */}
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(30px, 4vw, 46px)",
          lineHeight: 1.1,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "#2F3A3A",
        }}
      >
        What we believe
      </h2>

      <p
        style={{
          marginTop: "22px",
          fontSize: "clamp(17px, 2.2vw, 22px)",
          lineHeight: 1.7,
          fontWeight: 300,
          color: "#4A4A4A",
          maxWidth: "560px",
        }}
      >
        Today, Burdette Thomas Company LLC is focused on delivering high-quality
        products manufactured through responsible, sustainable practices using
        recycled polymers. We continue investing in infrastructure, technology,
        and operational capabilities to support future growth across additional
        polymer streams and end-use applications.
      </p>

      <p
        style={{
          marginTop: "18px",
          fontSize: "clamp(17px, 2.2vw, 22px)",
          lineHeight: 1.7,
          fontWeight: 300,
          color: "#4A4A4A",
          maxWidth: "560px",
        }}
      >
        At our core, we are driven by long-term thinking, disciplined execution,
        and a belief that sustainable manufacturing and strong business
        fundamentals go hand in hand. We partner with customers who value
        reliability, transparency, and innovation—and remain committed to
        building solutions that are not only good for business, but good for the
        future.
      </p>
    </div>

    {/* RIGHT VALUES */}
    <div className="beliefs-values">
      <div
        style={{
          fontSize: "clamp(32px, 4.5vw, 56px)",
          lineHeight: 1.1,
          fontWeight: 800,
          color: "#003A5D",
        }}
      >
        Reliability.
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
        Transparency.
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
        Long-Term Value.
      </div>
    </div>
  </div>

  <style>
    {`
      @media (max-width: 900px) {
        .beliefs-grid {
          grid-template-columns: 1fr !important;
          gap: 48px !important;
        }

        .beliefs-values {
          text-align: center;
        }
      }
    `}
  </style>
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
            Let’s build something durable
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
            If you value reliability, transparency, and practical solutions that work in real manufacturing
            environments, we’d love to talk.
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

      <style>
        {`
            @media (max-width: 900px) {
            .content-wrap {
                width: 80% !important;
            }
            }

            @media (max-width: 500px) {
            .content-wrap {
                width: 92% !important;
            }
            }
        `}
      </style>

      <Footer />
    </div>
  );
}
