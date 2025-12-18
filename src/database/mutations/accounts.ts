import { and, eq } from "drizzle-orm";

import { db as database } from "@/database/db";
import { account } from "@/database/schema";

// ═══════════════════════════════════════════════════
// ACCOUNT MUTATIONS
// ═══════════════════════════════════════════════════

/**
 *
 * @param data
 * @param data.userId
 * @param data.type
 * @param data.provider
 * @param data.providerAccountId
 * @param data.refresh_token
 * @param data.access_token
 * @param data.expires_at
 * @param data.token_type
 * @param data.scope
 * @param data.id_token
 * @param data.session_state
 */
export async function createAccount(data: {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}): Promise<typeof account.$inferSelect | undefined> {
  const [newAccount] = await database.insert(account).values(data).returning();
  return newAccount;
}

/**
 *
 * @param provider
 * @param providerAccountId
 * @param data
 * @param data.refresh_token
 * @param data.access_token
 * @param data.expires_at
 * @param data.token_type
 * @param data.scope
 * @param data.id_token
 * @param data.session_state
 */
export async function updateAccount(
  provider: string,
  providerAccountId: string,
  data: {
    refresh_token?: string | null;
    access_token?: string | null;
    expires_at?: number | null;
    token_type?: string | null;
    scope?: string | null;
    id_token?: string | null;
    session_state?: string | null;
  }
): Promise<typeof account.$inferSelect | undefined> {
  const [updatedAccount] = await database
    .update(account)
    .set(data)
    .where(and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)))
    .returning();
  return updatedAccount;
}

/**
 *
 * @param provider
 * @param providerAccountId
 */
export async function deleteAccount(
  provider: string,
  providerAccountId: string
): Promise<typeof account.$inferSelect | undefined> {
  const [deletedAccount] = await database
    .delete(account)
    .where(and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)))
    .returning();
  return deletedAccount;
}

/**
 *
 * @param userId
 */
export async function deleteAccountsByUserId(
  userId: string
): Promise<(typeof account.$inferSelect)[]> {
  return await database.delete(account).where(eq(account.userId, userId)).returning();
}
