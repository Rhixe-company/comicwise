import { DrizzleAdapter as NextAuthDrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter } from "next-auth/adapters";

import { account, session, user, verificationToken } from "#schema";

/**
 * Initialize Drizzle ORM adapter for NextAuth v5
 * Maps Drizzle schema tables to NextAuth tables
 * @param database
 */
export function DrizzleAdapter(database: any): Adapter {
  return NextAuthDrizzleAdapter(database, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }) as Adapter;
}
