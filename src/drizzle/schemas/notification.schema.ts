import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const notifications = pgTable("notifications", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  seen: boolean("seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
