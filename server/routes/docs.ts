import express, { Router } from "express";
const router: Router = express.Router();
import multer from "multer";
const docsController = require("../controllers/docsController");

// memory storage for now (you can swap to disk/S3 later)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/:companyId", docsController.getDocs);
router.post("/upload", upload.array("files"), docsController.uploadDocs);
router.post("/link", docsController.createLink);
router.delete("/:companyId/:id", docsController.deleteDoc);
router.get("/:companyId/:docId/open", docsController.openDoc);


module.exports = router;
