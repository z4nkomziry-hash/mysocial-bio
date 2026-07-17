import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, pagesTable, blocksTable, linksTable } from "@workspace/db";
import { eq, asc, sql } from "drizzle-orm";

const router = Router();

// ── Get public profile (and bump view counter) ────────────────────────────
router.get("/public/:username", async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username || !/^[a-zA-Z0-9_]+$/.test(username)) {
      res.status(400).json({ error: "ناوی بەکارهێنەر نادروستە" }); return;
    }

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.username, username.toLowerCase()))
      .limit(1);

    if (!user) { res.status(404).json({ error: "پرۆفایل نەدۆزرایەوە" }); return; }

    // Increment profile view counter (fire-and-forget — don't block the response)
    db.update(usersTable)
      .set({ profileViews: sql`${usersTable.profileViews} + 1` })
      .where(eq(usersTable.id, user.id))
      .catch(() => { /* ignore */ });

    const pages = await db.select().from(pagesTable)
      .where(eq(pagesTable.userId, user.id))
      .orderBy(asc(pagesTable.id));

    const homePage = pages.find(p => p.isHome) ?? pages[0];
    let blocks: any[] = [];

    if (homePage) {
      const rawBlocks = await db.select().from(blocksTable)
        .where(eq(blocksTable.pageId, homePage.id))
        .orderBy(asc(blocksTable.blockOrder));

      blocks = await Promise.all(
        rawBlocks.filter(b => b.isVisible).map(async (block) => {
          const links = await db.select().from(linksTable)
            .where(eq(linksTable.blockId, block.id))
            .orderBy(asc(linksTable.linkOrder));
          return { ...block, links };
        })
      );
    }

    const { passwordHash: _, resetToken: __, resetTokenExpiry: ___, ...safeUser } = user;

    res.json({
      username: safeUser.username,
      name: safeUser.name,
      bio: safeUser.bio,
      avatarUrl: safeUser.avatarUrl,
      themeColor: safeUser.themeColor,
      profileViews: safeUser.profileViews,
      instagram: safeUser.instagram,
      tiktok: safeUser.tiktok,
      youtube: safeUser.youtube,
      snapchat: safeUser.snapchat,
      twitter: safeUser.twitter,
      linkedin: safeUser.linkedin,
      twitch: safeUser.twitch,
      pages: pages.map(p => ({ id: p.id, title: p.title, isHome: p.isHome })),
      blocks,
    });
  } catch (err) { next(err); }
});

export default router;
