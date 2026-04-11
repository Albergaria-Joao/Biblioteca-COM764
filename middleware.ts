// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Instância do NextAuth para o middleware
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLogged = !!req.auth;
  
  const { nextUrl } = req;
  console.log("Middleware rodando para:", nextUrl.pathname, "Usuário logado?", isLogged);

  if (!isLogged && (nextUrl.pathname.startsWith("/usuarios") || nextUrl.pathname.startsWith("/perfil"))) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/usuarios/:path*", "/perfil/:path*"]
};