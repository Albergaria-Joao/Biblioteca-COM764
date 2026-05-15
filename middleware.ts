import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLogged = !!req.auth;
  const { nextUrl } = req;

  if (isLogged && (nextUrl.pathname === "/login" || nextUrl.pathname === "/cadastro")) {
    return Response.redirect(new URL("/acervo", nextUrl));
  }


  if (isLogged && nextUrl.pathname === "/") {
    return Response.redirect(new URL("/acervo", nextUrl));
  }

  if (!isLogged && nextUrl.pathname === "/") {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (!isLogged && nextUrl.pathname.startsWith("/acervo/ativar-reserva")) {
    const loginUrl = new URL('/login', nextUrl)
    // Armazena a página que ele tentou acessar
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return Response.redirect(loginUrl)
  }


});

export const config = {
  matcher: [
    "/usuarios/:path*",
    "/perfil/:path*",
    "/acervo/:path*",
    "/login",
    "/cadastro",
    "/",
  ],
};