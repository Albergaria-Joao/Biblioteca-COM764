import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // codifica o secret em bytes
// Middleware ==> cada requisição vai passar por ele
export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if(!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await jwtVerify(token, SECRET);
        console.log(token)
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/usuarios/:path*", "/perfil/:path*"]
}