import { Router } from "express";
import { db } from "@workspace/db";
import { blocksTable, linksTable, pagesTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Update block
router.put("/blocks/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const id = parseInt(req.params.id);
  const { title, content, isVisible } = req.body;

  const [block] = await db.select({
    id: blocksTable.id,
    pageId: blocksTable.pageId,
  }).from(blocksTable).where(eq(blocksTable.id, id)).limit(1);

  if (!block) {
    res.status(404).json({ error: "بلۆک نەدۆزرایەوە" });
    return;
  }

  const [page] = await db.select().from(pagesTable)
    .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id)))
    .limit(1);

  if (!page) {
    res.status(403).json({ error: "دەسەڵات نییە" });
    return;
  }

  const updates: Partial<typeof blocksTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (isVisible !== undefined) updates.isVisible = isVisible;

  const [updated] = await db.update(blocksTable)
    .set(updates)
    .where(eq(blocksTable.id, id))
    .returning();

  const links = await db.select().from(linksTable)
    .where(eq(linksTable.blockId, id))
    .orderBy(asc(linksTable.linkOrder));

  res.json({ ...updated, links });
});

// Delete block
router.delete("/blocks/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const id = parseInt(req.params.id);

  const [block] = await db.select({ id: blocksTable.id, pageId: blocksTable.pageId })
    .from(blocksTable).where(eq(blocksTable.id, id)).limit(1);

  if (!block) {
    res.status(404).json({ error: "بلۆک نەدۆزرایەوە" });
    return;
  }

  const [page] = await db.select().from(pagesTable)
    .where(and(eq(pagesTable.id, block.pageId), eq(pagesTable.userId, user.id)))
    .limit(1);

  if (!page) {
    res.status(403).json({ error: "دەسەڵات نییە" });
    return;
  }

  await db.delete(blocksTable).where(eq(blocksTable.id, id));
  res.json({ success: true });
});

// Reorder blocks
router.put("/blocks/reorder", requireAuth, async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400).json({ error: "داتا هەڵەیە" });
    return;
  }

  await Promise.all(items.map(({ id, blockOrder }: { id: number; blockOrder: number }) =>
    db.update(blocksTable).set({ blockOrder }).where(eq(blocksTable.id, id))
  ));

  res.json({ success: true });
});

export default router;
