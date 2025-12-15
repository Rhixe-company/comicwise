import { database } from "@/database";
import { session } from "@/database/schema";
import { eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// SESSION MUTATIONS
// ═══════════════════════════════════════════════════

export async function createSession(data: { sessionToken: string; userId: string; expires: Date }) {
  const [newSession] = await database.insert(session).values(data).returning();
  return newSession;
}

export async function updateSession(sessionToken: string, data: { expires?: Date }) {
  const [updatedSession] = await database
    .update(session)
    .set(data)
    .where(eq(session.sessionToken, sessionToken))
    .returning();
  return updatedSession;
}

export async function deleteSession(sessionToken: string) {
  const [deletedSession] = await database
    .delete(session)
    .where(eq(session.sessionToken, sessionToken))
    .returning();
  return deletedSession;
}

export async function deleteSessionsByUserId(userId: string) {
  return await database.delete(session).where(eq(session.userId, userId)).returning();
}

export async function deleteExpiredSessions() {
  const now = new Date();
  return await database.delete(session).where(eq(session.expires, now)).returning();
}
