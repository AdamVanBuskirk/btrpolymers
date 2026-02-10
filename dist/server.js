"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
require("dotenv").config();
const path = require("path");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const app = (0, express_1.default)();
// --------------------
// Middleware
// --------------------
// Set Request Size Limit
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: false }));
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;
if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https")
            res.redirect(`https://${req.header("host")}${req.url}`);
        else
            next();
    });
}
/* Cross Origin Resource Sharing */
app.use(cors(corsOptions));
// built-in middleware for json
app.use(express_1.default.json());
// middleware for cookies
app.use(cookieParser());
// --------------------
// SendGrid setup
// --------------------
if (!process.env.SENDGRID_API_KEY) {
    console.warn("WARNING: SENDGRID_API_KEY is not set. /api/contact will fail.");
}
else {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
}
const CONTACT_TO_EMAIL = process.env.SALES_EMAIL;
// Must be a verified sender/domain in SendGrid
const CONTACT_FROM_EMAIL = process.env.SUPPORT_EMAIL;
const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
const escapeHtml = (input) => input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
// --------------------
// API Routes
// --------------------
app.post("/api/contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, message, source, submittedAt } = (req.body || {});
        const fn = String(firstName !== null && firstName !== void 0 ? firstName : "").trim();
        const ln = String(lastName !== null && lastName !== void 0 ? lastName : "").trim();
        const em = String(email !== null && email !== void 0 ? email : "").trim();
        const msg = String(message !== null && message !== void 0 ? message : "").trim();
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
        yield mail_1.default.send({
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
          <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;">${escapeHtml(msg)}</pre>
          <p style="color:#666;">
            <strong>Source:</strong> ${escapeHtml(src)}<br/>
            <strong>Submitted At:</strong> ${escapeHtml(when)}
          </p>
        </div>
      `,
        });
        return res.status(200).json({ ok: true });
    }
    catch (e) {
        return res.status(500).json({ message: "Failed to send message." });
    }
}));
// --------------------
// Static client
// --------------------
const publicPath = path.join(__dirname, "..", "client", "build");
app.use(express_1.default.static(publicPath));
// IMPORTANT: keep this LAST so it doesn't swallow /api routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
// --------------------
// Start server
// --------------------
const server = http_1.default.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
