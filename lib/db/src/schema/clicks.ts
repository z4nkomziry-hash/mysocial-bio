import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { linksTable } from "./links";

export const clicksTable = pgTable("clicks", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").notNull().references(() => linksTable.id, { onDelete: "cascade" }),
  username: text("username"),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

export const insertClickSchema = createInsertSchema(clicksTable).omit({
  id: true,
  clickedAt: true,
});
export type InsertClick = z.infer<typeof insertClickSchema>;
export type Click = typeof clicksTable.$inferSelect;
