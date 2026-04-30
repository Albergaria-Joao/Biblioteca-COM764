// auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    // Só entra Google se o e-mail estiver no banco previamente cadastrado
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        if (!profile?.email_verified) return false;
        if (!user.email) return false;
        //Deve fazer alerta de que usuer nãe existe ou ainda não foi aprovado
        const usuarioExiste = await prisma.usuario.findUnique({
          where: { email: user.email},
        });

        if (!usuarioExiste) {
          await prisma.usuario.create({
            data: {
              email: user.email,
              nome: user.name ?? "Usuário",
              status: "ESPERA", // Ele entra em espera até completar o perfil
              cargo: "USER",
            },
          });
        }

        return !!usuarioExiste; // Retorna true se existe, false se não
      }
      return true;
    },

    // Injeta ID e Cargo no token criptografado do JWT
    async jwt({ token, user, account }) {
      if (account && user) {
        // Buscamos o usuário no banco para garantir os dados mais recentes
        const dbUser = await prisma.usuario.findUnique({
          where: { email: user.email! },
          select: { id: true, cargo: true }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.cargo = dbUser.cargo;
        }
      }
      return token;
    },

    // Retorna a sessão para o frontend conseguir pegar, com esses dados do user
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.cargo = token.cargo as string;
      }
      return session;
    },
  },
  // Sobrescrevemos o authorize do auth.config com essa lógica de validação, que é a da API de login (inutilizada agora)
  providers: [
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string, status:{not: "ESPERA"} },
        });

        if (!user || !user.senha) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.senha);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.nome, cargo: user.cargo };
      },
    }),
  ],
});