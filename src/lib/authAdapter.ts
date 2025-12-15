import type { Database } from "@/database/db";
import { account, session, user, verificationToken } from "@/database/schema";
import { DrizzleAdapter as NextAuthDrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter } from "next-auth/adapters";

/**
 * Initialize Drizzle ORM adapter for NextAuth v5
 * Maps Drizzle schema tables to NextAuth tables
 */
export function DrizzleAdapter(database: Database): Adapter {
  return NextAuthDrizzleAdapter(database, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }) as Adapter;
}
