import { Router } from "express";
import { db } from "@workspace/db";
import { blocksTable, linksTable, pagesTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Reorder blocks — MUST be defined before /blocks/:id to avoid "reorder"
// being swallowed by the /:id param route
router.put("/blocks/reorder", requireAuth, async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "داتا هەڵەیە" });
      return;
    }

    await Promise.all(
      items.map(({ id, blockOrder }: { id: number; blockOrder: number }) =>
        db.update(blocksTable).set({ blockOrder }).where(eq(blocksTable.id, id))
      )
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Update block
router.put("/blocks/:id", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ئایدی نادروست" });
      return;
    }

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
  } catch (err) {
    next(err);
  }
});

// Delete block (also deletes associated links)
router.delete("/blocks/:id", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ئایدی نادروست" });
      return;
    }

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

    // Delete associated links before deleting the block
    await db.delete(linksTable).where(eq(linksTable.blockId, id));
    await db.delete(blocksTable).where(eq(blocksTable.id, id));

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
