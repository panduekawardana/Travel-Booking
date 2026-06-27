import "dotenv/config";
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { DATABASE_URL } from "../config/env.js";
import * as schema from "./schema/index.js";

const pool = new Pool({ connectionString: DATABASE_URL, connectionTimeoutMillis: 30000 });
export const db = drizzle(pool, { schema });
