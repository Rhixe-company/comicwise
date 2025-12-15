// Use `unknown` for the exported options to avoid coupling to a specific auth package type
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../database";
import { DrizzleAdapter } from "./authAdapter";

export const authOptions: Record<string, unknown> = {
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(_credentials) {
        // TODO: Implement user lookup and password check
        return null;
      },
    }),
    // Optional Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn() {
      // TODO: Add custom signIn logic
      return true;
    },
    async jwt({ token }: { token: Record<string, unknown> }) {
      // TODO: Add custom JWT logic
      return token;
    },
    async session({ session }: { session: Record<string, unknown> }) {
      // TODO: Add custom session logic
      return session;
    },
  },
  csrf: {
    // Secure settings for CSRF
    // TODO: Add CSRF config if needed
  },
  // Add any other secure settings as needed
};

export default authOptions;
