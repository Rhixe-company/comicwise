import { database } from "@/database";
import { account } from "@/database/schema";
import { and, eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// ACCOUNT QUERIES
// ═══════════════════════════════════════════════════

export async function getAccountByProvider(userId: string, provider: string) {
  return await database.query.account.findFirst({
    where: and(eq(account.userId, userId), eq(account.provider, provider)),
  });
}

export async function getAccountsByUserId(userId: string) {
  return await database.query.account.findMany({
    where: eq(account.userId, userId),
  });
}

export async function getAccountByProviderAccountId(provider: string, providerAccountId: string) {
  return await database.query.account.findFirst({
    where: and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)),
  });
}
