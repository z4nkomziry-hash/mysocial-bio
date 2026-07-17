import { Router } from "express";
import { db } from "@workspace/db";
import { clicksTable, linksTable, blocksTable, pagesTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// ── Record click (public) ─────────────────────────────────────────────────
router.post("/analytics/click", async (req, res, next) => {
  try {
    const { linkId, username } = req.body;
    if (!linkId || typeof linkId !== "number") {
      res.status(400).json({ error: "ئایدی بەستەر پێویستە و دەبێت ژمارە بێت" }); return;
    }

    const [link] = await db.select().from(linksTable).where(eq(linksTable.id, linkId)).limit(1);
    if (!link) { res.status(404).json({ error: "بەستەر نەدۆزرایەوە" }); return; }

    await Promise.all([
      db.insert(clicksTable).values({ linkId, username: username ?? null }),
      db.update(linksTable)
        .set({ clickCount: sql`${linksTable.clickCount} + 1` })
        .where(eq(linksTable.id, linkId)),
    ]);

    res.json({ success: true });
  } catch (err) { next(err); }
});

// ── Get analytics ─────────────────────────────────────────────────────────
router.get("/analytics", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;

    const userPages = await db.select({ id: pagesTable.id })
      .from(pagesTable).where(eq(pagesTable.userId, user.id));
    const pageIds = userPages.map(p => p.id);

    if (pageIds.length === 0) {
      res.json({ totalClicks: 0, totalLinks: 0, profileViews: user.profileViews ?? 0, clicksByDay: [], topLinks: [] }); return;
    }

    const userBlocks = await db.select({ id: blocksTable.id })
      .from(blocksTable)
      .where(sql`${blocksTable.pageId} = ANY(ARRAY[${sql.raw(pageIds.join(","))}]::int[])`);
    const blockIds = userBlocks.map(b => b.id);

    if (blockIds.length === 0) {
      res.json({ totalClicks: 0, totalLinks: 0, profileViews: user.profileViews ?? 0, clicksByDay: [], topLinks: [] }); return;
    }

    const userLinks = await db.select().from(linksTable)
      .where(sql`${linksTable.blockId} = ANY(ARRAY[${sql.raw(blockIds.join(","))}]::int[])`);
    const linkIds = userLinks.map(l => l.id);
    const totalClicks = userLinks.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let clicksByDay: Array<{ date: string; clicks: number }> = [];
    if (linkIds.length > 0) {
      const rawClicks = await db.select({
        date: sql<string>`DATE(${clicksTable.clickedAt})::text`,
        clicks: sql<number>`COUNT(*)`,
      }).from(clicksTable)
        .where(sql`${clicksTable.linkId} = ANY(ARRAY[${sql.raw(linkIds.join(","))}]::int[]) AND ${clicksTable.clickedAt} >= ${thirtyDaysAgo}`)
        .groupBy(sql`DATE(${clicksTable.clickedAt})`)
        .orderBy(sql`DATE(${clicksTable.clickedAt})`);
      clicksByDay = rawClicks.map(r => ({ date: r.date, clicks: Number(r.clicks) }));
    }

    const topLinks = [...userLinks]
      .sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))
      .slice(0, 5)
      .map(l => ({ linkId: l.id, title: l.title, url: l.url, clicks: l.clickCount ?? 0 }));

    res.json({
      totalClicks,
      totalLinks: userLinks.length,
      profileViews: user.profileViews ?? 0,
      clicksByDay,
      topLinks,
    });
  } catch (err) { next(err); }
});

// ── Dashboard stats ───────────────────────────────────────────────────────
router.get("/dashboard/stats", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;

    const userPages = await db.select({ id: pagesTable.id })
      .from(pagesTable).where(eq(pagesTable.userId, user.id));
    const pageIds = userPages.map(p => p.id);

    let totalLinks = 0, totalClicks = 0, recentClicks = 0;

    if (pageIds.length > 0) {
      const userBlocks = await db.select({ id: blocksTable.id })
        .from(blocksTable)
        .where(sql`${blocksTable.pageId} = ANY(ARRAY[${sql.raw(pageIds.join(","))}]::int[])`);
      const blockIds = userBlocks.map(b => b.id);

      if (blockIds.length > 0) {
        const userLinks = await db.select({ id: linksTable.id, clickCount: linksTable.clickCount })
          .from(linksTable)
          .where(sql`${linksTable.blockId} = ANY(ARRAY[${sql.raw(blockIds.join(","))}]::int[])`);
        totalLinks = userLinks.length;
        totalClicks = userLinks.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);

        if (userLinks.length > 0) {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const linkIds = userLinks.map(l => l.id);
          const [recentResult] = await db.select({ count: sql<number>`COUNT(*)` })
            .from(clicksTable)
            .where(sql`${clicksTable.linkId} = ANY(ARRAY[${sql.raw(linkIds.join(","))}]::int[]) AND ${clicksTable.clickedAt} >= ${sevenDaysAgo}`);
          recentClicks = Number(recentResult?.count ?? 0);
        }
      }
    }

    // Fetch fresh profileViews from DB
    const [freshUser] = await db.select({ profileViews: usersTable.profileViews })
      .from(usersTable).where(eq(usersTable.id, user.id)).limit(1);

    res.json({
      totalClicks, totalLinks,
      totalPages: userPages.length,
      recentClicks,
      profileViews: freshUser?.profileViews ?? 0,
    });
  } catch (err) { next(err); }
});

export default router;
