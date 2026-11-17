
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../../Components/Navigation";
import Footer from "../../Components/Footer";

type TeamMember = {
  name: string;
  title: string;
  image?: string;
  linkedin?: string;
};

const team: TeamMember[] = [
  {
    name: "Adam VanBuskirk",
    title: "President",
    image: "/images/team/BTR_Adam_Headshot.png",
    linkedin:
      "https://www.linkedin.com/in/adam-vanbuskirk-28b93136/",
  },
  {
    name: "Jack Bartosic",
    title: "Chief Revenue Officer",
    image: "/images/team/BTR_Jack_Headshot.png",
    linkedin:
      "https://www.linkedin.com/in/jack-bartosic-939497215/",
  },
  {
    name: "Kim Holz",
    title: "Customer Service Manager",
    image: "/images/team/BTR_Kim_Headshot.png",
  },
  {
    name: "Mike Murphy",
    title: "Operations Manager",
    image: "/images/team/BTR_Mike_Headshot.png",
  },
  {
    name: "Cristina Pascual",
    title: "Business Development Representative",
    image: "/images/team/BTR_Cristina_Headshot.png",
  },
  {
    name: "Warehouse Team",
    title: "Material Handlers",
  },
];

const values = [
  {
    number: "01",
    title: "Reliability",
    description:
      "We do what we say we'll do and take our commitments seriously.",
  },
  {
    number: "02",
    title: "Transparency",
    description:
      "We believe strong partnerships are built on honest communication and accountability.",
  },
  {
    number: "03",
    title: "Long-Term Thinking",
    description:
      "We're building a business designed to create lasting value for customers, suppliers, and our team.",
  },
];

function TeamAvatar({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="btr-about-team-photo">
      {image && !imageFailed ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          width="55%"
          height="55%"
          fill="none"
          role="img"
          aria-label={`${name} avatar placeholder`}
        >
          <circle cx="50" cy="34" r="17" fill="#8aa0a8" />
          <path
            d="M17 85c0-20 14-32 33-32s33 12 33 32"
            fill="#8aa0a8"
          />
        </svg>
      )}
    </div>
  );
}

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />

      <main className="btr-about">

        {/* ======================================
            HERO
        ====================================== */}

        <section className="btr-about-hero">
          <div className="btr-about-container">

            <span className="btr-about-eyebrow">
              ABOUT BTR POLYMERS
            </span>

            <h1>
              Built to Last.
              <br />
              <span>Driven to Grow.</span>
            </h1>

            <p>
              We're building a better way to recycle
              industrial plastics through strong
              partnerships, practical solutions,
              and relentless execution.
            </p>

          </div>
        </section>

        {/* ======================================
            OUR STORY
        ====================================== */}

        <section className="btr-about-story">
          <div className="btr-about-container btr-about-story-grid">

            <div>
              <span className="btr-about-eyebrow">
                OUR STORY
              </span>

              <h2>
                Built on experience.
                <br />
                Focused on the future.
              </h2>
            </div>

            <div className="btr-about-story-copy">

              <p>
                Founded in 2011, Burdette Thomas Company
                began as a consumer goods business and
                grew into a national distribution operation.
              </p>

              <p>
                That experience in sourcing, logistics,
                and supply chains led us into the recycled
                polymer industry, where we saw an opportunity
                to build something bigger.
              </p>

              <p>
                Today, as BTR Polymers, we're investing
                in people, infrastructure, and technology
                to help manufacturers recover more value
                from plastic scrap and bring recycled
                materials back into productive use.
              </p>

            </div>

          </div>
        </section>

        {/* ======================================
            MISSION
        ====================================== */}

        <section className="btr-about-mission">
          <div className="btr-about-container">

            <span className="btr-about-eyebrow">
              OUR MISSION
            </span>

            <h2>
              3 Billion Pounds.
              <br />
              <span>One Mission.</span>
            </h2>

            <p>
              We're on a mission to recycle 3 billion
              pounds of post-industrial plastic scrap
              by the end of 2036.
            </p>

            <div className="btr-about-mission-line" />

          </div>
        </section>

        {/* ======================================
            WHAT WE BELIEVE
        ====================================== */}

        <section className="btr-about-values">
          <div className="btr-about-container">

            <div className="btr-about-section-heading">
              <span className="btr-about-eyebrow">
                WHAT WE BELIEVE
              </span>

              <h2>
                The way we do business
                <br />
                matters.
              </h2>
            </div>

            <div className="btr-about-values-grid">
              {values.map((value) => (
                <div
                  className="btr-about-value"
                  key={value.number}
                >
                  <span className="btr-about-value-number">
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
            OUR TEAM
        ====================================== */}

        <section className="btr-about-team">
          <div className="btr-about-container">

            <div className="btr-about-section-heading">
              <span className="btr-about-eyebrow">
                THE PEOPLE BEHIND BTR
              </span>

              <h2>Meet our team.</h2>

              <p>
                A hands-on team committed to solving
                problems, serving customers, and
                building something that lasts.
              </p>
            </div>

            <div className="btr-about-team-grid">
              {team.map((person) => (
                <div
                  className="btr-about-team-member"
                  key={person.name}
                >
                  <TeamAvatar
                    name={person.name}
                    image={person.image}
                  />

                  <h3>{person.name}</h3>
                  <p>{person.title}</p>

                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btr-about-linkedin"
                      aria-label={`View ${person.name} on LinkedIn`}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ======================================
            CONTACT CTA
        ====================================== */}

        <section className="btr-about-cta">
          <div className="btr-about-container">

            <h2>Let's build something.</h2>

            <p>
              Looking for a recycling partner or a
              reliable source of recycled polymers?
              We'd love to talk.
            </p>

            <Link
              to="/contact"
              className="btr-about-button-primary"
            >
              Contact BTR <span>↗</span>
            </Link>

          </div>
        </section>

      </main>

      <Footer />

      {/* ======================================
          ALL ABOUT PAGE STYLES
      ====================================== */}

      <style>{`

        /* ======================================
           BASE
        ====================================== */

        .btr-about {
          width: 100%;
          color: #071e2e;
          font-family: inherit;
        }

        .btr-about *,
        .btr-about *::before,
        .btr-about *::after {
          box-sizing: border-box;
        }

        .btr-about-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .btr-about-eyebrow {
          display: block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #348e38;
        }

        /* ======================================
           BUTTON
        ====================================== */

        .btr-about-button-primary {
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

        .btr-about-button-primary:hover {
          background: #17405a;
          border-color: #17405a;
        }

        /* ======================================
           HERO
        ====================================== */

        .btr-about-hero {
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
            url("/images/group-photo-us.png");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          padding: 125px 0 115px;
        }

        .btr-about-hero .btr-about-container {
          position: relative;
          z-index: 1;
        }

        .btr-about-hero .btr-about-eyebrow {
          color: #86df58;
        }

        .btr-about-hero h1 {
          max-width: 1050px;
          margin: 25px 0 28px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-about-hero h1 span {
          color: #78d84b;
        }

        .btr-about-hero p {
          max-width: 700px;
          margin: 0;

          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.7;

          color: #e0e8eb;
        }

        /* ======================================
           OUR STORY
        ====================================== */

        .btr-about-story {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: start;
        }

        .btr-about-story h2 {
          margin: 20px 0 0;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-about-story-copy p {
          margin: 0 0 24px;

          font-size: 20px;
          line-height: 1.75;

          color: #53636a;
        }

        .btr-about-story-copy p:last-child {
          margin-bottom: 0;
        }

        /* ======================================
           MISSION
        ====================================== */

        .btr-about-mission {
          padding: 110px 0;
          background: #071e2e;
        }

        .btr-about-mission .btr-about-eyebrow {
          color: #86df58;
        }

        .btr-about-mission h2 {
          margin: 25px 0 25px;

          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.08;
          font-weight: 750;
          letter-spacing: -0.055em;

          color: #ffffff;
        }

        .btr-about-mission h2 span {
          color: #78d84b;
        }

        .btr-about-mission p {
          max-width: 760px;
          margin: 0;

          font-size: 22px;
          line-height: 1.7;

          color: #d1dde1;
        }

        .btr-about-mission-line {
          width: 75px;
          height: 3px;
          margin-top: 45px;
          background: #78d84b;
        }

        /* ======================================
           VALUES
        ====================================== */

        .btr-about-values {
          padding: 110px 0;
          background: #ffffff;
        }

        .btr-about-section-heading {
          margin-bottom: 55px;
        }

        .btr-about-section-heading h2 {
          margin: 20px 0;

          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-about-section-heading > p {
          max-width: 700px;
          margin: 0;

          font-size: 20px;
          line-height: 1.7;

          color: #53636a;
        }

        .btr-about-values-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 45px;
        }

        .btr-about-value {
          padding-top: 24px;
          border-top: 3px solid #5bb83c;
        }

        .btr-about-value-number {
          display: block;
          margin-bottom: 25px;

          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;

          color: #40973c;
        }

        .btr-about-value h3 {
          margin: 0 0 15px;

          font-size: 29px;
          line-height: 1.3;
          font-weight: 650;

          color: #071e2e;
        }

        .btr-about-value p {
          margin: 0;

          font-size: 19px;
          line-height: 1.7;

          color: #53636a;
        }

        /* ======================================
           TEAM
        ====================================== */

        .btr-about-team {
          padding: 110px 0 115px;
          background: #f4f7f6;
        }

        .btr-about-team-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 55px 40px;
        }

        .btr-about-team-member {
          min-width: 0;
        }

        .btr-about-team-photo {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          aspect-ratio: 1 / 1;

          overflow: hidden;
          background: #e1e9e7;

          border-radius: 5px;
        }

        .btr-about-team-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btr-about-team-member h3 {
          margin: 22px 0 7px;

          font-size: 25px;
          line-height: 1.3;
          font-weight: 650;
          letter-spacing: -0.02em;

          color: #071e2e;
        }

        .btr-about-team-member > p {
          margin: 0;

          font-size: 18px;
          line-height: 1.5;

          color: #53636a;
        }

        .btr-about-linkedin {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-top: 14px;

          font-size: 16px;
          font-weight: 600;

          color: #2d8c35 !important;
          text-decoration: none !important;
        }

        .btr-about-linkedin:hover {
          text-decoration: underline !important;
        }

        /* ======================================
           CONTACT CTA
        ====================================== */

        .btr-about-cta {
          padding: 100px 0;
          background: #071e2e;
          text-align: center;
        }

        .btr-about-cta h2 {
          margin: 0 0 20px;

          font-size: clamp(40px, 5vw, 62px);
          line-height: 1.15;
          font-weight: 650;
          letter-spacing: -0.035em;

          color: #ffffff;
        }

        .btr-about-cta p {
          max-width: 620px;
          margin: 0 auto 32px;

          font-size: 20px;
          line-height: 1.7;

          color: #c2cdd3;
        }

        .btr-about-cta .btr-about-button-primary {
          background: #67cb42;
          border-color: #67cb42;
          color: #071e2e !important;
        }

        .btr-about-cta .btr-about-button-primary:hover {
          background: #85dd62;
          border-color: #85dd62;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 900px) {

          .btr-about-hero {
            padding: 95px 0 85px;
          }

          .btr-about-story-grid {
            gap: 45px;
          }

          .btr-about-values-grid {
            gap: 25px;
          }

          .btr-about-team-grid {
            gap: 40px 25px;
          }

        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 700px) {

          .btr-about-container {
            padding: 0 24px;
          }

          .btr-about-hero {
            padding: 85px 0 75px;
            background-position: 60% center;
          }

          .btr-about-hero h1 {
            font-size: clamp(42px, 10vw, 58px);
          }

          .btr-about-hero p {
            font-size: 18px;
          }

          .btr-about-story,
          .btr-about-mission,
          .btr-about-values,
          .btr-about-team {
            padding: 70px 0;
          }

          .btr-about-story-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .btr-about-story-copy p {
            font-size: 18px;
          }

          .btr-about-mission h2 {
            font-size: clamp(44px, 10vw, 62px);
          }

          .btr-about-mission p {
            font-size: 19px;
          }

          .btr-about-section-heading {
            margin-bottom: 35px;
          }

          .btr-about-section-heading > p {
            font-size: 18px;
          }

          .btr-about-values-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .btr-about-value h3 {
            font-size: 26px;
          }

          .btr-about-value p {
            font-size: 18px;
          }

          .btr-about-team-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 35px 18px;
          }

          .btr-about-team-member h3 {
            font-size: 21px;
            margin-top: 16px;
          }

          .btr-about-team-member > p {
            font-size: 16px;
          }

          .btr-about-linkedin {
            font-size: 15px;
          }

          .btr-about-cta {
            padding: 75px 0;
          }

          .btr-about-cta p {
            font-size: 18px;
          }

        }

        /* ======================================
           SMALL MOBILE
        ====================================== */

        @media (max-width: 420px) {

          .btr-about-team-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

        }

        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media (prefers-reduced-motion: reduce) {
          .btr-about-button-primary {
            transition: none;
          }
        }

      `}</style>
    </>
  );
}
