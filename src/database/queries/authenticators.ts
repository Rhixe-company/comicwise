import { database } from "@/database";
import { authenticator } from "@/database/schema";
import { and, eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// AUTHENTICATOR QUERIES
// ═══════════════════════════════════════════════════

export async function getAuthenticatorByCredentialId(credentialID: string) {
  return await database.query.authenticator.findFirst({
    where: eq(authenticator.credentialID, credentialID),
  });
}

export async function getAuthenticatorsByUserId(userId: string) {
  return await database.query.authenticator.findMany({
    where: eq(authenticator.userId, userId),
  });
}

export async function getAuthenticator(userId: string, credentialID: string) {
  return await database.query.authenticator.findFirst({
    where: and(eq(authenticator.userId, userId), eq(authenticator.credentialID, credentialID)),
  });
}
