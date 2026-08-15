import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";

export const agentLocations = pgTable("agent_locations", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  state: varchar("state", { length: 255 }).notNull(),
  lga: varchar("lga", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  address: text("address").notNull(),
});
