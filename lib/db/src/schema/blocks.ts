import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { pagesTable } from "./pages";

export const blocksTable = pgTable("blocks", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull().references(() => pagesTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // header, links, follower_count, contact_form, digital_products, text
  title: text("title").notNull(),
  content: text("content"),
  blockOrder: integer("block_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlockSchema = createInsertSchema(blocksTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocksTable.$inferSelect;
