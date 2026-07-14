import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Update profile
router.put("/profile", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { name, bio, avatarUrl, themeColor, categories } = req.body;

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
  if (themeColor !== undefined) updates.themeColor = themeColor;
  if (categories !== undefined) updates.categories = categories;

  const [updated] = await db.update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, user.id))
    .returning();

  const { passwordHash: _, ...safeUser } = updated;
  res.json({ ...safeUser, categories: safeUser.categories ?? [] });
});

// Update social links
router.put("/profile/social-links", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { instagram, tiktok, youtube, snapchat, twitter, linkedin, twitch } = req.body;

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (instagram !== undefined) updates.instagram = instagram;
  if (tiktok !== undefined) updates.tiktok = tiktok;
  if (youtube !== undefined) updates.youtube = youtube;
  if (snapchat !== undefined) updates.snapchat = snapchat;
  if (twitter !== undefined) updates.twitter = twitter;
  if (linkedin !== undefined) updates.linkedin = linkedin;
  if (twitch !== undefined) updates.twitch = twitch;

  const [updated] = await db.update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, user.id))
    .returning();

  const { passwordHash: _, ...safeUser } = updated;
  res.json({ ...safeUser, categories: safeUser.categories ?? [] });
});

export default router;
