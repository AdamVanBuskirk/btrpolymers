
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

const capabilities = [
  "Program design and optimization",
  "Material flow analysis and segregation",
  "On-site handling and storage",
  "Transportation and logistics",
  "Recycled material market access",
  "Ongoing program management",
];

const benefits = [
  {
    number: "01",
    title: "Lower Costs",
    description:
      "Reduce disposal, handling, and logistics expenses through smarter recycling operations.",
  },
  {
    number: "02",
    title: "Greater Recovery",
    description:
      "Maximize the value of recyclable materials through better processes and market access.",
  },
  {
    number: "03",
    title: "Reliable Programs",
    description:
      "Build consistent, scalable recycling operations that adapt as your business evolves.",
  },
];

export default function Solutions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <main className="btr-solutions">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="btr-solutions-hero">
          <div className="btr-solutions-container">

            <span className="btr-solutions-eyebrow">
              OUR SOLUTIONS
            </span>

            <h1>
              Industrial Recycling.
              <br />
              <span>Built Around You.</span>
            </h1>

            <p>
              Customized recycling programs that help
              manufacturers reduce waste, improve efficiency,
              and recover more value from their materials.
            </p>

            <Link
              to="/contact"
              className="btr-solutions-button-primary"
            >
              Talk to Our Team <span>↗</span>
            </Link>

          </div>
        </section>

        {/* ======================================
            OUR APPROACH
        ====================================== */}

        <section className="btr-solutions-approach">
          <div className="btr-solutions-container btr-solutions-two-col">

            <div>
              <span className="btr-solutions-eyebrow">
                OUR APPROACH
              </span>

              <h2>
                Your operation.
                <br />
                Your program.
              </h2>
            </div>

            <div className="btr-solutions-approach-copy">
              <p>
                No two manufacturing facilities operate the
                same way. That's why we don't believe in
                one-size-fits-all recycling programs.
              </p>

              <p>
                We work directly with your team to understand
                material streams, handling processes, and
                logistics. Then we design and manage a
                recycling program that fits your operation
                and delivers measurable value.
              </p>
            </div>

          </div>
        </section>

        {/* ======================================
            WHAT WE HANDLE
        ====================================== */}

        <section className="btr-solutions-capabilities">
          <div className="btr-solutions-container">

            <div className="btr-solutions-section-heading">
              <span className="btr-solutions-eyebrow">
                WHAT WE HANDLE
              </span>

              <h2>
                From the plant floor
                <br />
                to the marketplace.
              </h2>

              <p>
                We manage the moving parts of industrial
                recycling so your team can stay focused
                on manufacturing.
              </p>
            </div>

            <div className="btr-solutions-capability-grid">
              {capabilities.map((capability, index) => (
                <div
                  className="btr-solutions-capability"
                  key={capability}
                >
                  <span className="btr-solutions-capability-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="btr-solutions-capability-name">
                    {capability}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            BUSINESS RESULTS
        ====================================== */}

        <section className="btr-solutions-results">
          <div className="btr-solutions-container">

            <div className="btr-solutions-section-heading">
              <span className="btr-solutions-eyebrow">
                THE RESULTS
              </span>

              <h2>
                Recycling that makes
                <br />
                business sense.
              </h2>
            </div>

            <div className="btr-solutions-results-grid">
              {benefits.map((benefit) => (
                <div
                  className="btr-solutions-result"
                  key={benefit.number}
                >
                  <span className="btr-solutions-result-number">
                    {benefit.number}
                  </span>

                  <h3>{benefit.title}</h3>

                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="btr-solutions-results-footer">
              <p>
                From a single facility to a multi-site
                manufacturing network, we build programs
                designed for long-term performance.
              </p>
            </div>

          </div>
        </section>

        {/* ======================================
            CONTACT
        ====================================== */}

        <section className="btr-solutions-cta">
          <div className="btr-solutions-container">

            <h2>Let's build your program.</h2>

            <p>
              Tell us about your facility and material streams.
              We'll help you find a better way forward.
            </p>

            <Link
              to="/contact"
              className="btr-solutions-button-primary"
            >
              Contact BTR <span>↗</span>
            </Link>

          </div>
        </section>

      </main>

      <Footer />

      {/* ======================================
          ALL SOLUTIONS PAGE STYLES
      ====================================== */}

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-solutions {
          color: #071e2e;
          font-family: inherit;
        }

        .btr-solutions *,
        .btr-solutions *::before,
        .btr-solutions *::after {
          box-sizing: border-box;
        }

        .btr-solutions-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-solutions-eyebrow {
          display: block;

          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;

          color: #348e38;
        }

        /* ======================================
           BUTTONS
        ====================================== */

        .btr-solutions-button-primary {
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

        .btr-solutions-button-primary:hover {
          background: #17405a;
          border-color: #17405a;
        }

        /* ======================================
           HERO
        ====================================== */

        .btr-solutions-hero {
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
            url("/images/large-factory.jpg");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 125px 0 115px;
        }

        .btr-solutions-hero .btr-solutions-container {
          position: relative;
          z-index: 1;
        }

        .btr-solutions-hero .btr-solutions-eyebrow {
          color: #86df58;
        }

        .btr-solutions-hero h1 {
          max-width: 1050px;
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-solutions-hero h1 span {
          color: #78d84b;
        }

        .btr-solutions-hero p {
          max-width: 700px;
          margin: 0 0 38px;

          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        .btr-solutions-hero .btr-solutions-button-primary {
          background: #72d348;
          border-color: #72d348;

          color: #071e2e !important;
        }

        .btr-solutions-hero .btr-solutions-button-primary:hover {
          background: #8ae566;
          border-color: #8ae566;
        }

        /* ======================================
           OUR APPROACH
        ====================================== */

        .btr-solutions-approach {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-solutions-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: start;
        }

        .btr-solutions-approach h2 {
          margin: 20px 0 0;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-solutions-approach-copy p {
          margin: 0 0 24px;

          font-size: 21px;
          line-height: 1.75;

          color: #53636a;
        }

        .btr-solutions-approach-copy p:last-child {
          margin-bottom: 0;
        }

        /* ======================================
           WHAT WE HANDLE
        ====================================== */

        .btr-solutions-capabilities {
          padding: 105px 0 115px;
          background: #f4f7f6;
        }

        .btr-solutions-section-heading {
          margin-bottom: 55px;
        }

        .btr-solutions-section-heading h2 {
          margin: 20px 0 20px;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-solutions-section-heading > p {
          max-width: 680px;
          margin: 0;

          font-size: 20px;
          line-height: 1.7;

          color: #53636a;
        }

        /* Capability list */

        .btr-solutions-capability-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));

          column-gap: 65px;
          row-gap: 0;
        }

        .btr-solutions-capability {
          display: flex;
          align-items: center;

          gap: 22px;
          padding: 27px 0;

          border-top: 1px solid #d6e0dc;
        }

        .btr-solutions-capability-number {
          flex-shrink: 0;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;

          color: #40973c;
        }

        .btr-solutions-capability-name {
          font-size: 21px;
          line-height: 1.45;
          font-weight: 600;

          color: #071e2e;
        }

        /* ======================================
           BUSINESS RESULTS
        ====================================== */

        .btr-solutions-results {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-solutions-results-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));

          gap: 45px;
        }

        .btr-solutions-result {
          padding-top: 24px;
          border-top: 3px solid #5bb83c;
        }

        .btr-solutions-result-number {
          display: block;

          margin-bottom: 25px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;

          color: #40973c;
        }

        .btr-solutions-result h3 {
          margin: 0 0 15px;

          font-size: 29px;
          line-height: 1.3;
          font-weight: 650;
          letter-spacing: -0.02em;

          color: #071e2e;
        }

        .btr-solutions-result p {
          margin: 0;

          font-size: 19px;
          line-height: 1.7;

          color: #53636a;
        }

        .btr-solutions-results-footer {
          margin-top: 65px;
          padding-top: 25px;

          border-top: 1px solid #e0e7e6;
        }

        .btr-solutions-results-footer p {
          max-width: 820px;
          margin: 0;

          font-size: 20px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           CONTACT CTA
        ====================================== */

        .btr-solutions-cta {
          padding: 100px 0;
          background: #071e2e;

          text-align: center;
        }

        .btr-solutions-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-solutions-cta p {
          max-width: 620px;
          margin: 0 auto 32px;

          font-size: 20px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-solutions-cta .btr-solutions-button-primary {
          background: #67cb42;
          border-color: #67cb42;

          color: #071e2e !important;
        }

        .btr-solutions-cta .btr-solutions-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-solutions-hero {
            padding: 95px 0 85px;
          }

          .btr-solutions-two-col {
            gap: 50px;
          }

          .btr-solutions-capability-grid {
            column-gap: 35px;
          }

          .btr-solutions-results-grid {
            gap: 25px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-solutions-container {
            padding: 0 24px;
          }

          .btr-solutions-hero {
            padding: 85px 0 75px;
            background-position: 60% center;
          }

          .btr-solutions-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-solutions-hero p {
            font-size: 18px;
          }

          .btr-solutions-approach,
          .btr-solutions-capabilities,
          .btr-solutions-results {
            padding: 70px 0;
          }

          .btr-solutions-two-col {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .btr-solutions-approach-copy p {
            font-size: 18px;
          }

          .btr-solutions-section-heading {
            margin-bottom: 35px;
          }

          .btr-solutions-section-heading > p {
            font-size: 18px;
          }

          .btr-solutions-capability-grid {
            grid-template-columns: 1fr;
          }

          .btr-solutions-capability {
            padding: 22px 0;
          }

          .btr-solutions-capability-name {
            font-size: 19px;
          }

          .btr-solutions-results-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .btr-solutions-result h3 {
            font-size: 26px;
          }

          .btr-solutions-result p {
            font-size: 18px;
          }

          .btr-solutions-results-footer {
            margin-top: 45px;
          }

          .btr-solutions-results-footer p {
            font-size: 18px;
          }

          .btr-solutions-cta {
            padding: 75px 0;
          }

          .btr-solutions-cta p {
            font-size: 18px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-solutions-button-primary {
            transition: none;
          }
        }

      `}</style>
    </>
  );
}
