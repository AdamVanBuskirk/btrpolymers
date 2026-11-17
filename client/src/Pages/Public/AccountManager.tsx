
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

const responsibilities = [
  "Develop and grow B2B relationships with customers and suppliers in the plastics industry.",
  "Identify new sales and sourcing opportunities through outbound calls, email, and virtual meetings.",
  "Source recycled polymer materials and match supply with customer demand.",
  "Manage multiple opportunities through the sales cycle, from prospecting to closing.",
  "Work closely with operations and logistics to ensure successful execution.",
  "Maintain accurate CRM records and monitor opportunities, pricing, and market trends.",
  "Build lasting partnerships through responsive communication and reliable follow-through.",
  "Meet or exceed individual sales and performance goals.",
];

const qualifications = [
  "Experience in B2B sales, account management, or sourcing preferred.",
  "Strong communication skills, particularly over the phone and through email.",
  "Self-motivated, organized, and comfortable managing multiple priorities.",
  "Results-driven with a high level of ownership and accountability.",
  "Ability to learn technical products and navigate complex markets.",
  "Experience in industrial, manufacturing, commodities, or materials markets is a plus.",
  "Comfortable working independently in a primarily remote sales environment.",
];

const benefits = [
  "Competitive base salary",
  "Uncapped commission",
  "Paid vacation and holidays",
  "Medical and dental benefits",
  "Minimal travel",
  "Full-time employment",
];

const role = {
  title: "Account Manager",
  department: "Sales",
  type: "Full-time",
  location: "On-site",
  email: "hr@btrpolymers.com",
};

export default function AccountManager() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const applyUrl = `mailto:${role.email}?subject=${encodeURIComponent(
    `Application: ${role.title}`
  )}`;

  return (
    <>
      <Navigation />

      <main className="btr-job">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="btr-job-hero">
          <div className="btr-job-container">

            <Link
              to="/careers"
              className="btr-job-back-hero"
            >
              ← Back to Careers
            </Link>

            <span className="btr-job-eyebrow">
              JOIN THE BTR TEAM
            </span>

            <h1>
              Account
              <br />
              <span>Manager.</span>
            </h1>

            <p>
              Build relationships. Find opportunities.
              Help manufacturers turn recycled polymers
              into real business value.
            </p>

            <div className="btr-job-meta">
              <span>{role.department}</span>
              <span>{role.type}</span>
              <span>{role.location}</span>
            </div>

            <a
              href="#apply"
              className="btr-job-button-primary"
            >
              Apply for This Role <span>↗</span>
            </a>

          </div>
        </section>

        {/* ======================================
            ABOUT THE ROLE
        ====================================== */}

        <section className="btr-job-intro">
          <div className="btr-job-container btr-job-two-col">

            <div>
              <span className="btr-job-eyebrow">
                THE OPPORTUNITY
              </span>

              <h2>
                Own your pipeline.
                <br />
                Grow the business.
              </h2>
            </div>

            <div className="btr-job-intro-copy">
              <p>
                As an Account Manager at BTR Polymers,
                you'll develop customer and supplier
                relationships, identify new opportunities,
                and source recycled polymer materials
                across a dynamic industrial marketplace.
              </p>

              <p>
                This is a hands-on sales role for someone
                who enjoys prospecting, solving problems,
                and moving opportunities forward. You'll
                manage your own pipeline while working
                closely with our operations team to
                deliver results.
              </p>

              <p>
                The role offers performance-based
                compensation, uncapped commission
                potential, and minimal travel.
              </p>
            </div>

          </div>
        </section>

        {/* ======================================
            RESPONSIBILITIES
        ====================================== */}

        <section className="btr-job-responsibilities">
          <div className="btr-job-container">

            <div className="btr-job-section-heading">
              <span className="btr-job-eyebrow">
                THE WORK
              </span>

              <h2>What you'll do.</h2>
            </div>

            <div className="btr-job-list-grid">
              {responsibilities.map((item, index) => (
                <div
                  className="btr-job-list-item"
                  key={item}
                >
                  <span className="btr-job-list-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p>{item}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            QUALIFICATIONS
        ====================================== */}

        <section className="btr-job-qualifications">
          <div className="btr-job-container btr-job-two-col">

            <div>
              <span className="btr-job-eyebrow">
                WHAT WE'RE LOOKING FOR
              </span>

              <h2>
                Driven.
                <br />
                Resourceful.
                <br />
                Accountable.
              </h2>

              <p className="btr-job-qualifications-intro">
                We're looking for someone who takes
                ownership, communicates clearly, and
                knows how to turn opportunities into
                results.
              </p>
            </div>

            <div className="btr-job-qualification-list">
              {qualifications.map((item) => (
                <div
                  className="btr-job-qualification"
                  key={item}
                >
                  <span
                    className="btr-job-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <p>{item}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            COMPENSATION & BENEFITS
        ====================================== */}

        <section className="btr-job-benefits">
          <div className="btr-job-container">

            <div className="btr-job-section-heading">
              <span className="btr-job-eyebrow">
                COMPENSATION & BENEFITS
              </span>

              <h2>
                Rewarding work.
                <br />
                Room to grow.
              </h2>
            </div>

            <div className="btr-job-benefits-grid">
              {benefits.map((benefit) => (
                <div
                  className="btr-job-benefit"
                  key={benefit}
                >
                  <span
                    className="btr-job-benefit-mark"
                    aria-hidden="true"
                  >
                    ↗
                  </span>

                  <span>{benefit}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            APPLICATION CTA
        ====================================== */}

        <section
          className="btr-job-cta"
          id="apply"
        >
          <div className="btr-job-container">

            <h2>Ready to join BTR?</h2>

            <p>
              Send your resume to{" "}
              <strong>{role.email}</strong> with the
              subject line{" "}
              <strong>Application: Account Manager</strong>.
            </p>

            <a
              href={applyUrl}
              className="btr-job-button-primary"
            >
              Email Your Resume <span>↗</span>
            </a>

            <div className="btr-job-cta-back">
              <Link to="/careers">
                ← View All Careers
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-job {
          width: 100%;
          color: #071e2e;
          font-family: inherit;
        }

        .btr-job *,
        .btr-job *::before,
        .btr-job *::after {
          box-sizing: border-box;
        }

        .btr-job-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-job-eyebrow {
          display: block;

          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;

          color: #348e38;
        }

        /* ======================================
           BUTTON
        ====================================== */

        .btr-job-button-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 25px;
          padding: 15px 24px;

          background: #071e2e;
          color: #ffffff !important;

          border: 1px solid #071e2e;
          border-radius: 4px;

          font-size: 16px;
          font-weight: 600;

          text-decoration: none !important;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .btr-job-button-primary:hover {
          background: #17405a;
          border-color: #17405a;
        }

        /* ======================================
           HERO
        ====================================== */

        .btr-job-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;

          background:
            linear-gradient(
              90deg,
              rgba(4, 22, 34, 0.94) 0%,
              rgba(4, 22, 34, 0.82) 48%,
              rgba(4, 22, 34, 0.48) 100%
            ),
            url("/images/account-manager.jpg");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 90px 0 105px;
        }

        .btr-job-hero .btr-job-container {
          position: relative;
          z-index: 1;
        }

        .btr-job-back-hero {
          display: inline-block;

          margin-bottom: 45px;

          font-size: 16px;
          font-weight: 600;

          color: #d5e3e8 !important;
          text-decoration: none !important;
        }

        .btr-job-back-hero:hover {
          color: #78d84b !important;
        }

        .btr-job-hero .btr-job-eyebrow {
          color: #86df58;
        }

        .btr-job-hero h1 {
          max-width: 1050px;
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-job-hero h1 span {
          color: #78d84b;
        }

        .btr-job-hero p {
          max-width: 700px;
          margin: 0;

          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        /* Job metadata */

        .btr-job-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;

          margin: 28px 0 35px;
        }

        .btr-job-meta span {
          display: inline-block;

          padding: 9px 15px;

          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;

          font-size: 14px;
          font-weight: 600;

          color: #ffffff;
        }

        .btr-job-hero .btr-job-button-primary {
          background: #72d348;
          border-color: #72d348;
          color: #071e2e !important;
        }

        .btr-job-hero .btr-job-button-primary:hover {
          background: #8ae566;
          border-color: #8ae566;
        }

        /* ======================================
           TWO COLUMN LAYOUT
        ====================================== */

        .btr-job-two-col {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
          align-items: start;
        }

        .btr-job-two-col h2,
        .btr-job-section-heading h2 {
          margin: 20px 0;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        /* ======================================
           ABOUT ROLE
        ====================================== */

        .btr-job-intro {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-job-intro-copy p {
          margin: 0 0 24px;

          font-size: 20px;
          line-height: 1.75;

          color: #53636a;
        }

        .btr-job-intro-copy p:last-child {
          margin-bottom: 0;
        }

        /* ======================================
           RESPONSIBILITIES
        ====================================== */

        .btr-job-responsibilities {
          padding: 110px 0;
          background: #f4f7f6;
        }

        .btr-job-section-heading {
          margin-bottom: 50px;
        }

        .btr-job-list-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 65px;
        }

        .btr-job-list-item {
          display: flex;
          align-items: flex-start;

          gap: 22px;
          padding: 25px 0;

          border-top: 1px solid #d6e0dc;
        }

        .btr-job-list-number {
          flex-shrink: 0;
          padding-top: 4px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;

          color: #40973c;
        }

        .btr-job-list-item p {
          margin: 0;

          font-size: 19px;
          line-height: 1.6;
          font-weight: 500;

          color: #071e2e;
        }

        /* ======================================
           QUALIFICATIONS
        ====================================== */

        .btr-job-qualifications {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-job-qualifications-intro {
          max-width: 460px;
          margin: 25px 0 0;

          font-size: 20px;
          line-height: 1.7;

          color: #53636a;
        }

        .btr-job-qualification-list {
          display: flex;
          flex-direction: column;
        }

        .btr-job-qualification {
          display: flex;
          align-items: flex-start;

          gap: 18px;
          padding: 20px 0;

          border-bottom: 1px solid #e1e8e6;
        }

        .btr-job-qualification:first-child {
          border-top: 1px solid #e1e8e6;
        }

        .btr-job-check {
          flex-shrink: 0;
          padding-top: 2px;

          font-size: 20px;
          font-weight: 700;

          color: #348e38;
        }

        .btr-job-qualification p {
          margin: 0;

          font-size: 19px;
          line-height: 1.6;

          color: #53636a;
        }

        /* ======================================
           BENEFITS
        ====================================== */

        .btr-job-benefits {
          padding: 110px 0;
          background: #f4f7f6;
        }

        .btr-job-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .btr-job-benefit {
          display: flex;
          align-items: center;

          gap: 15px;
          min-height: 100px;
          padding: 25px;

          background: #ffffff;
          border: 1px solid #e1e8e6;
          border-radius: 5px;

          font-size: 20px;
          line-height: 1.4;
          font-weight: 600;

          color: #071e2e;
        }

        .btr-job-benefit-mark {
          flex-shrink: 0;

          font-size: 24px;
          color: #348e38;
        }

        /* ======================================
           CTA
        ====================================== */

        .btr-job-cta {
          padding: 100px 0;
          background: #071e2e;
          text-align: center;
          scroll-margin-top: 80px;
        }

        .btr-job-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-job-cta p {
          max-width: 680px;
          margin: 0 auto 32px;

          font-size: 20px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-job-cta p strong {
          color: #ffffff;
          font-weight: 650;
        }

        .btr-job-cta .btr-job-button-primary {
          background: #67cb42;
          border-color: #67cb42;
          color: #071e2e !important;
        }

        .btr-job-cta .btr-job-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        .btr-job-cta-back {
          margin-top: 35px;
        }

        .btr-job-cta-back a {
          font-size: 16px;
          font-weight: 600;
          color: #c2cdd3 !important;
          text-decoration: none !important;
        }

        .btr-job-cta-back a:hover {
          color: #78d84b !important;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-job-hero {
            padding: 80px 0 90px;
          }

          .btr-job-two-col {
            gap: 45px;
          }

          .btr-job-list-grid {
            column-gap: 35px;
          }

          .btr-job-benefits-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-job-container {
            padding: 0 24px;
          }

          .btr-job-hero {
            padding: 60px 0 75px;
            background-position: 60% center;
          }

          .btr-job-back-hero {
            margin-bottom: 35px;
          }

          .btr-job-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-job-hero p {
            font-size: 18px;
          }

          .btr-job-intro,
          .btr-job-responsibilities,
          .btr-job-qualifications,
          .btr-job-benefits {
            padding: 70px 0;
          }

          .btr-job-two-col {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .btr-job-intro-copy p {
            font-size: 18px;
          }

          .btr-job-section-heading {
            margin-bottom: 35px;
          }

          .btr-job-list-grid {
            grid-template-columns: 1fr;
          }

          .btr-job-list-item {
            padding: 20px 0;
          }

          .btr-job-list-item p {
            font-size: 18px;
          }

          .btr-job-qualifications-intro {
            font-size: 18px;
          }

          .btr-job-qualification p {
            font-size: 18px;
          }

          .btr-job-benefits-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .btr-job-benefit {
            min-height: 85px;
            font-size: 18px;
          }

          .btr-job-cta {
            padding: 75px 0;
          }

          .btr-job-cta p {
            font-size: 18px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-job-button-primary {
            transition: none;
          }
        }

      `}</style>
    </>
  );
}
