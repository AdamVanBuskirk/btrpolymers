// models/ReportSubscription.ts
import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["user", "email"], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId },
    email: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const ReportSubscriptionSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },

    name: { type: String, required: true },
    reportType: { type: String, required: true }, // e.g. "leadership_dashboard"
    reportConfig: { type: mongoose.Schema.Types.Mixed, default: {} }, // filters, team scope, etc.

    recipients: { type: [RecipientSchema], default: [] },

    timezone: { type: String, default: "America/New_York" },

    // simple schedule representation your UI can drive
    schedule: {
      frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
      timeOfDay: { type: String, required: true }, // "09:00" 24h
      daysOfWeek: { type: [Number], default: [] }, // 0-6 (Sun-Sat) for weekly
      dayOfMonth: { type: Number }, // 1-31 for monthly
    },

    delivery: {
      format: { type: String, enum: ["email_html", "pdf", "both", "csv", "email_csv"], default: "email_html" },
      subject: { type: String, default: "" },
      message: { type: String, default: "" },
    },

    isEnabled: { type: Boolean, default: true },

    lastRunAt: { type: Date },
    lastStatus: { type: String, enum: ["success", "error", "never ran"], default: "never ran" },
    lastError: { type: String, default: "" },
  },
  { timestamps: true }
);

ReportSubscriptionSchema.index({ companyId: 1, isEnabled: 1 });

export const ReportSubscription = mongoose.model("ReportSubscription", ReportSubscriptionSchema);
