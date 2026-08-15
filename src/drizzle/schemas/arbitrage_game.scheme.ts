import {
  pgTable,
  uuid,
  decimal,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const arbitrageGames = pgTable("arbitrage_games", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  event: jsonb("event").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  minBet: decimal("min_bet", { precision: 10, scale: 2 })
    .notNull()
    .default("100.00"),
  maxBet: decimal("max_bet", { precision: 10, scale: 2 }),
  outcome: varchar("outcome", { length: 255 }),
  expiresAt: timestamp("expires_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
