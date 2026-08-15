import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const kycVerificationStatusEnum = pgEnum("kyc_verification_status", [
  "pending",
  "verified",
  "rejected",
]);

export const agents = pgTable("agents", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  phone: varchar("phone", { length: 15 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  address: text("address").notNull(),
  kyc: jsonb("kyc"),
  status: kycVerificationStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agentRelations = relations(agents, ({ one }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
}));
