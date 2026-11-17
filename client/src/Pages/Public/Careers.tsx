
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

const openings = [
  {
    title: "Account Manager",
    location: "Akron, OH",
    type: "Full-time",
    href: "/careers/account-manager",
  },
  {
    title: "Forklift Driver",
    location: "Akron, OH",
    type: "Full-time",
    href: "/careers/forklift-driver",
  }
];

const values = [
  {
    number: "01",
    title: "Take Ownership",
    description:
      "We trust people to make decisions, solve problems, and take responsibility for results.",
  },
  {
    number: "02",
    title: "Pursue Excellence",
    description:
      "We care about the details, hold ourselves to high standards, and constantly look for ways to improve.",
  },
  {
    number: "03",
    title: "Make an Impact",
    description:
      "We're building a growing business where your work matters and your contributions are visible.",
  },
];

const benefits = [
  {
    title: "Competitive Compensation",
    description:
      "Market-aligned pay with opportunities to grow as the business grows.",
  },
  {
    title: "Health Benefits",
    description:
      "Medical, dental, and vision options for eligible employees.",
  },
  {
    title: "Paid Time Off",
    description:
      "Time away from work to recharge and take care of what matters.",
  },
  {
    title: "Flexible Work",
    description:
      "Remote or flexible arrangements where the role allows.",
  },
];

export default function Careers() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <main className="btr-careers">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="btr-careers-hero">
          <div className="btr-careers-container">

            <span className="btr-careers-eyebrow">
              CAREERS AT BTR POLYMERS
            </span>

            <h1>
              Build Something.
              <br />
              <span>Make an Impact.</span>
            </h1>

            <p>
              We're building a company for people who
              take ownership, solve problems, and
              aren't afraid to roll up their sleeves.
            </p>

            <a
              href="#openings"
              className="btr-careers-button-primary"
            >
              View Open Positions <span>↗</span>
            </a>

          </div>
        </section>

        {/* ======================================
            WHY BTR
        ====================================== */}

        <section className="btr-careers-why">
          <div className="btr-careers-container">

            <div className="btr-careers-section-heading">
              <span className="btr-careers-eyebrow">
                WHY BTR POLYMERS
              </span>

              <h2>
                Big ambition.
                <br />
                Small-team mentality.
              </h2>

              <p>
                We're growing a business from the ground up.
                That means meaningful work, real responsibility,
                and opportunities to help shape what comes next.
              </p>
            </div>

            <div className="btr-careers-values-grid">
              {values.map((value) => (
                <div
                  className="btr-careers-value"
                  key={value.number}
                >
                  <span className="btr-careers-value-number">
                    {value.number}
                  </span>

                  <h3>{value.title}</h3>

                  <p>{value.description}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            OPEN POSITIONS
        ====================================== */}

        <section
          className="btr-careers-openings"
          id="openings"
        >
          <div className="btr-careers-container">

            <div className="btr-careers-section-heading">
              <span className="btr-careers-eyebrow">
                JOIN THE TEAM
              </span>

              <h2>Open positions.</h2>

              <p>
                Find an opportunity to grow your career
                while helping us build the future of BTR.
              </p>
            </div>

            <div className="btr-careers-jobs">
              {openings.map((job) => (
                <Link
                  to={job.href}
                  className="btr-careers-job"
                  key={job.href}
                >
                  <div className="btr-careers-job-info">

                    <h3>{job.title}</h3>

                    <p>
                      {job.location}
                      <span className="btr-careers-job-dot">
                        •
                      </span>
                      {job.type}
                    </p>

                  </div>

                  <span
                    className="btr-careers-job-arrow"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            BENEFITS
        ====================================== */}

        <section className="btr-careers-benefits">
          <div className="btr-careers-container">

            <div className="btr-careers-section-heading">
              <span className="btr-careers-eyebrow">
                WORKING AT BTR
              </span>

              <h2>
                We invest
                <br />
                in our people.
              </h2>
            </div>

            <div className="btr-careers-benefits-grid">
              {benefits.map((benefit) => (
                <div
                  className="btr-careers-benefit"
                  key={benefit.title}
                >
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>

            <p className="btr-careers-benefits-note">
              Benefits and work arrangements vary by
              position and eligibility.
            </p>

          </div>
        </section>

        {/* ======================================
            FINAL CTA
        ====================================== */}

        <section className="btr-careers-cta">
          <div className="btr-careers-container">

            <h2>Don't see the right role?</h2>

            <p>
              We're always interested in meeting
              talented people who share our ambition.
              Reach out and introduce yourself.
            </p>

            <Link
              to="/contact"
              className="btr-careers-button-primary"
            >
              Get in Touch <span>↗</span>
            </Link>

          </div>
        </section>

      </main>

      <Footer />

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-careers {
          width: 100%;
          color: #071e2e;
          font-family: inherit;
        }

        .btr-careers *,
        .btr-careers *::before,
        .btr-careers *::after {
          box-sizing: border-box;
        }

        .btr-careers-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-careers-eyebrow {
          display: block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #348e38;
        }

        /* ======================================
           BUTTON
        ====================================== */

        .btr-careers-button-primary {
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

        .btr-careers-button-primary:hover {
          background: #17405a;
          border-color: #17405a;
        }

        /* ======================================
           HERO
        ====================================== */

        .btr-careers-hero {
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
            url("/images/team-work.jpg");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 125px 0 115px;
        }

        .btr-careers-hero .btr-careers-container {
          position: relative;
          z-index: 1;
        }

        .btr-careers-hero .btr-careers-eyebrow {
          color: #86df58;
        }

        .btr-careers-hero h1 {
          max-width: 1050px;
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-careers-hero h1 span {
          color: #78d84b;
        }

        .btr-careers-hero p {
          max-width: 700px;
          margin: 0 0 38px;

          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        .btr-careers-hero .btr-careers-button-primary {
          background: #72d348;
          border-color: #72d348;
          color: #071e2e !important;
        }

        .btr-careers-hero .btr-careers-button-primary:hover {
          background: #8ae566;
          border-color: #8ae566;
        }

        /* ======================================
           SECTION HEADINGS
        ====================================== */

        .btr-careers-section-heading {
          margin-bottom: 55px;
        }

        .btr-careers-section-heading h2 {
          margin: 20px 0;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-careers-section-heading > p {
          max-width: 760px;
          margin: 0;

          font-size: 21px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           WHY BTR
        ====================================== */

        .btr-careers-why {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-careers-values-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 45px;
        }

        .btr-careers-value {
          padding-top: 24px;
          border-top: 3px solid #5bb83c;
        }

        .btr-careers-value-number {
          display: block;
          margin-bottom: 25px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;

          color: #40973c;
        }

        .btr-careers-value h3 {
          margin: 0 0 15px;

          font-size: 29px;
          line-height: 1.3;
          font-weight: 650;
          letter-spacing: -0.02em;

          color: #071e2e;
        }

        .btr-careers-value p {
          margin: 0;

          font-size: 19px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           OPEN POSITIONS
        ====================================== */

        .btr-careers-openings {
          padding: 110px 0;
          background: #f4f7f6;
          scroll-margin-top: 80px;
        }

        .btr-careers-jobs {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .btr-careers-job {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 30px;
          padding: 30px 35px;

          background: #ffffff;
          border: 1px solid #e1e8e6;
          border-radius: 5px;

          text-decoration: none !important;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .btr-careers-job:hover {
          border-color: #5bb83c;
          transform: translateY(-2px);
        }

        .btr-careers-job-info {
          min-width: 0;
        }

        .btr-careers-job h3 {
          margin: 0 0 10px;

          font-size: 27px;
          line-height: 1.3;
          font-weight: 650;

          color: #071e2e;
        }

        .btr-careers-job p {
          margin: 0;

          font-size: 17px;
          line-height: 1.5;

          color: #53636a;
        }

        .btr-careers-job-dot {
          margin: 0 10px;
          color: #93a29f;
        }

        .btr-careers-job-arrow {
          flex-shrink: 0;

          font-size: 30px;
          font-weight: 500;

          color: #348e38;
        }

        /* ======================================
           BENEFITS
        ====================================== */

        .btr-careers-benefits {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-careers-benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 70px;
        }

        .btr-careers-benefit {
          padding: 28px 0;
          border-top: 1px solid #dce5e1;
        }

        .btr-careers-benefit h3 {
          margin: 0 0 12px;

          font-size: 26px;
          line-height: 1.3;
          font-weight: 650;

          color: #071e2e;
        }

        .btr-careers-benefit p {
          max-width: 500px;
          margin: 0;

          font-size: 19px;
          line-height: 1.7;

          color: #53636a;
        }

        .btr-careers-benefits-note {
          margin: 30px 0 0;

          font-size: 15px;
          line-height: 1.6;

          color: #74828a;
        }

        /* ======================================
           FINAL CTA
        ====================================== */

        .btr-careers-cta {
          padding: 100px 0;
          background: #071e2e;
          text-align: center;
        }

        .btr-careers-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-careers-cta p {
          max-width: 620px;
          margin: 0 auto 32px;

          font-size: 20px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-careers-cta .btr-careers-button-primary {
          background: #67cb42;
          border-color: #67cb42;
          color: #071e2e !important;
        }

        .btr-careers-cta .btr-careers-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-careers-hero {
            padding: 95px 0 85px;
          }

          .btr-careers-values-grid {
            gap: 25px;
          }

          .btr-careers-benefits-grid {
            gap: 0 35px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-careers-container {
            padding: 0 24px;
          }

          .btr-careers-hero {
            padding: 85px 0 75px;
            background-position: 60% center;
          }

          .btr-careers-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-careers-hero p {
            font-size: 18px;
          }

          .btr-careers-why,
          .btr-careers-openings,
          .btr-careers-benefits {
            padding: 70px 0;
          }

          .btr-careers-section-heading {
            margin-bottom: 35px;
          }

          .btr-careers-section-heading > p {
            font-size: 18px;
          }

          .btr-careers-values-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .btr-careers-value h3 {
            font-size: 26px;
          }

          .btr-careers-value p {
            font-size: 18px;
          }

          .btr-careers-job {
            padding: 24px 20px;
            gap: 15px;
          }

          .btr-careers-job h3 {
            font-size: 23px;
          }

          .btr-careers-job p {
            font-size: 15px;
          }

          .btr-careers-job-arrow {
            font-size: 25px;
          }

          .btr-careers-benefits-grid {
            grid-template-columns: 1fr;
          }

          .btr-careers-benefit h3 {
            font-size: 24px;
          }

          .btr-careers-benefit p {
            font-size: 18px;
          }

          .btr-careers-cta {
            padding: 75px 0;
          }

          .btr-careers-cta p {
            font-size: 18px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-careers-button-primary,
          .btr-careers-job {
            transition: none;
            transform: none;
          }
        }

      `}</style>
    </>
  );
}
