// controllers/docsController.ts
import { Request, Response } from "express";
import { getUser } from "../helpers/getUser";
import { getRoleName } from "../helpers/getRoleName";
import { Types } from "mongoose";
import fns from "date-fns";
const activityController = require("../controllers/ActivityController");
const Doc = require("../models/domain/Doc");
import { uploadToS3, buildDocKey, DOCS_BUCKET } from "../helpers/s3Docs";
import { presignGetUrl } from "../helpers/s3Docs";


/**
 * GET /api/docs?companyId=xxx
 * Get all active docs for a company
 */
const getDocs = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    if (!companyId) {
      return res.status(400).json({ message: "companyId is required." });
    }

    const foundUser = await getUser(req.cookies, "company", companyId.toString());
    if (!foundUser) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const docs = await Doc.find({
      companyId: new Types.ObjectId(companyId.toString()),
      active: true,
    })
      .sort({ created: -1 })
      .lean();

    return res.status(200).json(docs);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

function guessCategoryFromUpload(file: Express.Multer.File) {
    const mt = (file.mimetype || "").toLowerCase();
    const name = (file.originalname || "").toLowerCase();
  
    if (mt.startsWith("video/")) return "video";
    if (mt.startsWith("image/")) return "image";
  
    const imageExt = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tiff", ".tif", ".heic"];
    if (imageExt.some((e) => name.endsWith(e))) return "image";
  
    const videoExt = [".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv"];
    if (videoExt.some((e) => name.endsWith(e))) return "video";
  
    const docExt = [".pdf", ".doc", ".docx", ".pages", ".rtf", ".txt"];
    if (docExt.some((e) => name.endsWith(e))) return "document";
  
    const sheetExt = [".csv", ".xls", ".xlsx", ".numbers"];
    if (sheetExt.some((e) => name.endsWith(e))) return "spreadsheet";
  
    return "other";
  }
  

/**
 * POST /api/docs/upload
 * Body: { companyId, title?, description?, files[] }
 *
 * NOTE: files metadata assumed to be normalized by upload middleware
 */
const uploadDocs = async (req: Request, res: Response) => {
    try {
      const companyId = req.body?.companyId; // ✅ now exists because multer ran
      const { title, description } = req.body;
  
      if (!companyId) {
        return res.status(400).json({ message: "companyId is required." });
      }
  
      const foundUser = await getUser(req.cookies, "company", companyId);
      if (!foundUser) {
        return res.status(403).json({ message: "Not authorized." });
      }
  
      const role = await getRoleName(companyId, foundUser._id);
      if (role !== "owner" && role !== "admin") {
        return res.status(403).json({ message: "Unauthorized." });
      }
  
      const uploadedFiles = (req.files as Express.Multer.File[]) || [];
      if (!uploadedFiles.length) return res.status(400).json({ message: "No files provided." });
      
      const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
      
      const createdDocs: any[] = [];
      
      for (const f of uploadedFiles) {
        const key = buildDocKey({ companyId, originalName: f.originalname });
      
        await uploadToS3({
          key,
          body: f.buffer,
          contentType: f.mimetype || "application/octet-stream",
        });

        const category = guessCategoryFromUpload(f);

        const doc = await Doc.create({
          companyId: new Types.ObjectId(companyId),
          title: title || f.originalname,
          description: description || "",
          category,
          kind: "file",
          fileName: f.originalname,
          mimeType: f.mimetype,
          fileSizeBytes: f.size,
          storageKey: key,
          bucket: DOCS_BUCKET, // add to model if you want
          created: now,
          active: true,
        });
      
        createdDocs.push(doc);
      }
      
      return res.status(200).json(createdDocs);
      

    } catch (err: any) {
      console.error(err);
      return res.status(400).json({ error: { message: err.message } });
    }
  };
  

/**
 * POST /api/docs/link
 * Body: { companyId, title, url, description? }
 */
const createLink = async (req: Request, res: Response) => {
  try {
    const { companyId, title, url, description } = req.body;
    if (!companyId || !title || !url) {
      return res.status(400).json({ message: "Invalid payload." });
    }

    const foundUser = await getUser(req.cookies, "company", companyId);
    if (!foundUser) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const role = await getRoleName(companyId, foundUser._id);
    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({ message: "Unauthorized." });
    }

    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    const doc = await Doc.create({
      companyId: new Types.ObjectId(companyId),
      title,
      description,
      url,
      category: "link",
      kind: "link",
      created: now,
      active: true,
    });

    activityController.register({
      userId: foundUser._id,
      section: "docs",
      object: "Doc",
      objectId: doc._id,
      action: "created link",
      description: `${foundUser.firstName} ${foundUser.lastName} added a doc link "${title}".`,
      created: now,
    });

    return res.status(200).json(doc);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: { message: err.message } });
  }
};

/**
 * DELETE /api/docs/:id?companyId=xxx
 * Soft delete
 */
const deleteDoc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { companyId } = req.params;

    if (!id || !companyId) {
      return res.status(400).json({ message: "Invalid payload." });
    }

    const foundUser = await getUser(req.cookies, "company", companyId.toString());
    if (!foundUser) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const role = await getRoleName(companyId.toString(), foundUser._id);
    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({ message: "Unauthorized." });
    }

    const doc = await Doc.findOne({
      _id: id,
      companyId: new Types.ObjectId(companyId.toString()),
      active: true,
    });

    if (!doc) {
      return res.status(404).json({ message: "Doc not found." });
    }

    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    await Doc.updateOne(
      { _id: id },
      {
        $set: {
          active: false,
          deleted: now,
          modified: now,
        },
      }
    );

    activityController.register({
      userId: foundUser._id,
      section: "docs",
      object: "Doc",
      objectId: id,
      action: "deleted doc",
      description: `${foundUser.firstName} ${foundUser.lastName} deleted a document.`,
      created: now,
    });

    return res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

const openDoc = async (req: Request, res: Response) => {
    try {
      const { companyId, docId } = req.params;
  
      const foundUser = await getUser(req.cookies, "company", companyId);
      if (!foundUser) return res.status(403).json({ message: "Not authorized." });
  
      const doc = await Doc.findOne({
        _id: docId,
        companyId: new Types.ObjectId(companyId),
        active: true,
      });
  
      if (!doc) return res.status(404).json({ message: "Doc not found." });
      if (doc.kind !== "file") return res.status(400).json({ message: "Not a file doc." });
      if (!doc.storageKey) return res.status(400).json({ message: "Missing storage key." });
  
      const url = await presignGetUrl({ key: doc.storageKey, expiresSeconds: 60 });
  
      return res.status(200).json({ url });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Server error." });
    }
  };

module.exports = {
  getDocs,
  uploadDocs,
  createLink,
  deleteDoc,
  openDoc
};
