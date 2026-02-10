// server.ts
require("dotenv").config();
const path = require("path");

import http from "http";
import express, { Express, Request, Response } from "express";
import sgMail from "@sendgrid/mail";

const app: Express = express();

// --------------------
// Middleware
// --------------------
// Set Request Size Limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;

if (process.env.NODE_ENV === "production") {
  app.use((req: any, res: any, next: any) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));
// built-in middleware for json
app.use(express.json());
// middleware for cookies
app.use(cookieParser());

// --------------------
// SendGrid setup
// --------------------
if (!process.env.SENDGRID_API_KEY) {
  console.warn("WARNING: SENDGRID_API_KEY is not set. /api/contact will fail.");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const CONTACT_TO_EMAIL = process.env.SALES_EMAIL;
// Must be a verified sender/domain in SendGrid
const CONTACT_FROM_EMAIL = process.env.SUPPORT_EMAIL;

const emailIsValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


// --------------------
// API Routes
// --------------------
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, message, source, submittedAt } = (req.body || {}) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      message?: string;
      source?: string;
      submittedAt?: string;
    };

    const fn = String(firstName ?? "").trim();
    const ln = String(lastName ?? "").trim();
    const em = String(email ?? "").trim();
    const msg = String(message ?? "").trim();

    if (!fn || !ln || !em || !msg) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    if (!emailIsValid(em)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({ message: "SendGrid is not configured on the server." });
    }
    if (!CONTACT_FROM_EMAIL) {
      return res.status(500).json({ message: "CONTACT_FROM_EMAIL is not configured on the server." });
    }

    const when = submittedAt ? String(submittedAt) : new Date().toISOString();
    const src = source ? String(source) : "btrpolymers.com/contact";

    await sgMail.send({
      to: CONTACT_TO_EMAIL,
      from: CONTACT_FROM_EMAIL,
      subject: `New Contact Form Submission: ${fn} ${ln}`,
      replyTo: em,
      text: [
        "New contact form submission",
        `Name: ${fn} ${ln}`,
        `Email: ${em}`,
        "",
        "Message:",
        msg,
        "",
        `Source: ${src}`,
        `Submitted At: ${when}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(fn)} ${escapeHtml(ln)}</p>
          <p><strong>Email:</strong> ${escapeHtml(em)}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;">${escapeHtml(
            msg
          )}</pre>
          <p style="color:#666;">
            <strong>Source:</strong> ${escapeHtml(src)}<br/>
            <strong>Submitted At:</strong> ${escapeHtml(when)}
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: "Failed to send message." });
  }
});

// --------------------
// Static client
// --------------------
const publicPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(publicPath));

// IMPORTANT: keep this LAST so it doesn't swallow /api routes
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// --------------------
// Start server
// --------------------
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));