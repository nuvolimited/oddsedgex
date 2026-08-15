import {
  pgEnum,
  pgTable,
  uuid,
  decimal,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";
import { arbitrageGames } from "./arbitrage_game.scheme";
import { relations } from "drizzle-orm";

export const betStatusEnum = pgEnum("bet_status", ["pending", "paid"]);

export const arbitrageGameBets = pgTable("arbitrage_game_bets", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gameId: uuid("game_id")
    .notNull()
    .references(() => arbitrageGames.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  bookingCode: varchar("booking_code", { length: 8 }).notNull().unique(),
  status: betStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const arbitrageGameBetsRelations = relations(
  arbitrageGameBets,
  ({ one }) => ({
    user: one(users, {
      fields: [arbitrageGameBets.userId],
      references: [users.id],
      relationName: "user",
    }),
    game: one(arbitrageGames, {
      fields: [arbitrageGameBets.gameId],
      relationName: "game",
      references: [arbitrageGames.id],
    }),
  }),
);
