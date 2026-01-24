import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";
import { useIsMobile } from "../../Core/hooks";

export default function AccountManager() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Optional: support routes like /careers/:slug
  const { slug } = useParams();
  const isMobile = useIsMobile();

  // For now we render the Account Manager role regardless of slug.
  // Later you can map slug -> posting content.
  const role = {
    title: "Account Manager",
    location: "On-site",
    type: "Full-time",
    department: "Sales",
    email: "hr@btrpolymers.com",
  };

  const responsibilities = [
    "Develop and manage B2B customer relationships, serving as the primary point of contact for assigned accounts.",
    "Identify, pursue, and close new sales and sourcing opportunities within the recycled polymers market.",
    "Source recycled polymer materials and match supply with customer demand to create value-driven solutions.",
    "Manage multiple active opportunities concurrently, progressing prospects through the sales cycle using primarily remote communication.",
    "Conduct outbound sales outreach via phone, email, and virtual meetings to generate and advance new business.",
    "Collaborate with internal teams, including logistics and operations, to ensure successful execution of sales and sourcing activities.",
    "Maintain accurate records of opportunities, communications, and account activity within internal systems.",
    "Monitor market trends, pricing dynamics, and customer needs to identify new growth opportunities.",
    "Provide responsive, professional communication to customers and suppliers to build long-term partnerships.",
    "Meet or exceed individual performance goals and sales objectives.",
  ];

  const skills = [
    "Strong sales aptitude with a results-driven, goal-oriented mindset.",
    "Ability to manage multiple opportunities and priorities in a fast-paced environment.",
    "Excellent verbal and written communication skills, particularly in phone- and email-based sales environments.",
    "Self-motivated with a high level of accountability and initiative.",
    "Strong organizational skills and attention to detail.",
    "Ability to work independently while collaborating effectively with internal teams.",
    "Comfortable navigating complex markets and learning technical product details.",
  ];

  const qualifications = [
    "Prior experience in B2B sales, account management, or sourcing roles preferred.",
    "Experience working in industrial, manufacturing, commodities, or materials-based markets is a plus.",
    "Familiarity with CRM systems and sales tracking tools preferred.",
    "Proven ability to succeed in a remote-centric sales environment.",
  ];

  const benefits = [
    "Full-time employment",
    "Competitive base salary plus commission",
    "Uncapped commission structure",
    "Paid vacation and holidays",
    "Medical and dental benefits",
    "Minimal travel required",
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
            backgroundImage: "url(/images/account-manager.jpg)",
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
                A sales and sourcing role developing B2B relationships-identifying opportunities, sourcing material,
                and delivering tailored solutions across a dynamic recycled polymers market.
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
                    <div style={{ fontSize: "12px", opacity: 0.85, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginTop: "2px" }}>{item.value}</div>
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
                The Account Manager at BTR Polymers is a sales and sourcing role responsible for developing,
                managing, and growing business-to-business (B2B) relationships within the plastics manufacturing industry.
                This position focuses on identifying new opportunities, sourcing material, and supporting customers with
                tailored solutions across a complex and rapidly evolving marketplace.
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
                BTR Polymers is a post-industrial plastics recycling company committed to providing high-quality recycled
                polymers through sustainable and responsible manufacturing practices. The recycled polymers market presents
                significant opportunities due to its scale, diversity, and increasing demand for sustainable materials.
                Success in this role requires a driven, goal-oriented individual who is comfortable managing multiple
                opportunities simultaneously and advancing deals primarily through the sales process.
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
                This position involves minimal travel and offers a performance-based compensation structure with uncapped
                commission potential.
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
                  <a href={`mailto:${role.email}`} style={{ color: "#003A5D", fontWeight: 700, textDecoration: "none" }}>
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
                <div style={{ color: "#003A5D", fontWeight: 900 }}>Compensation & Benefits</div>

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
            Email your resume to <b>hr@btrpolymers.com</b> with the subject line: <b>Application: Account Manager</b>.
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
