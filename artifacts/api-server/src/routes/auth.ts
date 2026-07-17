import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, pagesTable, blocksTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";
import { requireAuth } from "../middlewares/requireAuth";
import crypto from "crypto";

const router = Router();

// ── Register ──────────────────────────────────────────────────────────────
router.post("/auth/register", async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password || !name) {
      res.status(400).json({ error: "هەموو خانەکان پێویستن" }); return;
    }
    if (username.length < 3 || username.length > 30) {
      res.status(400).json({ error: "ناوی بەکارهێنەر دەبێت لە ٣ تا ٣٠ پیت بێت" }); return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      res.status(400).json({ error: "ناوی بەکارهێنەر تەنها دەتوانێت پیت، ژمارە و _ لەخۆبگرێت" }); return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "وشەی نهێنی دەبێت کەمتر نەبێت لە ٦ پیت" }); return;
    }

    const existing = await db.select().from(usersTable)
      .where(or(eq(usersTable.username, username.toLowerCase()), eq(usersTable.email, email.toLowerCase())))
      .limit(1);

    if (existing.length > 0) {
      const conflict = existing[0].username === username.toLowerCase() ? "ناوی بەکارهێنەر" : "ئیمەیڵ";
      res.status(409).json({ error: `${conflict} پێشتر بەکارهاتووە` }); return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash, name,
      categories: [],
      themeColor: "#6366f1",
    }).returning();

    const [page] = await db.insert(pagesTable).values({ userId: user.id, title: "ماڵپەڕ", isHome: true }).returning();
    await db.insert(blocksTable).values({ pageId: page.id, type: "header", title: "سەردێڕ", blockOrder: 0, isVisible: true });
    await db.insert(blocksTable).values({ pageId: page.id, type: "links",  title: "لینکەکانم", blockOrder: 1, isVisible: true });

    const token = signToken(user.id);
    const { passwordHash: _, resetToken: __, resetTokenExpiry: ___, ...safeUser } = user;
    res.status(201).json({ user: { ...safeUser, categories: safeUser.categories ?? [] }, token });
  } catch (err) { next(err); }
});

// ── Login ─────────────────────────────────────────────────────────────────
router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ error: "ئیمەیڵ و وشەی نهێنی پێویستن" }); return; }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user) { res.status(401).json({ error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" }); return; }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) { res.status(401).json({ error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" }); return; }

    const token = signToken(user.id);
    const { passwordHash: _, resetToken: __, resetTokenExpiry: ___, ...safeUser } = user;
    res.json({ user: { ...safeUser, categories: safeUser.categories ?? [] }, token });
  } catch (err) { next(err); }
});

// ── Logout ────────────────────────────────────────────────────────────────
router.post("/auth/logout", (_req, res) => { res.json({ success: true }); });

// ── Get me ────────────────────────────────────────────────────────────────
router.get("/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { passwordHash: _, resetToken: __, resetTokenExpiry: ___, ...safeUser } = user;
  res.json({ ...safeUser, categories: safeUser.categories ?? [] });
});

// ── Check username ────────────────────────────────────────────────────────
router.get("/auth/check-username/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const [existing] = await db.select({ id: usersTable.id }).from(usersTable)
      .where(eq(usersTable.username, username.toLowerCase())).limit(1);
    res.json({ available: !existing, username: username.toLowerCase() });
  } catch (err) { next(err); }
});

// ── Forgot password ───────────────────────────────────────────────────────
router.post("/auth/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: "ئیمەیڵ پێویستە" }); return; }

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase())).limit(1);

    // Always respond 200 to prevent email enumeration
    if (!user) { res.json({ success: true }); return; }

    // Generate a secure token valid for 1 hour
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await db.update(usersTable)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(usersTable.id, user.id));

    // In production: send email with the reset link.
    // For now, return the token directly so the UI can guide the user.
    const resetUrl = `${req.headers.origin || ""}/ڕێکخستنەوەی-وشەی-نهێنی?token=${token}`;
    console.log(`[forgot-password] Reset link for ${email}: ${resetUrl}`);

    res.json({ success: true, resetToken: token }); // token returned for dev/demo
  } catch (err) { next(err); }
});

// ── Reset password ────────────────────────────────────────────────────────
router.post("/auth/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) { res.status(400).json({ error: "تۆکن و وشەی نهێنی نوێ پێویستن" }); return; }
    if (password.length < 6) { res.status(400).json({ error: "وشەی نهێنی دەبێت کەمتر نەبێت لە ٦ پیت" }); return; }

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.resetToken, token)).limit(1);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ error: "تۆکنەکە نادروستە یان کاتی تەواو بووە" }); return;
    }

    const passwordHash = await hashPassword(password);
    await db.update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(usersTable.id, user.id));

    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
