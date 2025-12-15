import { account, session, user, verificationToken } from "@/database/schema";
import { DrizzleAdapter as NextAuthDrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter } from "next-auth/adapters";
import { db } from "../database";

// Table mappings for Drizzle Adapter (customize as needed)
export function DrizzleAdapter(database: typeof db): Adapter {
  return NextAuthDrizzleAdapter(database, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }) as Adapter;
}

export const adapter = DrizzleAdapter(db);
