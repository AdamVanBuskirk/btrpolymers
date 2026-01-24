// BTRSpecialtiesSection.tsx
import React from "react";
import { useIsMobile } from "../Core/hooks";

const items = [
  {
    title: "Post-Industrial Recycling",
    blurb: "We help manufacturers recycle and reprocess post-industrial plastics to reduce waste and improve recovery.",
    icon: "♻️",
  },
  {
    title: "Recycled Resin Supply",
    blurb: "Consistent recycled and reprocessed polymer resins aligned to your specs, availability needs, and cost targets.",
    icon: "🧪",
  },
  {
    title: "Closed-Loop Programs",
    blurb: "Turn your internal scrap into a repeatable loop - program design, routing, and market placement built around your operation.",
    icon: "🔁",
  },
  {
    title: "Sustainable Sourcing",
    blurb: "Support sustainability initiatives with practical, performance-driven materials and transparent sourcing pathways.",
    icon: "🌿",
  },
  {
    title: "Supply Chain Strength",
    blurb: "Diversify supply and reduce risk with market-driven material strategies across domestic and global networks.",
    icon: "🔗",
  },
  {
    title: "Operational Fit",
    blurb: "Every program is built to integrate into real manufacturing environments - simple to run, scalable to grow.",
    icon: "🏭",
  },
];

export default function SpecialtiesSection() {

  const isMobile = useIsMobile();

  return (
    <section
      style={{
        width: "100%",
        background: "#EEF4F2",
        padding: "90px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: isMobile ? "80%" : "100%", maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4vw, 54px)",
              lineHeight: 1.1,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "#2F3A3A",
            }}
          >
            We specialize in
          </h2>

          <p
            style={{
              margin: "18px auto 0 auto",
              maxWidth: "820px",
              fontSize: "clamp(18px, 2vw, 22px)",
              lineHeight: 1.6,
              fontWeight: 300,
              color: "#4A4A4A",
            }}
          >
            Every program is designed with one goal in mind: deliver high-quality materials while keeping plastics in
            productive use.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                padding: "22px",
                boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.06)",
                minHeight: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Icon/Image bubble */}
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  background: "rgba(0,58,93,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#003A5D",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.55,
                  color: "#4A4A4A",
                  fontWeight: 300,
                }}
              >
                {item.blurb}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive helper (inline, minimal) */}
        <style>
          {`
            @media (max-width: 980px) {
              section > div > div:nth-child(2) {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }
            @media (max-width: 640px) {
              section > div > div:nth-child(2) {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </div>
    </section>
  );
}
