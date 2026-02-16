// src/Pages/Contact/Contact.tsx (or wherever this lives)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";
import Navigation from "../../Components/Navigation";
import { useIsMobile, useAppDispatch } from "../../Core/hooks";
import { axiosPublic } from "../../Core/axios"; // <-- use your public axios instance (no auth) OR swap to axios

function Contact() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // UI states
  const [errorText, setErrorText] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isMobile = useIsMobile();
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  const emailIsValid = (value: string) => {
    const v = value.trim().toLowerCase();
    // Practical email regex (not perfect, but solid UX)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
  };

  const canSubmit = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      message.trim().length > 0 &&
      emailIsValid(email)
    );
  }, [firstName, lastName, message, email]);

  const resetAlerts = () => {
    setErrorText("");
    setSuccess(false);
  };

  const handleSubmit = async () => {
    resetAlerts();

    // Front-end validation
    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!fn || !ln || !em || !msg) {
      setErrorText("Please complete all fields.");
      return;
    }
    if (!emailIsValid(em)) {
      setErrorText("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // IMPORTANT: Do NOT call SendGrid directly from the browser.
      // Call your backend endpoint that sends the email server-side.
      await axiosPublic.post("/api/contact", {
        firstName: fn,
        lastName: ln,
        email: em,
        message: msg,
        // optional metadata
        source: "btrpolymers.com/contact",
        submittedAt: new Date().toISOString(),
      });

      setSuccess(true);

      // auto-hide success after 2 seconds
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => {
        setSuccess(false);
      }, 2000);

      // optional: clear fields on success
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      // Prefer showing server error if you return one
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong sending your message. Please try again.";
      setErrorText(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />

      <div className="main-container" style={{ width: isMobile ? "80%" : "70%" }}>
        <h1
          style={{
            paddingTop: isMobile ? "60px" : "0px",
            fontWeight: "bold",
            fontSize: isMobile ? "50px" : "60px",
            margin: " 0px auto 30px auto",
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          Get in touch with us
        </h1>

        <div style={{ margin: "0px auto", textAlign: "center", width: isMobile ? "80%" : "50%" }}>
          <div
            style={{
              color: "#6B6A6A",
              fontSize: "24px",
              fontWeight: "460",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            Whether you're interested in joining our team or exploring how we can work together,
            we'd love to hear from you. Reach out and start the conversation.
          </div>

          <div style={{ margin: isMobile ? "0px auto" : "unset", textAlign: isMobile ? "center" : "unset" }}>
            {!!errorText && (
              <div className="error" style={{ marginBottom: "10px" }}>
                {errorText}
              </div>
            )}

            {success && (
              <div className="success" style={{ marginBottom: "10px" }}>
                Thanks for reaching out! We'll get back to you shortly.
              </div>
            )}

            <div style={{ marginBottom: "40px" }}>
                <div style={{ fontSize: "24pt", fontWeight: "700" }}>
                    <a href="tel:+18336602281" style={{ color: "#000", textDecoration: "none" }}>(234) 602-4211</a>
                </div>
                <div>OR SUBMIT YOUR</div>
            </div>

            <div style={{ display: "flex", gap: "10%", marginBottom: "10px" }}>
              <div style={{ flex: "0 0 45%" }}>
                <input
                  type="text"
                  placeholder="First Name*"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                  onFocus={resetAlerts}
                />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <input
                  type="text"
                  placeholder="Last Name*"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                  onFocus={resetAlerts}
                />
              </div>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <input
                type="email"
                placeholder="Email*"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                onFocus={resetAlerts}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <textarea
                rows={3}
                placeholder="Message*"
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                onFocus={resetAlerts}
              />
            </div>

            <div
              className="cta-orange-outline"
              onClick={() => {
                if (!isSubmitting) handleSubmit();
              }}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                pointerEvents: isSubmitting ? "none" : "auto",
                userSelect: "none",
              }}
            >
              {isSubmitting ? "SENDING..." : "SUBMIT"}
            </div>
          </div>
        </div>
      </div>

      <Footer style={{ position: "relative" }} />
    </>
  );
}

export default Contact;
