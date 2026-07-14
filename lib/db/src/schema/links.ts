import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { blocksTable } from "./blocks";

export const linksTable = pgTable("links", {
  id: serial("id").primaryKey(),
  blockId: integer("block_id").notNull().references(() => blocksTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  linkOrder: integer("link_order").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLinkSchema = createInsertSchema(linksTable).omit({
  id: true,
  createdAt: true,
});
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof linksTable.$inferSelect;
