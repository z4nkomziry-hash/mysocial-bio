import { Router } from "express";
import { db } from "@workspace/db";
import { linksTable, blocksTable, pagesTable, clicksTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Get links
router.get("/links", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const blockId = req.query.blockId ? parseInt(req.query.blockId as string) : undefined;

  if (blockId) {
    const [block] = await db.select({ id: blocksTable.id, pageId: blocksTable.pageId })
      .from(blocksTable).where(eq(blocksTable.id, blockId)).limit(1);
    if (!block) { res.json([]); return; }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
    if (!page) { res.json([]); return; }

    const links = await db.select().from(linksTable)
      .where(eq(linksTable.blockId, blockId))
      .orderBy(asc(linksTable.linkOrder));
    res.json(links);
  } else {
    res.json([]);
  }
});

// Create link
router.post("/links", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { blockId, title, url, icon } = req.body;

  if (!blockId || !title || !url) {
    res.status(400).json({ error: "بلۆک، ناو و بەستەر پێویستن" });
    return;
  }

  const [block] = await db.select({ id: blocksTable.id, pageId: blocksTable.pageId })
    .from(blocksTable).where(eq(blocksTable.id, blockId)).limit(1);
  if (!block) { res.status(404).json({ error: "بلۆک نەدۆزرایەوە" }); return; }

  const [page] = await db.select().from(pagesTable)
    .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id))).limit(1);
  if (!page) { res.status(403).json({ error: "دەسەڵات نییە" }); return; }

  const existingLinks = await db.select({ linkOrder: linksTable.linkOrder })
    .from(linksTable).where(eq(linksTable.blockId, blockId));
  const maxOrder = existingLinks.reduce((max, l) => Math.max(max, l.linkOrder), -1);

  const [link] = await db.insert(linksTable).values({
    blockId,
    title,
    url,
    icon,
    linkOrder: maxOrder + 1,
    clickCount: 0,
  }).returning();

  res.status(201).json(link);
});

// Update link
router.put("/links/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const id = parseInt(req.params.id);
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
  if (url !== undefined) updates.url = url;
  if (icon !== undefined) updates.icon = icon;
  if (linkOrder !== undefined) updates.linkOrder = linkOrder;

  const [updated] = await db.update(linksTable)
    .set(updates).where(eq(linksTable.id, id)).returning();
  res.json(updated);
});

// Delete link
router.delete("/links/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const id = parseInt(req.params.id);

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
});

export default router;
