import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  isHome: boolean("is_home").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPageSchema = createInsertSchema(pagesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pagesTable.$inferSelect;
