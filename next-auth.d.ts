import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userId: string;
      cargo: string;
    } & DefaultSession["user"]
  }

  interface User {
    cargo: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userId: string;
    cargo: string;
  }
}