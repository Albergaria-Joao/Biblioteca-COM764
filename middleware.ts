import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLogged = !!req.auth;
  const { nextUrl } = req;

  // Rotas públicas (não precisam de login)
  const publicRoutes = [
    "/login",
    "/cadastro",
    "/usuarios/aprovar",
  ];

  // Verifica se a rota atual é pública
  const isPublic = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );


  if (!isLogged && !isPublic) {
    return Response.redirect(new URL("/login", nextUrl));
  }


  if (isLogged && (nextUrl.pathname === "/login" || nextUrl.pathname === "/cadastro")) {
    return Response.redirect(new URL("/acervo", nextUrl));
  }


  if (isLogged && nextUrl.pathname === "/") {
    return Response.redirect(new URL("/acervo", nextUrl));
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