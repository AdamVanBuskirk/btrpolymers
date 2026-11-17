
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

const responsibilities = [
  "Load and unload full truckloads of plastic materials using a forklift.",
  "Grade and verify inbound and outbound materials against shipping documentation.",
  "Organize, stage, and maintain materials throughout the warehouse.",
  "Perform light processing activities, including baling, slitting, and grinding.",
  "Keep warehouse work areas clean, organized, and ready for daily operations.",
  "Follow all safety procedures and operational guidelines.",
];

const qualifications = [
  "Prior experience operating a forklift in a warehouse or industrial environment.",
  "Ability to safely load, unload, move, and stage materials.",
  "A safety-first mindset with strong attention to detail.",
  "Reliable, punctual, and accountable.",
  "Comfortable working in a fast-paced warehouse environment.",
  "Able to follow instructions and work efficiently with a team.",
  "Experience verifying materials against shipping documents is a plus.",
  "Willingness to support light processing activities as needed.",
];

const role = {
  title: "Forklift Driver",
  department: "Operations",
  type: "Full-time",
  location: "On-site",
  email: "hr@btrpolymers.com",
};

export default function ForkliftDriver() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const applyUrl = `mailto:${role.email}?subject=${encodeURIComponent(
    `Application: ${role.title}`
  )}`;

  return (
    <>
      <Navigation />

      <main className="btr-forklift">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="btr-forklift-hero">
          <div className="btr-forklift-container">

            <Link
              to="/careers"
              className="btr-forklift-back-hero"
            >
              ← Back to Careers
            </Link>

            <span className="btr-forklift-eyebrow">
              JOIN THE BTR TEAM
            </span>

            <h1>
              Forklift
              <br />
              <span>Driver.</span>
            </h1>

            <p>
              Keep materials moving. Keep operations
              running. Be part of the team building
              BTR Polymers.
            </p>

            <div className="btr-forklift-meta">
              <span>{role.department}</span>
              <span>{role.type}</span>
              <span>{role.location}</span>
            </div>

            <a
              href="#apply"
              className="btr-forklift-button-primary"
            >
              Apply for This Role <span>↗</span>
            </a>

          </div>
        </section>

        {/* ======================================
            ABOUT THE ROLE
        ====================================== */}

        <section className="btr-forklift-intro">
          <div className="btr-forklift-container btr-forklift-two-col">

            <div>
              <span className="btr-forklift-eyebrow">
                THE OPPORTUNITY
              </span>

              <h2>
                Hands-on work.
                <br />
                Real responsibility.
              </h2>
            </div>

            <div className="btr-forklift-intro-copy">

              <p>
                As a Forklift Driver at BTR Polymers,
                you'll play an important role in our
                daily recycling operations, safely
                moving materials and supporting
                inbound and outbound shipments.
              </p>

              <p>
                You'll load and unload trucks, organize
                inventory, verify materials, and help
                keep our warehouse running efficiently.
                You'll also assist with light material
                processing when needed.
              </p>

              <p>
                We're looking for someone dependable,
                safety-minded, and willing to roll up
                their sleeves to get the job done.
              </p>

            </div>

          </div>
        </section>

        {/* ======================================
            RESPONSIBILITIES
        ====================================== */}

        <section className="btr-forklift-responsibilities">
          <div className="btr-forklift-container">

            <div className="btr-forklift-section-heading">
              <span className="btr-forklift-eyebrow">
                THE WORK
              </span>

              <h2>What you'll do.</h2>
            </div>

            <div className="btr-forklift-list-grid">
              {responsibilities.map((item, index) => (
                <div
                  className="btr-forklift-list-item"
                  key={item}
                >
                  <span className="btr-forklift-list-number">
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

        <section className="btr-forklift-qualifications">
          <div className="btr-forklift-container btr-forklift-two-col">

            <div>
              <span className="btr-forklift-eyebrow">
                WHAT WE'RE LOOKING FOR
              </span>

              <h2>
                Reliable.
                <br />
                Safety-minded.
                <br />
                Ready to work.
              </h2>

              <p className="btr-forklift-qualifications-intro">
                We value people who show up, take
                ownership, work safely, and help
                their teammates succeed.
              </p>
            </div>

            <div className="btr-forklift-qualification-list">
              {qualifications.map((item) => (
                <div
                  className="btr-forklift-qualification"
                  key={item}
                >
                  <span
                    className="btr-forklift-check"
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
            APPLICATION CTA
        ====================================== */}

        <section
          className="btr-forklift-cta"
          id="apply"
        >
          <div className="btr-forklift-container">

            <h2>Ready to join BTR?</h2>

            <p>
              Send your resume to{" "}
              <strong>{role.email}</strong> with the
              subject line{" "}
              <strong>Application: Forklift Driver</strong>.
            </p>

            <a
              href={applyUrl}
              className="btr-forklift-button-primary"
            >
              Email Your Resume <span>↗</span>
            </a>

            <div className="btr-forklift-cta-back">
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

        .btr-forklift {
          width: 100%;
          color: #071e2e;
          font-family: inherit;
        }

        .btr-forklift *,
        .btr-forklift *::before,
        .btr-forklift *::after {
          box-sizing: border-box;
        }

        .btr-forklift-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-forklift-eyebrow {
          display: block;

          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;

          color: #348e38;
        }

        /* ======================================
           BUTTON
        ====================================== */

        .btr-forklift-button-primary {
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

        .btr-forklift-button-primary:hover {
          background: #17405a;
          border-color: #17405a;
        }

        /* ======================================
           HERO
        ====================================== */

        .btr-forklift-hero {
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
            url("/images/forklift-driver.jpg");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 90px 0 105px;
        }

        .btr-forklift-hero .btr-forklift-container {
          position: relative;
          z-index: 1;
        }

        .btr-forklift-back-hero {
          display: inline-block;

          margin-bottom: 45px;

          font-size: 16px;
          font-weight: 600;

          color: #d5e3e8 !important;
          text-decoration: none !important;
        }

        .btr-forklift-back-hero:hover {
          color: #78d84b !important;
        }

        .btr-forklift-hero .btr-forklift-eyebrow {
          color: #86df58;
        }

        .btr-forklift-hero h1 {
          max-width: 1050px;
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-forklift-hero h1 span {
          color: #78d84b;
        }

        .btr-forklift-hero p {
          max-width: 700px;
          margin: 0;

          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        /* Job metadata */

        .btr-forklift-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;

          margin: 28px 0 35px;
        }

        .btr-forklift-meta span {
          display: inline-block;

          padding: 9px 15px;

          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;

          font-size: 14px;
          font-weight: 600;

          color: #ffffff;
        }

        .btr-forklift-hero .btr-forklift-button-primary {
          background: #72d348;
          border-color: #72d348;
          color: #071e2e !important;
        }

        .btr-forklift-hero .btr-forklift-button-primary:hover {
          background: #8ae566;
          border-color: #8ae566;
        }

        /* ======================================
           TWO COLUMN LAYOUT
        ====================================== */

        .btr-forklift-two-col {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
          align-items: start;
        }

        .btr-forklift-two-col h2,
        .btr-forklift-section-heading h2 {
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

        .btr-forklift-intro {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-forklift-intro-copy p {
          margin: 0 0 24px;

          font-size: 20px;
          line-height: 1.75;

          color: #53636a;
        }

        .btr-forklift-intro-copy p:last-child {
          margin-bottom: 0;
        }

        /* ======================================
           RESPONSIBILITIES
        ====================================== */

        .btr-forklift-responsibilities {
          padding: 110px 0;
          background: #f4f7f6;
        }

        .btr-forklift-section-heading {
          margin-bottom: 50px;
        }

        .btr-forklift-list-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 65px;
        }

        .btr-forklift-list-item {
          display: flex;
          align-items: flex-start;

          gap: 22px;
          padding: 25px 0;

          border-top: 1px solid #d6e0dc;
        }

        .btr-forklift-list-number {
          flex-shrink: 0;
          padding-top: 4px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;

          color: #40973c;
        }

        .btr-forklift-list-item p {
          margin: 0;

          font-size: 19px;
          line-height: 1.6;
          font-weight: 500;

          color: #071e2e;
        }

        /* ======================================
           QUALIFICATIONS
        ====================================== */

        .btr-forklift-qualifications {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-forklift-qualifications-intro {
          max-width: 460px;
          margin: 25px 0 0;

          font-size: 20px;
          line-height: 1.7;

          color: #53636a;
        }

        .btr-forklift-qualification-list {
          display: flex;
          flex-direction: column;
        }

        .btr-forklift-qualification {
          display: flex;
          align-items: flex-start;

          gap: 18px;
          padding: 20px 0;

          border-bottom: 1px solid #e1e8e6;
        }

        .btr-forklift-qualification:first-child {
          border-top: 1px solid #e1e8e6;
        }

        .btr-forklift-check {
          flex-shrink: 0;
          padding-top: 2px;

          font-size: 20px;
          font-weight: 700;

          color: #348e38;
        }

        .btr-forklift-qualification p {
          margin: 0;

          font-size: 19px;
          line-height: 1.6;

          color: #53636a;
        }

        /* ======================================
           CTA
        ====================================== */

        .btr-forklift-cta {
          padding: 100px 0;
          background: #071e2e;
          text-align: center;
          scroll-margin-top: 80px;
        }

        .btr-forklift-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-forklift-cta p {
          max-width: 680px;
          margin: 0 auto 32px;

          font-size: 20px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-forklift-cta p strong {
          color: #ffffff;
          font-weight: 650;
        }

        .btr-forklift-cta .btr-forklift-button-primary {
          background: #67cb42;
          border-color: #67cb42;
          color: #071e2e !important;
        }

        .btr-forklift-cta .btr-forklift-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        .btr-forklift-cta-back {
          margin-top: 35px;
        }

        .btr-forklift-cta-back a {
          font-size: 16px;
          font-weight: 600;
          color: #c2cdd3 !important;
          text-decoration: none !important;
        }

        .btr-forklift-cta-back a:hover {
          color: #78d84b !important;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-forklift-hero {
            padding: 80px 0 90px;
          }

          .btr-forklift-two-col {
            gap: 45px;
          }

          .btr-forklift-list-grid {
            column-gap: 35px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-forklift-container {
            padding: 0 24px;
          }

          .btr-forklift-hero {
            padding: 60px 0 75px;
            background-position: 60% center;
          }

          .btr-forklift-back-hero {
            margin-bottom: 35px;
          }

          .btr-forklift-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-forklift-hero p {
            font-size: 18px;
          }

          .btr-forklift-intro,
          .btr-forklift-responsibilities,
          .btr-forklift-qualifications {
            padding: 70px 0;
          }

          .btr-forklift-two-col {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .btr-forklift-intro-copy p {
            font-size: 18px;
          }

          .btr-forklift-section-heading {
            margin-bottom: 35px;
          }

          .btr-forklift-list-grid {
            grid-template-columns: 1fr;
          }

          .btr-forklift-list-item {
            padding: 20px 0;
          }

          .btr-forklift-list-item p {
            font-size: 18px;
          }

          .btr-forklift-qualifications-intro {
            font-size: 18px;
          }

          .btr-forklift-qualification p {
            font-size: 18px;
          }

          .btr-forklift-cta {
            padding: 75px 0;
          }

          .btr-forklift-cta p {
            font-size: 18px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-forklift-button-primary {
            transition: none;
          }
        }

      `}</style>
    </>
  );
}
