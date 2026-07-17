import { Router } from "express";
import { db } from "@workspace/db";
import { linksTable, clicksTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

/**
 * Server-side click redirect — more reliable than firing a POST from the browser
 * before window.open(). Increments the click counter then 302-redirects.
 *
 * GET /r/:linkId
 */
router.get("/r/:linkId", async (req, res, next) => {
  try {
    const linkId = parseInt(req.params.linkId, 10);
    if (isNaN(linkId)) { res.status(400).send("Bad Request"); return; }

    const [link] = await db.select().from(linksTable).where(eq(linksTable.id, linkId)).limit(1);
    if (!link) { res.status(404).send("Not Found"); return; }

    // Record click fire-and-forget
    Promise.all([
      db.insert(clicksTable).values({ linkId, username: null }),
      db.update(linksTable)
        .set({ clickCount: sql`${linksTable.clickCount} + 1` })
        .where(eq(linksTable.id, linkId)),
    ]).catch(() => { /* ignore */ });

    res.redirect(302, link.url);
  } catch (err) { next(err); }
});

export default router;
