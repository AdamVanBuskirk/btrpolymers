
import React, { useEffect } from "react";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <main className="btr-contact">

        <section className="btr-contact-section">
          <div className="btr-contact-container">

            {/* LEFT: INTRODUCTION */}

            <div className="btr-contact-intro">

              <span className="btr-contact-eyebrow">
                CONTACT BTR POLYMERS
              </span>

              <h1>
                Let's get
                <br />
                <span>to work.</span>
              </h1>

              <p className="btr-contact-description">
                Have plastic scrap to recycle, need a reliable
                source of recycled polymers, or want to explore
                working together? We'd love to hear from you.
              </p>

              <div className="btr-contact-phone-block">

                <span className="btr-contact-label">
                  GIVE US A CALL
                </span>

                <a
                  href="tel:+12346023600"
                  className="btr-contact-phone"
                >
                  (234) 602-3600
                </a>

              </div>

              <div className="btr-contact-note">
                Or send us a message using the form.
              </div>

            </div>

            {/* RIGHT: JOTFORM */}

            <div className="btr-contact-form-column">

              <div className="btr-contact-form-heading">
                <h2>Send us a message.</h2>
                <p>
                  Tell us a little about what you're looking for.
                </p>
              </div>

              <div className="btr-contact-form-wrap">
                <iframe
                  src="https://form.jotform.com/263143393857061"
                  title="Contact BTR Polymers"
                  className="btr-contact-iframe"
                  loading="lazy"
                />
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-contact {
          width: 100%;
          background: #ffffff;
          color: #071e2e;
          font-family: inherit;
        }

        .btr-contact *,
        .btr-contact *::before,
        .btr-contact *::after {
          box-sizing: border-box;
        }

        /* ======================================
           MAIN LAYOUT
        ====================================== */

        .btr-contact-section {
          padding: 110px 0 115px;
        }

        .btr-contact-container {
          display: grid;
          grid-template-columns:
            minmax(0, 0.9fr)
            minmax(0, 1.1fr);

          gap: 90px;
          align-items: start;

          width: 100%;
          max-width: 1280px;

          margin: 0 auto;
          padding: 0 40px;
        }

        /* ======================================
           LEFT COLUMN
        ====================================== */

        .btr-contact-eyebrow {
          display: block;

          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;

          color: #348e38;
        }

        .btr-contact-intro h1 {
          margin: 24px 0 28px;

          font-size: clamp(54px, 6vw, 82px);
          line-height: 1.07;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #071e2e;
        }

        .btr-contact-intro h1 span {
          color: #4aa52f;
        }

        .btr-contact-description {
          max-width: 480px;
          margin: 0;

          font-size: 21px;
          line-height: 1.75;

          color: #53636a;
        }

        /* ======================================
           PHONE NUMBER
        ====================================== */

        .btr-contact-phone-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          gap: 12px;

          margin-top: 55px;
          padding-top: 28px;

          border-top: 1px solid #dce5e1;
        }

        .btr-contact-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;

          color: #348e38;
        }

        .btr-contact-phone {
          display: inline-block;

          font-size: clamp(28px, 3vw, 38px);
          font-weight: 650;
          letter-spacing: -0.025em;

          color: #071e2e !important;
          text-decoration: none !important;

          transition: color 0.2s ease;
        }

        .btr-contact-phone:hover {
          color: #348e38 !important;
        }

        .btr-contact-note {
          margin-top: 35px;

          font-size: 17px;
          line-height: 1.6;

          color: #65737a;
        }

        /* ======================================
           FORM COLUMN
        ====================================== */

        .btr-contact-form-column {
          min-width: 0;
        }

        .btr-contact-form-heading {
          margin-bottom: 22px;
        }

        .btr-contact-form-heading h2 {
          margin: 0 0 10px;

          font-size: 32px;
          line-height: 1.2;
          font-weight: 650;
          letter-spacing: -0.025em;

          color: #071e2e;
        }

        .btr-contact-form-heading p {
          margin: 0;

          font-size: 18px;
          line-height: 1.65;

          color: #53636a;
        }

        /* Jotform container */

        .btr-contact-form-wrap {
          width: 100%;
          min-width: 0;

          background: #f4f7f6;

          border: 1px solid #e1e8e6;
          border-radius: 8px;

          overflow: hidden;
        }

        .btr-contact-iframe {
          display: block;

          width: 100%;
          height: 850px;

          border: 0;
          background: transparent;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 1000px) {

          .btr-contact-container {
            gap: 45px;
          }

          .btr-contact-section {
            padding: 85px 0;
          }

          .btr-contact-description {
            font-size: 19px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-contact-section {
            padding: 65px 0 75px;
          }

          .btr-contact-container {
            grid-template-columns: 1fr;

            gap: 55px;

            padding: 0 24px;
          }

          .btr-contact-intro h1 {
            font-size: clamp(48px, 11vw, 64px);
          }

          .btr-contact-description {
            font-size: 18px;
          }

          .btr-contact-phone-block {
            margin-top: 35px;
          }

          .btr-contact-phone {
            font-size: 32px;
          }

          .btr-contact-note {
            margin-top: 25px;
          }

          .btr-contact-form-heading h2 {
            font-size: 28px;
          }

          .btr-contact-form-heading p {
            font-size: 17px;
          }

          .btr-contact-iframe {
            height: 900px;
          }

        }

        /* ======================================
           SMALL MOBILE
        ====================================== */

        @media (max-width: 420px) {

          .btr-contact-container {
            padding: 0 18px;
          }

          .btr-contact-iframe {
            height: 950px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-contact-phone {
            transition: none;
          }
        }

      `}</style>
    </>
  );
}
