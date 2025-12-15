import { database } from "@/database";
import { authenticator } from "@/database/schema";
import { and, eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// AUTHENTICATOR MUTATIONS
// ═══════════════════════════════════════════════════

export async function createAuthenticator(data: {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string | null;
}) {
  const [newAuthenticator] = await database.insert(authenticator).values(data).returning();
  return newAuthenticator;
}

export async function updateAuthenticator(
  userId: string,
  credentialID: string,
  data: {
    counter?: number;
    credentialBackedUp?: boolean;
    transports?: string | null;
  }
) {
  const [updatedAuthenticator] = await database
    .update(authenticator)
    .set(data)
    .where(and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)))
    .returning();
  return updatedAuthenticator;
}

export async function deleteAuthenticator(userId: string, credentialID: string) {
  const [deletedAuthenticator] = await database
    .delete(authenticator)
    .where(and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)))
    .returning();
  return deletedAuthenticator;
}

export async function deleteAuthenticatorsByUserId(userId: string) {
  return await database.delete(authenticator).where(eq(authenticator.userId, userId)).returning();
}
