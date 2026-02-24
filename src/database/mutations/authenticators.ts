import { and, eq } from "drizzle-orm";

import { db as database } from "@/database/db";
import { authenticator } from "@/database/schema";

// ═══════════════════════════════════════════════════
// AUTHENTICATOR MUTATIONS
// ═══════════════════════════════════════════════════

export async function createAuthenticator(data: {
  counter: number;
  credentialBackedUp: boolean;
  credentialDeviceType: string;
  credentialID: string;
  credentialPublicKey: string;
  providerAccountId: string;
  transports?: null | string;
  userId: string;
}): Promise<typeof authenticator.$inferSelect | undefined> {
  const [newAuthenticator] = await database.insert(authenticator).values(data).returning();
  return newAuthenticator;
}

export async function updateAuthenticator(
  userId: string,
  credentialID: string,
  data: {
    counter?: number;
    credentialBackedUp?: boolean;
    transports?: null | string;
  }
): Promise<typeof authenticator.$inferSelect | undefined> {
  const [updatedAuthenticator] = await database
    .update(authenticator)
    .set(data)
    .where(and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)))
    .returning();
  return updatedAuthenticator;
}

export async function deleteAuthenticator(
  userId: string,
  credentialID: string
): Promise<typeof authenticator.$inferSelect | undefined> {
  const [deletedAuthenticator] = await database
    .delete(authenticator)
    .where(and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)))
    .returning();
  return deletedAuthenticator;
}

export async function deleteAuthenticatorsByUserId(
  userId: string
): Promise<(typeof authenticator.$inferSelect)[]> {
  return await database.delete(authenticator).where(eq(authenticator.userId, userId)).returning();
}
