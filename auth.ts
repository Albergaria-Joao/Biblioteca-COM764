
import NextAuth from "next-auth"; // Biblioteca que abstrai o OpenID Connect
import Google, { GoogleProfile } from "next-auth/providers/google";
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const googleProfile = profile as GoogleProfile; // Verifica se o e-mail é validado pelo Google
                if (!googleProfile?.email_verified) {
                    return false; // Se não for, retorna falso
                } 
            } 
            return true;
        },
        async jwt({ token, user, account }) {
            
            if (account && user) {

                const usuarioDB = await prisma.usuario.findUnique({
                    where: {
                        email: user.email!, // A ! afirma que o email não pode ser nulo
                    },
                    select: {
                        id: true,
                        cargo: true,
                    }
                });

                if (usuarioDB) {
                    token.id = usuarioDB.id;
                    token.cargo = usuarioDB.cargo;
                    //token.userId = usuarioDB.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // Para colocar esses atributos customizados, precisei criar o next-auth.d.ts, onde coloco as novas propriedades do objeto session.user, que já vem com name, email e image
                session.user.id = token.id as string; 
                //session.user.userId = token.id as string; 
                session.user.cargo = token.cargo as string;
            }
            return session;
        },
    },
    session: { strategy: "jwt" }
})