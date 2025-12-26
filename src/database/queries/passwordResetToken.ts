import { db as database } from "db";
import { eq } from "drizzle-orm";
import { passwordResetToken } from "schema";

export async function getPasswordResetToken(token: string) {
  return await database.query.passwordResetToken.findFirst({
    where: eq(passwordResetToken.token, token),
  });
}

export async function getValidPasswordResetToken(token: string) {
  return await database.query.passwordResetToken.findFirst({
    where: eq(passwordResetToken.token, token),
  });
}

export async function getPasswordResetTokensByEmail(email: string) {
  return await database.query.passwordResetToken.findMany({
    where: eq(passwordResetToken.email, email),
  });
}
