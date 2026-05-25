// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      // Aqui, deixamos vazio. Ele vai receber a função authorize do auth.ts
      // Essa separação se deve a um conflito que eu encontrei entre o NextAuth e o Prisma. Aí não dá pra chamar direto do Middleware,
      // então precisa chamar por aqui (que não tem contato com o Prisma), e depois passar a função real lá no auth.ts
      async authorize() {
        return null;
      },
    }),
    
  ],
  pages: {
    error: "/error",
  }
} satisfies NextAuthConfig;