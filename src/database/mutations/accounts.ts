import { and, eq } from "drizzle-orm";

import { db as database } from "@/database/db";
import { account } from "@/database/schema";

import type { AdapterAccountType } from "next-auth/adapters";

// ═══════════════════════════════════════════════════
// ACCOUNT MUTATIONS
// ═══════════════════════════════════════════════════

/**
 *
 * param data
 * param data.userId
 * param data.type
 * param data.provider
 * param data.providerAccountId
 * param data.refreshToken
 * param data.accessToken
 * param data.expiresAt
 * param data.tokenType
 * param data.scope
 * param data.idToken
 * param data.sessionState
 * @param data
 * @param data.userId
 * @param data.type
 * @param data.provider
 * @param data.providerAccountId
 * @param data.refreshToken
 * @param data.accessToken
 * @param data.expiresAt
 * @param data.tokenType
 * @param data.scope
 * @param data.idToken
 * @param data.sessionState
 */
export async function createAccount(data: {
  accessToken?: null | string;
  expiresAt?: null | number;
  idToken?: null | string;
  provider: string;
  providerAccountId: string;
  refreshToken?: null | string;
  scope?: null | string;
  sessionState?: null | string;
  tokenType?: null | string;
  type: AdapterAccountType;
  userId: string;
}): Promise<typeof account.$inferSelect | undefined> {
  const [newAccount] = await database.insert(account).values(data).returning();
  return newAccount;
}

/**
 *
 * param provider
 * param providerAccountId
 * param data
 * param data.refreshToken
 * param data.accessToken
 * param data.expiresAt
 * param data.tokenType
 * param data.scope
 * param data.idToken
 * param data.sessionState
 * @param provider
 * @param providerAccountId
 * @param data
 * @param data.refreshToken
 * @param data.accessToken
 * @param data.expiresAt
 * @param data.tokenType
 * @param data.scope
 * @param data.idToken
 * @param data.sessionState
 */
export async function updateAccount(
  provider: string,
  providerAccountId: string,
  data: {
    accessToken?: null | string;
    expiresAt?: null | number;
    idToken?: null | string;
    refreshToken?: null | string;
    scope?: null | string;
    sessionState?: null | string;
    tokenType?: null | string;
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
 * param provider
 * param providerAccountId
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
 * param userId
 * @param userId
 */
export async function deleteAccountsByUserId(
  userId: string
): Promise<(typeof account.$inferSelect)[]> {
  return await database.delete(account).where(eq(account.userId, userId)).returning();
}
