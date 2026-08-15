import { defineConfig } from "drizzle-kit";
import "./src/env.config";

const { DATABASE_URL } = process.env;

export default defineConfig({
  schema: "./src/drizzle/schemas",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
