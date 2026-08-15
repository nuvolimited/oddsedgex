import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";
import "@/env.config";

const connectionString = process.env.DATABASE_URL as string;

export const db = drizzle({
  client: postgres(connectionString),
  schema,
  logger: true,
});