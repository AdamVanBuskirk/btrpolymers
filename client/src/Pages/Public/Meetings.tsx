import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Core/hooks";
import { getUser } from "../../Store/Auth";
import Footer from "../../Components/Footer";
import Navigation from "../../Components/Navigation";
import RedirectToDash from "../../Components/RedirectToDash";
import { useIsMobile } from "../../Core/hooks";
import { RxCalendar } from "react-icons/rx";
import { HiArrowLongRight } from "react-icons/hi2";

function Meetings() {
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user.accessToken !== "" && user.status !== "loading") {
      navigate("/dash");
    }
  }, [user, navigate]);

  const meetings = [
    {
      title: "Daily Mentions",
      time: "2 minutes • daily",
      desc: "Tiny leader touchpoints that keep Outgrow top-of-mind and reinforce the right behaviors.",
      paragraph: "Daily Mentions are quick, intentional moments of leadership woven into the flow of the workday. A short note, a brief comment, or a quick “nice job” tied to a specific Outgrow action reminds your team that proactive outreach matters. These micro-touchpoints don’t interrupt the day or require a meeting, but over time they build consistency, reinforce winning behaviors, and signal that leadership is paying attention to the work that drives real growth.",
      bullets: ["Celebrate a win", "Give one quick coaching tip", "Nudge one key follow-up"],
      img: "/images/outgrow-daily-huddle.jpg",
    },
    {
      title: "Weekly Huddle",
      time: "15–20 minutes • weekly",
      desc: "A fast, focused weekly reset so everyone knows who they’re calling and why.",
      bullets: ["Quick metrics check", "1–2 success stories", "Assign outreach for the week"],
      paragraph: "",
      img: "/images/meetings-weekly-huddle.png", // TODO: replace
    },
    {
      title: "Leadership Weekly Huddle",
      time: "30 minutes max • weekly",
      desc: "Align managers on priorities before the frontline huddles—without micromanaging.",
      bullets: ["Scoreboard + momentum", "What’s working across teams", "Set next week’s focus"],
      paragraph: "",
      img: "/images/meetings-leadership-huddle.png", // TODO: replace
    },
    {
      title: "Monthly Review",
      time: "10 minutes per Outgrower • monthly",
      desc: "Short 1:1s that keep standards high and give every rep clear monthly priorities.",
      bullets: ["Look back: effort + outcomes", "Look forward: expansion + referrals", "Eliminate guessing"],
      paragrapah: "",
      img: "/images/meetings-monthly-review.png", // TODO: replace
    },
    {
      title: "Quarterly Planning",
      time: "90 minutes • quarterly",
      desc: "A 90-day reset that unifies the team around the biggest revenue levers in your customer base.",
      bullets: ["Recognize top performers", "Fix participation gaps", "Set 90-day priorities"],
      paragraph: "",
      img: "/images/meetings-quarterly-planning.png", // TODO: replace
    },
  ];

  const cardStyle = {
    border: "3px solid #000",
    borderRadius: "18px",
    padding: isMobile ? "18px" : "22px",
    background: "#fff",
  } as const;

  const muted = {
    color: "#6B6A6A",
    fontSize: isMobile ? "18px" : "22px",
    fontWeight: 460 as const,
    lineHeight: "1.35",
  };

  return (
    <>
      <RedirectToDash />
      <Navigation />

      <div className="main-container">
        {/* HERO (match Home vibe) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0px", alignItems: "center" }}>
          <div style={{ flex: "0 0 42%", minWidth: "300px", order: 1 }}>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "50px" : "60px",
                marginBottom: "30px",
                letterSpacing: "-1px",
              }}
            >
              Meetings that keep Outgrow moving
            </h1>

            <div style={{ ...muted, marginBottom: "30px" }}>
              A simple cadence of short meetings that keeps your team proactive with existing customers - more follow-ups,
              more expansion conversations, more referrals.
            </div>

            <div style={{ margin: isMobile ? "0px auto" : "unset", textAlign: isMobile ? "center" : "unset" }}>
              <div
                className="cta-orange-outline"
                style={{ marginRight: isMobile ? "0px" : "20px", marginBottom: isMobile ? "20px" : "unset" }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                START FOR FREE
              </div>

              <div
                className="cta-black-outline"
                style={{ marginBottom: isMobile ? "30px" : "unset" }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("meeting-types");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                SEE MEETING TYPES
              </div>
            </div>
          </div>

          <div style={{ flex: "0 0 58%", minWidth: "300px", position: "relative", order: 2 }}>
            {/* Placeholder hero image (swap to a real screenshot/graphic) */}
            <img
              src="/images/outgrow-team-meeting-gradient.jpg"
              style={{ width: "100%", display: "block" }}
              alt="Meetings hero placeholder"
            />
          </div>
        </div>

       {/* MEETING TYPES */}
        <div id="meeting-types" style={{ marginTop: "90px" }}>
        <h2
            style={{
            fontWeight: "bold",
            fontSize: isMobile ? "44px" : "56px",
            letterSpacing: "-1px",
            marginBottom: "20px",
            }}
        >
            The Meeting Types
        </h2>

        <div
            style={{
            color: "#6B6A6A",
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: 460,
            maxWidth: "900px",
            marginBottom: isMobile ? "60px" : "90px",
            lineHeight: "1.35",
            }}
        >
            A simple cadence designed to keep teams proactive with existing customers —
            without overloading calendars or killing momentum.
        </div>

        {meetings.map((m, idx) => (
            <div
            key={m.title}
            style={{
                display: "flex",
                flexDirection: isMobile ? "column" : idx % 2 === 0 ? "row-reverse" : "row",
                alignItems: "center",
                gap: "0px",
                flexWrap: "wrap",
                //gap: isMobile ? "30px" : "80px",
                marginBottom: isMobile ? "80px" : "140px",
            }}
            >    

            {/* TEXT */}
            <div style={{ flex: "0 0 42%", minWidth: "300px", order: 1 }}>
                <div
                style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                }}
                >
                {m.time}
                </div>

                <h3
                style={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "34px" : "42px",
                    letterSpacing: "-0.5px",
                    marginBottom: "10px",
                }}
                >
                {m.title}
                </h3>

                <div
                style={{
                    color: "#6B6A6A",
                    fontSize: isMobile ? "20px" : "22px",
                    fontWeight: 660,
                    lineHeight: "1.4",
                    maxWidth: "550px",
                    marginBottom: "40px",
                }}
                >
                {m.desc}
                </div>

                <div
                style={{
                    color: "#6B6A6A",
                    fontSize: isMobile ? "18px" : "20px",
                    //fontWeight: 460,
                    lineHeight: "1.4",
                    maxWidth: "550px",
                }}
                >
                {m.paragraph}
                </div>
            </div>

            {/* IMAGE */}
            <div style={{ flex: "0 0 58%", minWidth: "300px", position: "relative", order: 2 }} >
                <img
                src={m.img}
                alt={m.title}
                style={{
                    width: "100%",
                    //maxWidth: "520px",
                    display: "block",
                }}
                />
            </div>
            </div>
        ))}
        </div>
      </div>

      <Footer style={{ position: "relative" }} />
    </>
  );
}

export default Meetings;
