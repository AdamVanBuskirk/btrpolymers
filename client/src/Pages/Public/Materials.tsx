
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

const polymers = [
  { code: "PP", name: "Polypropylene" },
  { code: "PE", name: "Polyethylene" },
  { code: "PS", name: "Polystyrene" },
  { code: "PET", name: "Polyethylene Terephthalate" },
  { code: "PVC", name: "Polyvinyl Chloride" },
  { code: "TPO", name: "Thermoplastic Polyolefins" },
  { code: "ABS", name: "Acrylonitrile Butadiene Styrene" },
  { code: "PA", name: "Polyamides" },
  { code: "+", name: "Specialty & Engineering Polymers" },
];

const materialStreams = [
  "Wide-spec materials",
  "Off-spec & transitional production",
  "Reprocessed resins",
  "Regrinds",
  "Post-industrial & post-commercial feedstocks",
  "Custom blends & application-specific materials",
];

const advantages = [
  {
    number: "01",
    title: "Material Fit",
    description:
      "We source around your processing requirements, performance needs, and commercial objectives.",
  },
  {
    number: "02",
    title: "Market Access",
    description:
      "Our supplier and customer network connects material opportunities with real manufacturing demand.",
  },
  {
    number: "03",
    title: "Reliable Execution",
    description:
      "Responsive communication, coordinated logistics, and practical solutions that keep material moving.",
  },
];

export default function Materials() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <main className="btr-materials">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="btr-materials-hero">
          <div className="btr-materials-container">

            <span className="btr-materials-eyebrow">
              OUR MATERIALS
            </span>

            <h1>
              Recycled Polymers.
              <br />
              <span>Real Possibilities.</span>
            </h1>

            <p>
              Reliable, cost-effective recycled polymer
              feedstocks sourced to meet your manufacturing
              requirements.
            </p>

            <Link
              to="/contact"
              className="btr-materials-button-primary"
            >
              Request Materials <span>↗</span>
            </Link>

          </div>
        </section>

        {/* ======================================
            POLYMER FAMILIES
        ====================================== */}

        <section className="btr-materials-polymers">
          <div className="btr-materials-container">

            <div className="btr-materials-section-heading">
              <span className="btr-materials-eyebrow">
                POLYMER FAMILIES
              </span>

              <h2>
                The materials
                <br />
                manufacturers rely on.
              </h2>

              <p>
                From commodity resins to engineering polymers,
                we source and supply materials across a broad
                range of resin families.
              </p>
            </div>

            <div className="btr-materials-polymer-grid">
              {polymers.map((polymer) => (
                <div
                  className="btr-materials-polymer"
                  key={polymer.code}
                >
                  <span className="btr-materials-polymer-code">
                    {polymer.code}
                  </span>

                  <span className="btr-materials-polymer-name">
                    {polymer.name}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            MATERIAL STREAMS
        ====================================== */}

        <section className="btr-materials-streams">
          <div className="btr-materials-container btr-materials-two-col">

            <div className="btr-materials-streams-intro">
              <span className="btr-materials-eyebrow">
                MATERIAL STREAMS
              </span>

              <h2>
                More than
                <br />
                a resin catalog.
              </h2>

              <p>
                Every material stream is different. We work
                across a wide range of specifications, forms,
                and production sources to connect supply
                with demand.
              </p>
            </div>

            <div className="btr-materials-stream-list">
              {materialStreams.map((stream, index) => (
                <div
                  className="btr-materials-stream"
                  key={stream}
                >
                  <span className="btr-materials-stream-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="btr-materials-stream-name">
                    {stream}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            OUR APPROACH
        ====================================== */}

        <section className="btr-materials-approach">
          <div className="btr-materials-container">

            <div className="btr-materials-section-heading">
              <span className="btr-materials-eyebrow">
                THE BTR APPROACH
              </span>

              <h2>
                The right material.
                <br />
                The right opportunity.
              </h2>

              <p>
                We combine market knowledge, hands-on sourcing,
                and logistical expertise to deliver material
                solutions that make business sense.
              </p>
            </div>

            <div className="btr-materials-advantages">
              {advantages.map((advantage) => (
                <div
                  className="btr-materials-advantage"
                  key={advantage.number}
                >
                  <span className="btr-materials-advantage-number">
                    {advantage.number}
                  </span>

                  <h3>{advantage.title}</h3>

                  <p>{advantage.description}</p>
                </div>
              ))}
            </div>

            <div className="btr-materials-approach-footer">
              <p>
                Whether you're looking for a recycled
                alternative to prime resin or have a
                material stream to sell, we're ready
                to help.
              </p>

              <Link
                to="/solutions"
                className="btr-materials-text-link"
              >
                Explore Our Recycling Solutions ↗
              </Link>
            </div>

          </div>
        </section>

        {/* ======================================
            CONTACT CTA
        ====================================== */}

        <section className="btr-materials-cta">
          <div className="btr-materials-container">

            <h2>Let's talk materials.</h2>

            <p>
              Have a specific resin, specification, or
              material stream in mind? Tell us what you
              need or what you have.
            </p>

            <Link
              to="/contact"
              className="btr-materials-button-primary"
            >
              Contact BTR <span>↗</span>
            </Link>

          </div>
        </section>

      </main>

      <Footer />

      {/* ======================================
          ALL MATERIALS PAGE STYLES
      ====================================== */}

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-materials {
          width: 100%;
          color: #071e2e;
          font-family: inherit;
        }

        .btr-materials *,
        .btr-materials *::before,
        .btr-materials *::after {
          box-sizing: border-box;
        }

        .btr-materials-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-materials-eyebrow {
          display: block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #348e38;
        }

        /* ======================================
           BUTTONS
        ====================================== */

        .btr-materials-button-primary {
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

        .btr-materials-button-primary:hover {
          background: #17405a;
          border-color: #17405a;
        }

        /* ======================================
           HERO
        ====================================== */

        .btr-materials-hero {
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
            url("/images/materials-photo.jpg");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 125px 0 115px;
        }

        .btr-materials-hero .btr-materials-container {
          position: relative;
          z-index: 1;
        }

        .btr-materials-hero .btr-materials-eyebrow {
          color: #86df58;
        }

        .btr-materials-hero h1 {
          max-width: 1050px;
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-materials-hero h1 span {
          color: #78d84b;
        }

        .btr-materials-hero p {
          max-width: 700px;
          margin: 0 0 38px;

          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        .btr-materials-hero .btr-materials-button-primary {
          background: #72d348;
          border-color: #72d348;
          color: #071e2e !important;
        }

        .btr-materials-hero .btr-materials-button-primary:hover {
          background: #8ae566;
          border-color: #8ae566;
        }

        /* ======================================
           SECTION HEADINGS
        ====================================== */

        .btr-materials-section-heading {
          margin-bottom: 55px;
        }

        .btr-materials-section-heading h2,
        .btr-materials-streams h2 {
          margin: 20px 0;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-materials-section-heading > p,
        .btr-materials-streams-intro > p {
          max-width: 720px;
          margin: 0;

          font-size: 21px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           POLYMER FAMILIES
        ====================================== */

        .btr-materials-polymers {
          padding: 110px 0 115px;
          background: #ffffff;
        }

        .btr-materials-polymer-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .btr-materials-polymer {
          display: flex;
          flex-direction: column;
          justify-content: center;

          min-height: 155px;
          padding: 28px 30px;

          background: #f4f7f6;
          border: 1px solid #e1e8e6;
          border-radius: 5px;
        }

        .btr-materials-polymer-code {
          display: block;

          margin-bottom: 10px;

          font-size: 34px;
          line-height: 1.1;
          font-weight: 750;
          letter-spacing: -0.035em;

          color: #348e38;
        }

        .btr-materials-polymer-name {
          display: block;

          font-size: 18px;
          line-height: 1.5;
          font-weight: 550;

          color: #071e2e;
        }

        /* ======================================
           MATERIAL STREAMS
        ====================================== */

        .btr-materials-streams {
          padding: 110px 0;
          background: #f4f7f6;
        }

        .btr-materials-two-col {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
          align-items: start;
        }

        .btr-materials-streams h2 {
          margin-bottom: 24px;
        }

        .btr-materials-stream-list {
          min-width: 0;
        }

        .btr-materials-stream {
          display: flex;
          align-items: flex-start;

          gap: 22px;
          padding: 22px 0;

          border-top: 1px solid #d6e0dc;
        }

        .btr-materials-stream-number {
          flex-shrink: 0;
          padding-top: 5px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;

          color: #40973c;
        }

        .btr-materials-stream-name {
          font-size: 21px;
          line-height: 1.45;
          font-weight: 600;

          color: #071e2e;
        }

        /* ======================================
           OUR APPROACH
        ====================================== */

        .btr-materials-approach {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-materials-advantages {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 45px;
        }

        .btr-materials-advantage {
          padding-top: 24px;
          border-top: 3px solid #5bb83c;
        }

        .btr-materials-advantage-number {
          display: block;
          margin-bottom: 25px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;

          color: #40973c;
        }

        .btr-materials-advantage h3 {
          margin: 0 0 15px;

          font-size: 29px;
          line-height: 1.3;
          font-weight: 650;
          letter-spacing: -0.02em;

          color: #071e2e;
        }

        .btr-materials-advantage p {
          margin: 0;

          font-size: 19px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           APPROACH FOOTER
        ====================================== */

        .btr-materials-approach-footer {
          margin-top: 65px;
          padding-top: 28px;

          border-top: 1px solid #e0e7e6;
        }

        .btr-materials-approach-footer p {
          max-width: 850px;
          margin: 0 0 20px;

          font-size: 20px;
          line-height: 1.7;

          color: #53636a;
        }

        .btr-materials-text-link {
          display: inline-block;

          font-size: 18px;
          font-weight: 650;

          color: #2d8c35 !important;
          text-decoration: none !important;
        }

        .btr-materials-text-link:hover {
          text-decoration: underline !important;
        }

        /* ======================================
           CONTACT CTA
        ====================================== */

        .btr-materials-cta {
          padding: 100px 0;
          background: #071e2e;
          text-align: center;
        }

        .btr-materials-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-materials-cta p {
          max-width: 620px;
          margin: 0 auto 32px;

          font-size: 20px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-materials-cta .btr-materials-button-primary {
          background: #67cb42;
          border-color: #67cb42;
          color: #071e2e !important;
        }

        .btr-materials-cta .btr-materials-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-materials-hero {
            padding: 95px 0 85px;
          }

          .btr-materials-two-col {
            gap: 45px;
          }

          .btr-materials-polymer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .btr-materials-advantages {
            gap: 25px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-materials-container {
            padding: 0 24px;
          }

          .btr-materials-hero {
            padding: 85px 0 75px;
            background-position: 60% center;
          }

          .btr-materials-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-materials-hero p {
            font-size: 18px;
          }

          .btr-materials-polymers,
          .btr-materials-streams,
          .btr-materials-approach {
            padding: 70px 0;
          }

          .btr-materials-section-heading {
            margin-bottom: 35px;
          }

          .btr-materials-section-heading > p,
          .btr-materials-streams-intro > p {
            font-size: 18px;
          }

          .btr-materials-polymer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .btr-materials-polymer {
            min-height: 130px;
            padding: 20px;
          }

          .btr-materials-polymer-code {
            font-size: 28px;
          }

          .btr-materials-polymer-name {
            font-size: 16px;
          }

          .btr-materials-two-col {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .btr-materials-stream {
            padding: 20px 0;
          }

          .btr-materials-stream-name {
            font-size: 19px;
          }

          .btr-materials-advantages {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .btr-materials-advantage h3 {
            font-size: 26px;
          }

          .btr-materials-advantage p {
            font-size: 18px;
          }

          .btr-materials-approach-footer {
            margin-top: 45px;
          }

          .btr-materials-approach-footer p {
            font-size: 18px;
          }

          .btr-materials-cta {
            padding: 75px 0;
          }

          .btr-materials-cta p {
            font-size: 18px;
          }

        }

        /* ======================================
           SMALL MOBILE
        ====================================== */

        @media (max-width: 420px) {

          .btr-materials-polymer-grid {
            grid-template-columns: 1fr;
          }

          .btr-materials-polymer {
            min-height: 110px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-materials-button-primary {
            transition: none;
          }
        }

      `}</style>
    </>
  );
}
