import db from "@/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()],
  secret: env.BETTER_AUTH_SECRET,
}); 
