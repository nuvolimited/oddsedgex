import {
  pgEnum,
  pgTable,
  uuid,
  decimal,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "success",
  "failed",
]);

export const userDepositHistory = pgTable("user_deposit_history", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: transactionStatusEnum("status").notNull().default("pending"),
  details: jsonb("details").notNull(),
  proof: text("proof").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userDepositHistoryRelations = relations(
  userDepositHistory,
  ({ one }) => ({
    user: one(users, {
      fields: [userDepositHistory.userId],
      references: [users.id],
    }),
  })
);
