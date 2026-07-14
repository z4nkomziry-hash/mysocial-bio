import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, pagesTable, blocksTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Register
router.post("/auth/register", async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    res.status(400).json({ error: "هەموو خانەکان پێویستن" });
    return;
  }

  if (username.length < 3 || username.length > 30) {
    res.status(400).json({ error: "ناوی بەکارهێنەر دەبێت لە ٣ تا ٣٠ پیت بێت" });
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    res.status(400).json({ error: "ناوی بەکارهێنەر تەنها دەتوانێت پیت، ژمارە و _ لەخۆبگرێت" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "وشەی نهێنی دەبێت کەمتر نەبێت لە ٦ پیت" });
    return;
  }

  // Check uniqueness
  const existing = await db.select().from(usersTable)
    .where(or(eq(usersTable.username, username.toLowerCase()), eq(usersTable.email, email.toLowerCase())))
    .limit(1);

  if (existing.length > 0) {
    const conflict = existing[0].username === username.toLowerCase() ? "ناوی بەکارهێنەر" : "ئیمەیڵ";
    res.status(409).json({ error: `${conflict} پێشتر بەکارهاتووە` });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db.insert(usersTable).values({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash,
    name,
    categories: [],
    themeColor: "#6366f1",
  }).returning();

  // Create default home page
  const [page] = await db.insert(pagesTable).values({
    userId: user.id,
    title: "ماڵپەڕ",
    isHome: true,
  }).returning();

  // Create default header block
  await db.insert(blocksTable).values({
    pageId: page.id,
    type: "header",
    title: "سەردێڕ",
    blockOrder: 0,
    isVisible: true,
  });

  // Create default links block
  await db.insert(blocksTable).values({
    pageId: page.id,
    type: "links",
    title: "لینکەکانم",
    blockOrder: 1,
    isVisible: true,
  });

  const token = signToken(user.id);
  const { passwordHash: _, ...safeUser } = user;

  res.status(201).json({
    user: {
      ...safeUser,
      categories: safeUser.categories ?? [],
    },
    token,
  });
});

// Login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "ئیمەیڵ و وشەی نهێنی پێویستن" });
    return;
  }

  const [user] = await db.select().from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "ئیمەیڵ یان وشەی نهێنی هەڵەیە" });
    return;
  }

  const token = signToken(user.id);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    user: {
      ...safeUser,
      categories: safeUser.categories ?? [],
    },
    token,
  });
});

// Logout
router.post("/auth/logout", (_req, res) => {
  res.json({ success: true });
});

// Get me
router.get("/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { passwordHash: _, ...safeUser } = user;
  res.json({
    ...safeUser,
    categories: safeUser.categories ?? [],
  });
});

// Check username
router.get("/auth/check-username/:username", async (req, res) => {
  const { username } = req.params;
  const [existing] = await db.select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, username.toLowerCase()))
    .limit(1);

  res.json({ available: !existing, username: username.toLowerCase() });
});

export default router;
