import React from "react";
import { Link } from "react-router-dom";

interface SalesDoingHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
}

const SalesDoingHero: React.FC<SalesDoingHeroProps> = ({
  title = "Crush every month by turning action and data into predictable revenue you can bank on",
  subtitle = "SALES DOING, Not Sales Training",
  description = "Join the many others who have taken control of their sales growth with proactivity, accountability and analytics.",
  ctaText = "Start For Free. 30 Days. No CC",
}) => {
  return (
    <div className="loginPageRight">
      <div style={{ fontSize: "14pt", width: "70%", textTransform: "uppercase" }}>
        {title}
      </div>

      <div
        style={{
          fontSize: "50pt",
          fontWeight: 590,
          width: "90%",
          paddingTop: "30px",
        }}
      >
        {subtitle}
      </div>

      <div style={{ fontSize: "14pt", width: "70%", paddingTop: "30px" }}>
        <div style={{ width: "70%", lineHeight: 1.3 }}>{description}</div>
      </div>
      <Link to="/register">
        <div className="cta-button" style={{ marginTop: "30px" }}>
            {ctaText}
        </div>
      </Link>
    </div>
  );
};

export default SalesDoingHero;
