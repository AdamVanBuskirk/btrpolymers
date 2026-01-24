import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";
import { useIsMobile } from "../../Core/hooks";

export default function ForkliftDriver() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Optional: support routes like /careers/:slug
  const { slug } = useParams();
  const isMobile = useIsMobile();

  const role = {
    title: "Forklift Driver",
    location: "On-site",
    type: "Full-time",
    department: "Operations",
    email: "hr@btrpolymers.com",
  };

  const responsibilities = [
    "Load and unload full truckloads of plastic materials using a forklift.",
    "Grade and verify inbound and outbound materials against shipping documentation.",
    "Organize, stage, and maintain materials within the warehouse.",
    "Perform light processing activities, including baling, slitting, and grinding.",
    "Support general warehouse operations, including cleaning and organizing work areas.",
    "Follow all safety procedures and operational guidelines.",
  ];

  const skills = [
    "Safety-first mindset and consistent attention to detail.",
    "Strong reliability, punctuality, and accountability.",
    "Ability to follow instructions and execute tasks efficiently.",
    "Comfortable working in a fast-paced warehouse environment.",
    "Collaborative, team-oriented approach to daily operations.",
    "Ability to stay organized while managing multiple priorities.",
  ];

  const qualifications = [
    "Prior experience operating a forklift in a warehouse or industrial environment.",
    "Ability to safely load/unload and stage materials for inbound and outbound shipments.",
    "Experience verifying materials against shipping documentation is a plus.",
    "Willingness to support light processing activities (baling, slitting, grinding) as needed.",
  ];

  const benefits = [
    "Full-time position with benefits",
    "Competitive pay with monthly bonus opportunities",
    "Vacation and paid time off",
    "Medical and dental benefits",
    "Consistent overtime available",
    "Advancement and growth opportunities",
  ];

  return (
    <div style={{ width: "100%", background: "#FFFFFF" }}>
      <Navigation />

      {/* HERO */}
      <section
        style={{
          width: "100%",
          height: isMobile ? "620px" : "520px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/forklift-driver.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.94)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.20) 72%, rgba(0,0,0,0.06) 100%)",
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
            <div style={{ maxWidth: "820px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  color: "rgba(255,255,255,0.90)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Careers • Job Posting
              </div>

              <h1
                style={{
                  margin: "14px 0 0 0",
                  fontSize: "clamp(40px, 5vw, 62px)",
                  lineHeight: 1.05,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                  textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                }}
              >
                {role.title}
              </h1>

              <p
                style={{
                  marginTop: "16px",
                  fontSize: "clamp(16px, 2.2vw, 20px)",
                  lineHeight: 1.6,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.92)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }}
              >
                A hands-on warehouse role responsible for the safe and efficient movement of materials
                within our recycling operations-supporting daily inbound and outbound logistics.
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
                {[
                  { label: "Type", value: role.type },
                  { label: "Department", value: role.department },
                  { label: "Location", value: role.location },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.85,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginTop: "2px" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`mailto:${role.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
                style={{
                  display: "inline-block",
                  marginTop: "22px",
                  padding: "14px 26px",
                  background: "#003A5D",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
                }}
              >
                Email your resume to {role.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
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
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: "56px",
              alignItems: "start",
            }}
          >
            {/* LEFT: DESCRIPTION */}
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(30px, 3.4vw, 44px)",
                  lineHeight: 1.1,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "#2F3A3A",
                }}
              >
                Job Description & Company Overview
              </h2>

              <p
                style={{
                  marginTop: "18px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "860px",
                }}
              >
                The Forklift Driver at BTR Polymers is a hands-on warehouse position responsible for the
                safe and efficient movement of materials within our recycling operations. This role
                supports daily inbound and outbound logistics and plays a key part in maintaining an
                organized, productive facility.
              </p>

              <p
                style={{
                  marginTop: "14px",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "#4A4A4A",
                  maxWidth: "860px",
                }}
              >
                BTR Polymers is a post-industrial plastics recycling company focused on delivering
                high-quality recycled polymers through sustainable manufacturing practices. We offer a
                stable, growth-oriented work environment with opportunities for advancement.
              </p>

              {/* RESPONSIBILITIES */}
              <div style={{ marginTop: "34px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#003A5D",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Primary Responsibilities
                </div>

                <ul
                  style={{
                    marginTop: "14px",
                    paddingLeft: "18px",
                    marginBottom: 0,
                    color: "#4A4A4A",
                    lineHeight: 1.75,
                    fontWeight: 300,
                    fontSize: "18px",
                    maxWidth: "920px",
                  }}
                >
                  {responsibilities.map((r) => (
                    <li key={r} style={{ marginBottom: "10px" }}>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: SKILLS / QUALIFICATIONS / CTA */}
            <div>
              <div
                style={{
                  background: "#EEF4F2",
                  borderRadius: "18px",
                  padding: "22px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#003A5D",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Required Skills & Competencies
                </div>

                <ul
                  style={{
                    marginTop: "14px",
                    paddingLeft: "18px",
                    marginBottom: 0,
                    color: "#4A4A4A",
                    lineHeight: 1.75,
                    fontWeight: 300,
                    fontSize: "16px",
                  }}
                >
                  {skills.map((s) => (
                    <li key={s} style={{ marginBottom: "10px" }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  padding: "22px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#003A5D",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Experience & Qualifications
                </div>

                <ul
                  style={{
                    marginTop: "14px",
                    paddingLeft: "18px",
                    marginBottom: 0,
                    color: "#4A4A4A",
                    lineHeight: 1.75,
                    fontWeight: 300,
                    fontSize: "16px",
                  }}
                >
                  {qualifications.map((q) => (
                    <li key={q} style={{ marginBottom: "10px" }}>
                      {q}
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:${role.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
                  style={{
                    display: "inline-block",
                    marginTop: "18px",
                    padding: "12px 16px",
                    background: "#003A5D",
                    color: "#FFFFFF",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Apply now - email your resume
                </a>

                <div style={{ marginTop: "10px", color: "#4A4A4A", fontWeight: 300, lineHeight: 1.6 }}>
                  Email your resume to{" "}
                  <a
                    href={`mailto:${role.email}`}
                    style={{ color: "#003A5D", fontWeight: 700, textDecoration: "none" }}
                  >
                    {role.email}
                  </a>
                  .
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  background: "#E9EEF0",
                  borderRadius: "18px",
                  padding: "18px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ color: "#003A5D", fontWeight: 900 }}>Position Details & Benefits</div>

                <ul
                  style={{
                    marginTop: "12px",
                    paddingLeft: "18px",
                    marginBottom: 0,
                    color: "#4A4A4A",
                    lineHeight: 1.75,
                    fontWeight: 300,
                    fontSize: "16px",
                  }}
                >
                  {benefits.map((b) => (
                    <li key={b} style={{ marginBottom: "10px" }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "18px" }}>
                <Link
                  to="/careers"
                  style={{
                    color: "#003A5D",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  ← Back to Careers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section
        style={{
          width: "100%",
          background: "#EEF4F2",
          padding: "70px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="content-wrap" style={{ width: "100%", maxWidth: "1200px", textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 3.2vw, 42px)",
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#2F3A3A",
            }}
          >
            Ready to apply?
          </h2>

          <p
            style={{
              margin: "16px auto 0 auto",
              maxWidth: "860px",
              fontSize: "clamp(18px, 2vw, 22px)",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "#4A4A4A",
            }}
          >
            Email your resume to <b>hr@btrpolymers.com</b> with the subject line: <b>Application: Forklift Driver</b>.
          </p>

          <a
            href={`mailto:${role.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
            style={{
              display: "inline-block",
              marginTop: "22px",
              padding: "14px 28px",
              background: "#003A5D",
              color: "#FFFFFF",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Email hr@btrpolymers.com
          </a>
        </div>
      </section>

      {/* Responsive: 80% width on mobile */}
      <style>
        {`
          @media (max-width: 900px) {
            .content-wrap { width: 80% !important; }
            .two-col {
              grid-template-columns: 1fr !important;
              gap: 34px !important;
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
