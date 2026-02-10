// src/Components/HeroSlider.tsx
import React, { useEffect, useState } from "react";
import { useIsMobile } from "../Core/hooks";

const slides = [
{
    image: "/images/recycling-factory.jpg",
    title: "Industrial Recycling Solutions Built for Your Operation",
    subtitle: "BTR Polymers designs and manages site-specific recycling programs that improve efficiency, reduce waste, and maximize the value of recyclable materials. We take a hands-on, customized approach-building practical solutions that integrate seamlessly into real manufacturing environments.",
    cta: "View Our Solutions",
    link: "/solutions",
},
  {
    image: "/images/plastic-pellets.jpg",
    title: "Market-Driven Recycled Polymers. Built for Real Manufacturing.",
    subtitle: "BTR Polymers connects manufacturers with reliable, cost-effective recycled polymer feedstocks across a wide range of resin families. We navigate the complexity of the recycled plastics market so you can keep production moving-without compromising performance or sustainability.",
    cta: "Explore Our Materials",
    link: "/materials",
  },

  {
    image: "/images/our-story.jpg",
    title: "Built Through Disruption. Focused on What Endures.",
    subtitle: "Founded in 2011, Burdette Thomas Company evolved from a national distribution business into a vertically integrated recycled polymer partner. Shaped by real-world supply-chain disruption, we invest in infrastructure, market expertise, and sustainable manufacturing to deliver reliable materials and long-term value for our customers.",
    cta: "Why BTR Polymers",
    link: "/about",
  },
];

const HeroSlider = () => {

  const [index, setIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? "780px" : "520px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
          transition: "background-image 0.6s ease",
        }}
      >
        {/* Overlay */}
        <div
            style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.70) 35%, rgba(0,0,0,0.60) 65%, rgba(0,0,0,0.40) 100%)",
            }}
  
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 32px",
            color: "#fff",
            //textShadow: "0 2px 6px rgba(0,0,0,0.45)"
          }}
        >
          <div style={{ maxWidth: "720px" }}>
            <h1 style={{ fontSize: "44px", lineHeight: 1.2, marginBottom: "16px" }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: "22px", marginBottom: "24px" }}>
              {slide.subtitle}
            </p>
            <a
              href={slide.link}
              style={{
                display: "inline-block",
                padding: "12px 22px",
                background: "#003A5D",
                //background: "#319C17",
                color: "#fff",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {slide.cta}
            </a>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: i === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
