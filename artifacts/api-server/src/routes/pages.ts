import { Router } from "express";
import { db } from "@workspace/db";
import { pagesTable, blocksTable, linksTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Get pages
router.get("/pages", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const pages = await db.select().from(pagesTable)
      .where(eq(pagesTable.userId, user.id))
      .orderBy(asc(pagesTable.id));
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// Create page
router.post("/pages", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "ناوی پەڕە پێویستە" });
      return;
    }

    const [page] = await db.insert(pagesTable).values({
      userId: user.id,
      title: title.trim(),
      isHome: false,
    }).returning();

    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

// Update page
router.put("/pages/:id", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ئایدی نادروست" });
      return;
    }

    const { title } = req.body;

    const [existing] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, id), eq(pagesTable.userId, user.id)))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "پەڕە نەدۆزرایەوە" });
      return;
    }

    const [updated] = await db.update(pagesTable)
      .set({ title })
      .where(eq(pagesTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete page
router.delete("/pages/:id", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "ئایدی نادروست" });
      return;
    }

    const [existing] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, id), eq(pagesTable.userId, user.id)))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "پەڕە نەدۆزرایەوە" });
      return;
    }

    if (existing.isHome) {
      res.status(400).json({ error: "پەڕەی سەرەکی ناتوانرێت بسڕدرێتەوە" });
      return;
    }

    await db.delete(pagesTable).where(eq(pagesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Get blocks for a page (with links)
router.get("/pages/:pageId/blocks", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
      res.status(400).json({ error: "ئایدی نادروست" });
      return;
    }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, pageId), eq(pagesTable.userId, user.id)))
      .limit(1);

    if (!page) {
      res.status(404).json({ error: "پەڕە نەدۆزرایەوە" });
      return;
    }

    const blocks = await db.select().from(blocksTable)
      .where(eq(blocksTable.pageId, pageId))
      .orderBy(asc(blocksTable.blockOrder));

    const blocksWithLinks = await Promise.all(blocks.map(async (block) => {
      const links = await db.select().from(linksTable)
        .where(eq(linksTable.blockId, block.id))
        .orderBy(asc(linksTable.linkOrder));
      return { ...block, links };
    }));

    res.json(blocksWithLinks);
  } catch (err) {
    next(err);
  }
});

// Create block
router.post("/pages/:pageId/blocks", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const pageId = parseInt(req.params.pageId);

    if (isNaN(pageId)) {
      res.status(400).json({ error: "ئایدی نادروست" });
      return;
    }

    const { type, title, content, isVisible } = req.body;

    if (!type) {
      res.status(400).json({ error: "جۆری بلۆک پێویستە" });
      return;
    }

    const [page] = await db.select().from(pagesTable)
      .where(and(eq(pagesTable.id, pageId), eq(pagesTable.userId, user.id)))
      .limit(1);

    if (!page) {
      res.status(404).json({ error: "پەڕە نەدۆزرایەوە" });
      return;
    }

    const existingBlocks = await db.select({ blockOrder: blocksTable.blockOrder })
      .from(blocksTable)
      .where(eq(blocksTable.pageId, pageId));
    const maxOrder = existingBlocks.reduce((max, b) => Math.max(max, b.blockOrder), -1);

    const [block] = await db.insert(blocksTable).values({
      pageId,
      type,
      title: title || type,
      content,
      blockOrder: maxOrder + 1,
      isVisible: isVisible ?? true,
    }).returning();

    res.status(201).json({ ...block, links: [] });
  } catch (err) {
    next(err);
  }
});

export default router;
