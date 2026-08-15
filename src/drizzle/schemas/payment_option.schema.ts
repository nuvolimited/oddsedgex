import { jsonb, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const paymentOptionTypeEnum = pgEnum("payment_option_type", [
  "bank",
  "crypto",
]);

export const paymentOptions = pgTable("payment_options", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  type: paymentOptionTypeEnum("type").notNull().default("bank"),
  details: jsonb("details").notNull(),
});
