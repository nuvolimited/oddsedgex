import { loadEnvConfig } from "@next/env";

// Load environment variables from .env files
// See https://nextjs.org/docs/app/guides/environment-variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);
