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