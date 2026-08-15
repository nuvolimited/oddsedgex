import { pgTable, uuid, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const predictionGames = pgTable("prediction_games", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  event: jsonb("event").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
});
