
import React from "react";
import {
  Recycle,
  Layers3,
  RefreshCw,
  Leaf,
  Network,
  Factory,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

interface Specialty {
  title: string;
  blurb: string;
  icon: LucideIcon;
  number: string;
}

const items: Specialty[] = [
  {
    number: "01",
    title: "Post-Industrial Recycling",
    blurb:
      "We help manufacturers recycle and reprocess post-industrial plastics to reduce waste and improve recovery.",
    icon: Recycle,
  },
  {
    number: "02",
    title: "Recycled Resin Supply",
    blurb:
      "Consistent recycled and reprocessed polymer resins aligned to your specs, availability needs, and cost targets.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Closed-Loop Programs",
    blurb:
      "Turn your internal scrap into a repeatable loop—program design, routing, and market placement built around your operation.",
    icon: RefreshCw,
  },
  {
    number: "04",
    title: "Sustainable Sourcing",
    blurb:
      "Support sustainability initiatives with practical, performance-driven materials and transparent sourcing pathways.",
    icon: Leaf,
  },
  {
    number: "05",
    title: "Supply Chain Strength",
    blurb:
      "Diversify supply and reduce risk with market-driven material strategies across domestic and global networks.",
    icon: Network,
  },
  {
    number: "06",
    title: "Operational Fit",
    blurb:
      "Every program is built to integrate into real manufacturing environments—simple to run, scalable to grow.",
    icon: Factory,
  },
];

export default function SpecialtiesSection() {
  return (
    <section className="btr-specialties">
      <div className="btr-specialties-container">

        {/* Header */}
        <div className="btr-specialties-header">
          <div className="btr-specialties-eyebrow">
            WHAT WE DO
          </div>

          <h2>
            Built Around Your
            <span> Material Needs.</span>
          </h2>

          <p>
            From recycling and reprocessing to reliable resin
            supply, we build practical material solutions that
            help manufacturers operate more efficiently.
          </p>
        </div>

        {/* Cards */}
        <div className="btr-specialties-grid">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.number}
                className="btr-specialty-card"
              >
                <div className="btr-specialty-top">
                  <div className="btr-specialty-icon">
                    <Icon
                      size={28}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="btr-specialty-number">
                    {item.number}
                  </span>
                </div>

                <div className="btr-specialty-content">
                  <h3>{item.title}</h3>
                  <p>{item.blurb}</p>
                </div>

                <div className="btr-specialty-bottom">
                  <span className="btr-specialty-line" />
                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>
              </article>
            );
          })}
        </div>

      </div>

      <style>{`
        /* ======================================
           SECTION
        ====================================== */

        .btr-specialties {
          width: 100%;
          padding: 100px 24px 110px;
          background: #f5f8f7;
          box-sizing: border-box;
        }

        .btr-specialties *,
        .btr-specialties *::before,
        .btr-specialties *::after {
          box-sizing: border-box;
        }

        .btr-specialties-container {
          max-width: 1240px;
          margin: 0 auto;
        }

        /* ======================================
           HEADER
        ====================================== */

        .btr-specialties-header {
          max-width: 800px;
          margin: 0 auto 55px;
          text-align: center;
        }

        .btr-specialties-eyebrow {
          margin-bottom: 18px;

          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;

          color: #328e39;
        }

        .btr-specialties-header h2 {
          margin: 0;

          font-size: clamp(34px, 4vw, 52px);
          line-height: 1.13;
          font-weight: 700;
          letter-spacing: -0.035em;

          color: #071e2e;
        }

        .btr-specialties-header h2 span {
          color: #3e9c39;
        }

        .btr-specialties-header p {
          max-width: 700px;
          margin: 22px auto 0;

          font-size: 18px;
          line-height: 1.75;
          font-weight: 400;

          color: #53636a;
        }

        /* ======================================
           GRID
        ====================================== */

        .btr-specialties-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        /* ======================================
           CARDS
        ====================================== */

        .btr-specialty-card {
          position: relative;
          overflow: hidden;

          display: flex;
          flex-direction: column;

          min-height: 285px;
          padding: 30px;

          background: #ffffff;

          border: 1px solid #e1e8e6;
          border-radius: 12px;

          box-shadow: 0 5px 20px rgba(7, 30, 46, 0.025);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        /* Green accent at top */
        .btr-specialty-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 3px;

          background: #63c843;

          transform: scaleX(0);
          transform-origin: left;

          transition: transform 0.25s ease;
        }

        .btr-specialty-card:hover {
          transform: translateY(-5px);

          border-color: #cbded2;

          box-shadow: 0 18px 38px rgba(7, 30, 46, 0.09);
        }

        .btr-specialty-card:hover::before {
          transform: scaleX(1);
        }

        /* ======================================
           ICON / NUMBER
        ====================================== */

        .btr-specialty-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          margin-bottom: 26px;
        }

        .btr-specialty-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 58px;
          height: 58px;

          border-radius: 12px;

          background: #edf6ef;
          color: #248b3a;

          transition:
            background 0.25s ease,
            color 0.25s ease;
        }

        .btr-specialty-card:hover .btr-specialty-icon {
          background: #071e2e;
          color: #8de063;
        }

        .btr-specialty-number {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;

          color: #b4c0c3;
        }

        /* ======================================
           CARD CONTENT
        ====================================== */

        .btr-specialty-content {
          flex: 1;
        }

        .btr-specialty-content h3 {
          margin: 0 0 13px;

          font-size: 20px;
          line-height: 1.35;
          font-weight: 700;
          letter-spacing: -0.015em;

          color: #071e2e;
        }

        .btr-specialty-content p {
          margin: 0;

          font-size: 15.5px;
          line-height: 1.75;
          font-weight: 400;

          color: #53636a;
        }

        /* ======================================
           BOTTOM DECORATION
        ====================================== */

        .btr-specialty-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 28px;

          color: #9cb2a7;
        }

        .btr-specialty-line {
          display: block;

          width: 34px;
          height: 2px;

          background: #c5d6cc;

          transition:
            width 0.25s ease,
            background 0.25s ease;
        }

        .btr-specialty-card:hover .btr-specialty-line {
          width: 60px;
          background: #63c843;
        }

        .btr-specialty-card:hover .btr-specialty-bottom {
          color: #248b3a;
        }

        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 980px) {
          .btr-specialties {
            padding: 75px 24px;
          }

          .btr-specialties-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .btr-specialty-card {
            min-height: 270px;
          }
        }

        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 640px) {
          .btr-specialties {
            padding: 60px 20px 70px;
          }

          .btr-specialties-header {
            margin-bottom: 35px;
          }

          .btr-specialties-header h2 {
            font-size: 34px;
          }

          .btr-specialties-header p {
            font-size: 16px;
          }

          .btr-specialties-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .btr-specialty-card {
            min-height: unset;
            padding: 25px;
          }

          .btr-specialty-top {
            margin-bottom: 20px;
          }

          .btr-specialty-bottom {
            margin-top: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .btr-specialty-card,
          .btr-specialty-card::before,
          .btr-specialty-icon,
          .btr-specialty-line {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
