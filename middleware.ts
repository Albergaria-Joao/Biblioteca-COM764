// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Instância do NextAuth para o middleware
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLogged = !!req.auth;
  
  const { nextUrl } = req;
  console.log("Middleware rodando para:", nextUrl.pathname, "Usuário logado?", isLogged);

  if (!isLogged && (nextUrl.pathname !== "/login" && nextUrl.pathname !== "/cadastro")) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLogged && (nextUrl.pathname === "/login" || nextUrl.pathname === "/cadastro")) {
    return Response.redirect(new URL("/acervo", nextUrl));
  }
  
  if (isLogged && (nextUrl.pathname === "/")) {
      return Response.redirect(new URL("/acervo", nextUrl));
  }

  
});

export const config = {
  matcher: ["/usuarios/:path*", "/perfil/:path*", "/login", "/cadastro", "/acervo/:path*", "/"],
};