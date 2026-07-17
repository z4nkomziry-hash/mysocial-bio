import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { requireAuth } from "../middlewares/requireAuth";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("تەنها وێنەکان مەرجێکن (JPEG, PNG, WebP, GIF)"));
  },
});

// ── Upload avatar ─────────────────────────────────────────────────────────
router.post("/upload/avatar",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("avatar")(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        res.status(400).json({ error: err.message }); return;
      }
      next();
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) { res.status(400).json({ error: "فایلێک دابنێ" }); return; }

      const user = (req as any).user;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const avatarUrl = `${baseUrl}/api/uploads/${req.file.filename}`;

      await db.update(usersTable)
        .set({ avatarUrl })
        .where(eq(usersTable.id, user.id));

      res.json({ avatarUrl });
    } catch (err) { next(err); }
  }
);

export default router;
