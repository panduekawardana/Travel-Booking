import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './src/config/env.js';

if(!DATABASE_URL) {
    throw new Error("Database is not configured in .env");
}

export default defineConfig({
    schema: "./src/db/schema/index.ts",
    out: "drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL,
    },
})