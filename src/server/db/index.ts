import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";

// Add types to the global scope
declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof drizzle> | undefined;
}

// In development, we use `global` to persist the connection across HMR
// In production, we create a new connection for each instance
const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = global.db ?? drizzle({ client: pool });

// During development or test, save the connection for reuse
if (env.NODE_ENV !== "production") global.db = db;

export default db;
