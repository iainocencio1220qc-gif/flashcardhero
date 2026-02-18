import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const decks = pgTable("decks", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id"),
  title: text("title").notNull(),
  description: text("description"),
  themeColor: text("theme_color").default("#6366f1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  deckId: uuid("deck_id").references(() => decks.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id"),
  front: text("front").notNull(),
  back: text("back").notNull(),
  interval: integer("interval").default(0),
  repetition: integer("repetition").default(0),
  easeFactor: doublePrecision("ease_factor").default(2.5),
  nextReview: timestamp("next_review").defaultNow(),
});

export type Deck = typeof decks.$inferSelect;
export type NewDeck = typeof decks.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
