import { pgTable, uuid, decimal, jsonb, timestamp } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";
import { transactionStatusEnum } from "./user_deposit_history.schema";
import { relations } from "drizzle-orm";

export const userwithdrawalHistory = pgTable("user_withdrawal_history", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  details: jsonb("details").notNull(),
  status: transactionStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userWithdrawalHistoryRelations = relations(
  userwithdrawalHistory,
  ({ one }) => ({
    user: one(users, {
      fields: [userwithdrawalHistory.userId],
      references: [users.id],
    }),
  })
);
