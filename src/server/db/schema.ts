import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// TODO: delete-later
export const entriesTable = pgTable("entries", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Entry = typeof entriesTable.$inferSelect;
export type NewEntry = typeof entriesTable.$inferInsert;
