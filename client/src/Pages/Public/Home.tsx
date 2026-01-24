import React, { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import { useIsMobile } from '../../Core/hooks';
import { RxCalendar, RxLightningBolt } from 'react-icons/rx';
import { IoAnalytics, IoListSharp, IoPeople } from 'react-icons/io5';
import { MdAutoStories } from 'react-icons/md';
import { BiConversation } from 'react-icons/bi';
import HeroSlider from '../../Components/HeroSlider';
import SpecialtiesSection from '../../Components/SpecialitiesSection';

/*
interface Feedback {
    answers: Record<string, boolean>;
    otherText?: string;
}
*/
function Home() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [feedback, setFeedback] = useState("");
    
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const isMobile = useIsMobile();



    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const handleCheckboxChange = (point: string) => {
        setAnswers((prev) => ({
          ...prev,
          [point]: !prev[point],
        }));
      };


    const heading: CSSProperties = {
        marginBottom: "60px",
        fontSize: isMobile ? "28px" : "32px",
        lineHeight: isMobile ? 1.6 : 1.1,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: "#4A4A4A",
    }

    const paragraph: CSSProperties = {
        marginTop: "30px",
        fontSize: isMobile ? "24px" : "32px",
        lineHeight: isMobile ? 1.6 : 1.35,
        fontWeight: 300,
        color: "#6B6B6B",
    }

    return (
    <>
        <Navigation />

        <HeroSlider />

        <div className="main-container" style={{ background: "#fff" }}>
 
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <div style={{ maxWidth: "80%" }}>
                    <h1 style={heading}>
                        Turning Industrial Plastic Waste into High-Performance Materials
                    </h1>

                    <div style={paragraph}>
                        BTR Polymers is a service-driven materials company specializing in the recycling and reprocessing of
                        post-industrial polymer materials. We provide sustainable resin solutions to plastics manufacturers
                        around the world - <span style={{ fontWeight: "400", color: "#000" }}>helping businesses reduce waste, control material costs, and strengthen their supply
                        chains</span>.
                    </div>

                    <div style={paragraph}>
                        From boutique molders to global producers, BTR partners with companies of all sizes to transform plastic
                        scrap into valuable resources. By connecting the circular economy to real-world manufacturing needs, we
                        deliver practical solutions that work for everyday businesses.
                    </div>
                </div>
            </div>
   
        </div>

        {/* two col layout below */}

        <div
            style={{
                width: "100%",
                background: "#E9EEF0",
                padding: "90px 48px",
                display: "flex",
                justifyContent: "center",
            }}
            >
            <div
                style={{
                maxWidth: "1200px",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: "80px",
                alignItems: "start",
                }}
            >
                {/* LEFT COLUMN */}
                <div>
                <p
                    style={{
                    fontSize: "24px",
                    lineHeight: 1.6,
                    color: "#4A4A4A",
                    fontWeight: 300,
                    margin: 0,
                    maxWidth: "520px",
                    }}
                >
                    At BTR Polymers, sustainability is not a slogan - it’s a strategy. We
                    source, process, and supply recycled polymers that meet the performance
                    demands of modern manufacturing while advancing environmental
                    responsibility.
                </p>

                <p
                    style={{
                    fontSize: "24px",
                    lineHeight: 1.6,
                    color: "#4A4A4A",
                    fontWeight: 300,
                    marginTop: "20px",
                    maxWidth: "520px",
                    }}
                >
                    Our team combines technical expertise with hands-on market knowledge to
                    ensure customers receive consistent, dependable materials tailored to
                    their production requirements.
                </p>

                <a
                    href="/solutions"
                    style={{
                    display: "inline-block",
                    marginTop: "36px",
                    padding: "14px 28px",
                    background: "#003A5D",
                    color: "#FFFFFF",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    }}
                >
                    Solutions
                </a>
                </div>

                {/* RIGHT COLUMN */}
                <div>
                    <h2
                        style={{
                        margin: 0,
                        fontSize: isMobile ? "46px" : "66px",
                        lineHeight: 1.1,
                        fontWeight: 700,
                        color: "#003A5D",
                        }}
                    >
                        Sustainable Materials.
                    </h2>
                    <h2
                        style={{
                        margin: "12px 0 0 0",
                        fontSize: isMobile ? "46px" : "66px",
                        lineHeight: 1.1,
                        fontWeight: 700,
                        color: "#8A8A8A",
                        }}
                    >
                        Reliable Supply.
                    </h2>
                    <h2
                        style={{
                        margin: "12px 0 0 0",
                        fontSize: isMobile ? "46px" : "66px",
                        lineHeight: 1.1,
                        fontWeight: 700,
                        color: "#00A3E0",
                        }}
                    >
                        Real Results.
                    </h2>
                </div>
            </div>
        </div>

        {/* two col layout above */}

        <SpecialtiesSection />

        <div
            style={{
                width: "100%",
                background: "#FFFFFF",
                padding: "100px 48px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                maxWidth: "1200px",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "center",
                }}
            >
                {/* LEFT: CONTENT */}
                <div>
                <h2
                    style={{
                    margin: 0,
                    fontSize: "clamp(36px, 4vw, 52px)",
                    lineHeight: 1.1,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    color: "#2F3A3A",
                    }}
                >
                    Partners in the Circular Economy
                </h2>

                <p
                    style={{
                    marginTop: "28px",
                    fontSize: "clamp(18px, 2vw, 22px)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    color: "#4A4A4A",
                    maxWidth: "520px",
                    }}
                >
                    BTR Polymers works side-by-side with manufacturers to create smarter
                    material strategies. Whether reclaiming in-house scrap, sourcing recycled
                    resin, or building custom recycling programs, we help companies close the
                    loop without compromising performance or profitability.
                </p>

                <p
                    style={{
                    marginTop: "18px",
                    fontSize: "clamp(18px, 2vw, 22px)",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    color: "#4A4A4A",
                    maxWidth: "520px",
                    }}
                >
                    We believe the circular economy only succeeds when it makes business
                    sense - and that’s exactly where we focus.
                </p>
                </div>

                {/* RIGHT: IMAGE */}
                <div
                style={{
                    width: "100%",
                    height: "420px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    backgroundColor: "#E9EEF0",
                    backgroundImage: "url(/images/circular-program.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                />
            </div>

            {/* Responsive stacking */}
            <style>
                {`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns"] {
                    grid-template-columns: 1fr !important;
                    gap: 48px !important;
                    }
                }
                `}
            </style>
        </div>

        <div style={{ background: "#E9EEF0", padding: "90px 48px", }}>
 
            <div style={{ width: "80%", margin: "0px auto", textAlign: "center" }}>
          
                <h1 style={heading}>
                    Let’s Build a More Sustainable Supply Chain
                </h1>

                <div style={paragraph}>
                    Looking for reliable recycled polymers or a partner to manage your post-industrial scrap streams?
                    BTR Polymers is ready to help.
                </div>
                <div>
                    <a
                        href="/contact"
                        style={{
                        display: "inline-block",
                        marginTop: "36px",
                        padding: "14px 28px",
                        background: "#003A5D",
                        color: "#FFFFFF",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: 600,
                        }}
                    >
                        Contact Sales
                </a>
                </div>
            </div>
   
        </div>



        







        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Home;