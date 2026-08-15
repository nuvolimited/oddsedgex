import { jsonb, pgTable, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";
import { paymentOptionTypeEnum } from "@/drizzle/schemas";
import { relations } from "drizzle-orm";

export const userFundsWithdrawalOptions = pgTable(
  "user_funds_withdrawal_options",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => v7()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: paymentOptionTypeEnum("type").notNull().default("bank"),
    details: jsonb("details").notNull(),
  }
);

export const userFundsWithdrawalOptionRelations = relations(
  userFundsWithdrawalOptions,
  ({ one }) => ({
    user: one(users, {
      fields: [userFundsWithdrawalOptions.userId],
      references: [users.id],
    }),
  })
);
