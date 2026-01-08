// models/domain/Doc.ts
import mongoose, { Schema, Types } from "mongoose";

const DocSchema = new Schema(
  {
    companyId: { type: Types.ObjectId, required: true, index: true, ref: "Company" },

    // "file" or "link"
    kind: { type: String, required: true, enum: ["file", "link"], index: true },

    // artifact category
    category: {
      type: String,
      required: true,
      enum: ["video", "document", "spreadsheet", "image", "link", "other"],
      default: "other",
      index: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },

    // link fields
    url: { type: String, trim: true, default: "" },

    // file fields
    fileName: { type: String, trim: true, default: "" },
    mimeType: { type: String, trim: true, default: "" },
    fileSizeBytes: { type: Number, default: 0 },

    // storage fields (S3/GCS/local)
    storageKey: { type: String, trim: true, default: "" },
    downloadUrl: { type: String, trim: true, default: "" },

    // bookkeeping
    active: { type: Boolean, default: true, index: true },

    created: { type: String, default: "" },  // match your existing controllers (date-fns formatted string)
    modified: { type: String, default: "" },
    deleted: { type: String, default: "" },

    // optional attribution (if you want it)
    createdByUserId: { type: Types.ObjectId, required: false, ref: "User", index: true },
    createdByName: { type: String, trim: true, default: "" },
  },
  {
    // keep off since you use created/modified strings everywhere else
    timestamps: false,
    minimize: false,
  }
);

// Helpful indexes
DocSchema.index({ companyId: 1, active: 1, created: -1 });
DocSchema.index({ companyId: 1, category: 1, active: 1 });

module.exports = mongoose.model("Doc", DocSchema);
