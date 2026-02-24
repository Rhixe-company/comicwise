import type { User as DatabaseUser } from "@/typesdatabase";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      id: string;
      image?: null | string;
      name?: null | string;
      role: "admin" | "moderator" | "user";
    };
  }

  interface User extends DatabaseUser {
    role: "admin" | "moderator" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "moderator" | "user";
  }
}
