import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";

// Add types to the global scope
declare global {
  var db: ReturnType<typeof drizzle> | undefined;
}

// In development, we use `global` to persist the connection across HMR
// In production, we create a new connection for each instance
const sql = neon(env.DATABASE_URL);
const db = global.db || drizzle({ client: sql });

// During development or test, save the connection for reuse
if (env.NODE_ENV !== "production") global.db = db;

export default db;
