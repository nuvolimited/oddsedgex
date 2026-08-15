import { pgTable, uuid, decimal } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const userFunds = pgTable("user_funds", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
});

export const userFundsRelations = relations(userFunds, ({ one }) => ({
  user: one(users, {
    fields: [userFunds.userId],
    references: [users.id],
  }),
}));
