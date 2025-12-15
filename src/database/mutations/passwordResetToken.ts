import { database } from "@/database";
import { passwordResetToken } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function createPasswordResetToken(data: {
  email: string;
  token: string;
  expires: Date;
}) {
  const [newToken] = await database
    .insert(passwordResetToken)
    .values({
      email: data.email,
      token: data.token,
      expires: data.expires,
    })
    .returning();
  return newToken;
}

export async function deletePasswordResetToken(token: string) {
  const [deletedToken] = await database
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.token, token))
    .returning();
  return deletedToken;
}

export async function deletePasswordResetTokensByEmail(email: string) {
  const deletedTokens = await database
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.email, email))
    .returning();
  return deletedTokens;
}
