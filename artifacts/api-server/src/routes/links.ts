import { Router } from "express";
import { db } from "@workspace/db";
import { linksTable, blocksTable, pagesTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Get links for a block
router.get("/links", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const blockId = req.query.blockId ? parseInt(req.query.blockId as string) : undefined;
    if (!blockId || isNaN(blockId)) { res.status(400).json({ error: "blockId پێویستە" }); return; }

    const [block] = await db.select({ id: blocksTable.id, pageId: blocksTable.pageId })
      .from(blocksTable).where(eq(blocksTable.id, blockId)).limit(1);
    if (!block) { res.json([]); return; }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
    if (!page) { res.status(403).json({ error: "دەسەڵات نییە" }); return; }

    const links = await db.select().from(linksTable)
      .where(eq(linksTable.blockId, blockId))
      .orderBy(asc(linksTable.linkOrder));
    res.json(links);
  } catch (err) { next(err); }
});

// Create link
router.post("/links", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { blockId, title, url, icon } = req.body;
    if (!blockId || !title || !url) { res.status(400).json({ error: "بلۆک، ناو و بەستەر پێویستن" }); return; }

    try { new URL(url.startsWith("http") ? url : `https://${url}`); }
    catch { res.status(400).json({ error: "بەستەرەکە نادروستە" }); return; }

    const [block] = await db.select({ id: blocksTable.id, pageId: blocksTable.pageId })
      .from(blocksTable).where(eq(blocksTable.id, blockId)).limit(1);
    if (!block) { res.status(404).json({ error: "بلۆک نەدۆزرایەوە" }); return; }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
    if (!page) { res.status(403).json({ error: "دەسەڵات نییە" }); return; }

    const existingLinks = await db.select({ linkOrder: linksTable.linkOrder })
      .from(linksTable).where(eq(linksTable.blockId, blockId));
    const maxOrder = existingLinks.reduce((max, l) => Math.max(max, l.linkOrder), -1);

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    const [link] = await db.insert(linksTable).values({
      blockId, title, url: normalizedUrl, icon,
      linkOrder: maxOrder + 1, clickCount: 0,
    }).returning();
    res.status(201).json(link);
  } catch (err) { next(err); }
});

// ── Reorder links — MUST be above /:id ───────────────────────────────────
router.put("/links/reorder", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { items } = req.body as { items: Array<{ id: number; linkOrder: number }> };

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "items پێویستە" }); return;
    }

    // Verify first link belongs to this user
    const [firstLink] = await db.select().from(linksTable)
      .where(eq(linksTable.id, items[0].id)).limit(1);
    if (!firstLink) { res.status(404).json({ error: "بەستەر نەدۆزرایەوە" }); return; }

    const [block] = await db.select({ pageId: blocksTable.pageId })
      .from(blocksTable).where(eq(blocksTable.id, firstLink.blockId)).limit(1);
    if (!block) { res.status(404).json({ error: "بلۆک نەدۆزرایەوە" }); return; }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
    if (!page) { res.status(403).json({ error: "دەسەڵات نییە" }); return; }

    await Promise.all(
      items.map(({ id, linkOrder }) =>
        db.update(linksTable).set({ linkOrder }).where(eq(linksTable.id, id))
      )
    );

    res.json({ success: true });
  } catch (err) { next(err); }
});

// Update link
router.put("/links/:id", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "ئایدی نادروست" }); return; }

    const { title, url, icon, linkOrder } = req.body;

    const [link] = await db.select().from(linksTable).where(eq(linksTable.id, id)).limit(1);
    if (!link) { res.status(404).json({ error: "بەستەر نەدۆزرایەوە" }); return; }

    const [block] = await db.select({ pageId: blocksTable.pageId })
      .from(blocksTable).where(eq(blocksTable.id, link.blockId)).limit(1);
    if (!block) { res.status(404).json({ error: "بلۆک نەدۆزرایەوە" }); return; }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
    if (!page) { res.status(403).json({ error: "دەسەڵات نییە" }); return; }

    const updates: Partial<typeof linksTable.$inferInsert> = {};
    if (title !== undefined) updates.title = title;
    if (url !== undefined) updates.url = url.startsWith("http") ? url : `https://${url}`;
    if (icon !== undefined) updates.icon = icon;
    if (linkOrder !== undefined) updates.linkOrder = linkOrder;

    const [updated] = await db.update(linksTable).set(updates).where(eq(linksTable.id, id)).returning();
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete link
router.delete("/links/:id", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "ئایدی نادروست" }); return; }

    const [link] = await db.select().from(linksTable).where(eq(linksTable.id, id)).limit(1);
    if (!link) { res.status(404).json({ error: "بەستەر نەدۆزرایەوە" }); return; }

    const [block] = await db.select({ pageId: blocksTable.pageId })
      .from(blocksTable).where(eq(blocksTable.id, link.blockId)).limit(1);
    if (!block) { res.status(404).json({ error: "بلۆک نەدۆزرایەوە" }); return; }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
    if (!page) { res.status(403).json({ error: "دەسەڵات نییە" }); return; }

    await db.delete(linksTable).where(eq(linksTable.id, id));
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
