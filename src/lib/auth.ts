// keep auth options loosely typed here to avoid hard dependency on a specific Auth type
import { user } from "@/database/schema";
import { DrizzleAdapter } from "@/lib/authAdapter";
import { authOptions } from "@/lib/authConfig";
import { signInSchema } from "@/lib/validator";
import bcrypt from "bcryptjs";
import type { Database } from "db";
import { db } from "db";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export function getAuthOptions(): unknown {
  return authOptions as unknown;
}

export default getAuthOptions;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db as unknown as Database),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/register",
    signOut: "/sign-out",
    error: "/error",
    verifyRequest: "/verify-request",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>> | undefined) {
        try {
          const { email, password } = signInSchema.parse(credentials);

          const existingUser = await db.query.user.findFirst({
            where: eq(user.email, email),
          });

          if (!existingUser?.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, existingUser.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image,
            role: existingUser.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user: jwtUser,
    }: {
      token: Record<string, unknown>;
      user?: Record<string, unknown>;
    }) {
      if (jwtUser?.id) {
        token.role = jwtUser.role;
        token.id = jwtUser.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Record<string, unknown>;
      token: Record<string, unknown>;
    }) {
      if (session.user && token.id) {
        (session.user as Record<string, unknown>).role = token.role as
          | "user"
          | "admin"
          | "moderator";
        (session.user as Record<string, unknown>).id = token.id as string;
      }
      return session;
    },
  },
});
