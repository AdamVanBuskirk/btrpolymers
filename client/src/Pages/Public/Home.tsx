
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <main className="btr-home">

        {/* ======================================
            HERO - WAREHOUSE BACKGROUND
        ====================================== */}

        <section className="btr-home-hero">
          <div className="btr-home-container">

            <div className="btr-home-eyebrow">
              BTR POLYMERS
            </div>

            <h1>
              Industrial Plastics.
              <br />
              Recycled. <span>Reimagined.</span>
            </h1>

            <p className="btr-home-hero-description">
              We help manufacturers turn post-industrial
              plastic scrap into value through customized
              recycling programs and reliable recycled
              polymer supply.
            </p>

            <div className="btr-home-actions">

              <Link
                to="/solutions"
                className="btr-home-button-primary"
              >
                Our Solutions <span>↗</span>
              </Link>

              <Link
                to="/materials"
                className="btr-home-button-secondary"
              >
                Explore Materials <span>↗</span>
              </Link>

            </div>

            <div className="btr-home-mission">
              <span className="btr-home-mission-line" />

              <span style={{ fontWeight: "bold" }}>
                On a mission to recycle 3 billion pounds of
                post-industrial plastic scrap by 2036.
              </span>
            </div>

          </div>
        </section>

        {/* ======================================
            WHAT WE DO
        ====================================== */}

        <section className="btr-home-services">
          <div className="btr-home-container">

            <div className="btr-home-section-heading">

              <span className="btr-home-eyebrow">
                WHAT WE DO
              </span>

              <h2>
                Practical solutions.
                <br />
                Real material value.
              </h2>

            </div>

            <div className="btr-home-service-grid">

              {/* SOLUTIONS */}

              <Link
                to="/solutions"
                className="btr-home-service"
              >
                <span className="btr-home-service-index">
                  01 / SOLUTIONS
                </span>

                <h3>Industrial Recycling</h3>

                <p>
                  Custom recycling programs built around
                  your operation to reduce waste, improve
                  efficiency, and maximize material recovery.
                </p>

                <span className="btr-home-service-link">
                  Explore Solutions ↗
                </span>
              </Link>

              {/* MATERIALS */}

              <Link
                to="/materials"
                className="btr-home-service"
              >
                <span className="btr-home-service-index">
                  02 / MATERIALS
                </span>

                <h3>Recycled Polymers</h3>

                <p>
                  Reliable, cost-effective recycled and
                  reprocessed resins sourced to meet your
                  manufacturing and supply requirements.
                </p>

                <span className="btr-home-service-link">
                  Explore Materials ↗
                </span>
              </Link>

            </div>

          </div>
        </section>

        {/* ======================================
            WHY BTR
        ====================================== */}

        <section className="btr-home-why">
          <div className="btr-home-container btr-home-why-layout">

            <div className="btr-home-why-heading">

              <span className="btr-home-eyebrow">
                THE BTR DIFFERENCE
              </span>

              <h2>
                Built for
                <br />
                real manufacturing.
              </h2>

              <Link
                to="/about"
                className="btr-home-text-link"
              >
                Get to Know BTR ↗
              </Link>

            </div>

            <div className="btr-home-why-points">

              <div>
                <h3>Service-Driven</h3>

                <p>
                  Hands-on partnerships and solutions
                  tailored to your operation.
                </p>
              </div>

              <div>
                <h3>Market-Driven</h3>

                <p>
                  Material expertise and sourcing strategies
                  built around performance and value.
                </p>
              </div>

              <div>
                <h3>Built to Scale</h3>

                <p>
                  Reliable programs designed to grow
                  alongside your business.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================
            CONTACT CTA
        ====================================== */}

        <section className="btr-home-cta">
          <div className="btr-home-container">

            <h2>Let's get to work.</h2>

            <p>
              Have plastic scrap to recycle or need a
              reliable source of recycled polymers?
              Let's talk.
            </p>

            <Link
              to="/contact"
              className="btr-home-button-primary"
            >
              Contact BTR <span>↗</span>
            </Link>

          </div>
        </section>

      </main>

      <Footer />

      {/* ======================================
          ALL HOMEPAGE STYLES
      ====================================== */}

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-home {
          color: #071e2e;
          font-family: inherit;
        }

        .btr-home *,
        .btr-home *::before,
        .btr-home *::after {
          box-sizing: border-box;
        }

        .btr-home-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-home-eyebrow {
          display: block;

          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;

          color: #348e38;
        }

        /* ======================================
           HERO - WAREHOUSE IMAGE
        ====================================== */

        .btr-home-hero {
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
            url("/images/recycling-factory.jpg");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 130px 0 105px;
        }

        .btr-home-hero .btr-home-container {
          position: relative;
          z-index: 1;
        }

        .btr-home-hero .btr-home-eyebrow {
          color: #86df58;
        }

        .btr-home-hero h1 {
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 86px);
          line-height: 1.07;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-home-hero h1 span {
          color: #78d84b;
        }

        .btr-home-hero-description {
          max-width: 680px;
          margin: 0;

          font-size: clamp(18px, 2vw, 22px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        /* ======================================
           HERO BUTTONS
        ====================================== */

        .btr-home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;

          margin-top: 38px;
        }

        .btr-home-button-primary,
        .btr-home-button-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 25px;
          padding: 15px 24px;

          border-radius: 4px;

          font-size: 15px;
          font-weight: 600;

          text-decoration: none !important;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .btr-home-button-primary {
          background: #071e2e;
          color: #ffffff !important;

          border: 1px solid #071e2e;
        }

        .btr-home-button-primary:hover {
          background: #17405a;
          border-color: #17405a;

          color: #ffffff !important;
        }

        .btr-home-button-secondary {
          background: transparent;
          color: #071e2e !important;

          border: 1px solid #cbd5d9;
        }

        .btr-home-button-secondary:hover {
          border-color: #071e2e;
        }

        /* Hero-specific button colors */

        .btr-home-hero .btr-home-button-primary {
          background: #72d348;
          border-color: #72d348;

          color: #071e2e !important;
        }

        .btr-home-hero .btr-home-button-primary:hover {
          background: #8ae566;
          border-color: #8ae566;
        }

        .btr-home-hero .btr-home-button-secondary {
          background: rgba(255, 255, 255, 0.06);

          border-color: rgba(255, 255, 255, 0.65);

          color: #ffffff !important;
        }

        .btr-home-hero .btr-home-button-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: #ffffff;
        }

        /* ======================================
           MISSION STATEMENT
        ====================================== */

        .btr-home-mission {
          display: flex;
          align-items: center;
          gap: 15px;

          margin-top: 85px;

          font-size: 14px;
          line-height: 1.6;

          color: #d2dce0;
        }

        .btr-home-mission-line {
          display: block;

          width: 35px;
          height: 2px;
          flex-shrink: 0;

          background: #78d84b;
        }

        /* ======================================
           WHAT WE DO
        ====================================== */

        .btr-home-services {
          background: #f4f7f6;
          padding: 100px 0 110px;
        }

        .btr-home-section-heading {
          margin-bottom: 50px;
        }

        .btr-home-section-heading h2 {
          margin: 18px 0 0;

          font-size: clamp(36px, 4vw, 54px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-home-service-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));

          gap: 30px;
        }

        /* ======================================
           SERVICE CARDS
        ====================================== */

        .btr-home-service {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          padding: 38px;

          background: #ffffff;

          border: 1px solid #e1e8e6;
          border-radius: 5px;

          text-decoration: none !important;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .btr-home-service:hover {
          border-color: #58b43d;
          transform: translateY(-3px);
        }

        .btr-home-service-index {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;

          color: #40973c;
        }

        .btr-home-service h3 {
          margin: 28px 0 16px;

          font-size: 29px;
          font-weight: 650;
          letter-spacing: -0.025em;

          color: #071e2e;
        }

        .btr-home-service p {
          max-width: 450px;
          margin: 0 0 35px;

          font-size: 17px;
          line-height: 1.75;

          color: #53636a;
        }

        .btr-home-service-link {
          margin-top: auto;

          font-size: 15px;
          font-weight: 650;

          color: #2d8c35;
        }

        /* ======================================
           WHY BTR
        ====================================== */

        .btr-home-why {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-home-why-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;

          gap: 100px;
          align-items: start;
        }

        .btr-home-why h2 {
          margin: 20px 0 30px;

          font-size: clamp(36px, 4vw, 54px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-home-text-link {
          color: #2d8c35 !important;

          font-size: 16px;
          font-weight: 650;

          text-decoration: none !important;
        }

        .btr-home-text-link:hover {
          text-decoration: underline !important;
        }

        /* Why BTR points */

        .btr-home-why-points > div {
          padding: 0 0 25px;
          margin-bottom: 25px;

          border-bottom: 1px solid #e0e7e6;
        }

        .btr-home-why-points > div:last-child {
          margin-bottom: 0;
        }

        .btr-home-why-points h3 {
          margin: 0 0 10px;

          font-size: 21px;
          font-weight: 650;

          color: #071e2e;
        }

        .btr-home-why-points p {
          margin: 0;

          font-size: 16px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           FINAL CTA
        ====================================== */

        .btr-home-cta {
          padding: 100px 0;

          background: #071e2e;
          text-align: center;
        }

        .btr-home-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-home-cta p {
          max-width: 560px;
          margin: 0 auto 32px;

          font-size: 18px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-home-cta .btr-home-button-primary {
          background: #67cb42;
          border-color: #67cb42;

          color: #071e2e !important;
        }

        .btr-home-cta .btr-home-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-home-why-layout {
            gap: 50px;
          }

          .btr-home-hero {
            padding: 95px 0 80px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-home-container {
            padding: 0 24px;
          }

          .btr-home-hero {
            padding: 85px 0 75px;

            background-position: 60% center;
          }

          .btr-home-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-home-hero-description {
            font-size: 17px;
          }

          .btr-home-actions {
            gap: 12px;
          }

          .btr-home-button-primary,
          .btr-home-button-secondary {
            padding: 14px 18px;
            gap: 15px;
          }

          .btr-home-mission {
            margin-top: 60px;
            align-items: flex-start;
          }

          .btr-home-mission-line {
            margin-top: 10px;
          }

          .btr-home-services,
          .btr-home-why {
            padding: 70px 0;
          }

          .btr-home-section-heading {
            margin-bottom: 35px;
          }

          .btr-home-service-grid,
          .btr-home-why-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .btr-home-service {
            padding: 28px;
          }

          .btr-home-service h3 {
            font-size: 25px;
          }

          .btr-home-why-layout {
            gap: 45px;
          }

          .btr-home-cta {
            padding: 75px 0;
          }

          .btr-home-cta p {
            font-size: 16px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {

          .btr-home-button-primary,
          .btr-home-button-secondary,
          .btr-home-service {
            transition: none;
          }

        }

        /* ======================================
        LARGER SECTION TYPOGRAPHY
        ====================================== */

        /* WHAT WE DO */

        .btr-home-service-index {
            font-size: 14px;
        }

        .btr-home-service h3 {
            font-size: 32px;
            line-height: 1.3;
        }

        .btr-home-service p {
            font-size: 20px;
            line-height: 1.65;
            max-width: 500px;
        }

        .btr-home-service-link {
            font-size: 18px;
        }

        /* THE BTR DIFFERENCE */

        .btr-home-why-points h3 {
            font-size: 26px;
            line-height: 1.35;
            margin-bottom: 12px;
        }

        .btr-home-why-points p {
            font-size: 20px;
            line-height: 1.65;
        }

        .btr-home-text-link {
            font-size: 18px;
        }

        /* MOBILE */

        @media (max-width: 700px) {
            .btr-home-service h3 {
                font-size: 27px;
            }

            .btr-home-service p {
                font-size: 18px;
            }

            .btr-home-service-link {
                font-size: 17px;
            }

            .btr-home-why-points h3 {
                font-size: 23px;
            }

            .btr-home-why-points p {
                font-size: 18px;
            }
        }

      `}</style>
    </>
  );
};

export default Home;
