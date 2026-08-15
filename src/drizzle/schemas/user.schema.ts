import { relations } from "drizzle-orm";
import {
  foreignKey,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import {
  notifications,
  agentLocations,
  userwithdrawalHistory,
  userDepositHistory,
  userFunds,
  arbitrageGameBets,
  agents,
} from "@/drizzle/schemas";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => v7()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).notNull().unique(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    referralCode: varchar("referral_code", { length: 8 }).notNull().unique(),
    referrerId: uuid("referrer_id"),
    role: roleEnum("role").notNull().default("user"),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  ({ referrerId, id }) => [
    foreignKey({ columns: [referrerId], foreignColumns: [id] }).onDelete(
      "set null"
    ),
  ]
);

export const usersRelations = relations(users, ({ one, many }) => ({
  referrer: one(users, {
    fields: [users.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referrals: many(users, {
    relationName: "referrer",
  }),
  agent: one(agents),
  notifications: many(notifications),
  agentLocations: many(agentLocations),
  withdrawalHistory: many(userwithdrawalHistory),
  depositHistory: many(userDepositHistory),
  funds: one(userFunds),
  betHistory: many(arbitrageGameBets),
}));
