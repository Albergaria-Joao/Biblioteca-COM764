import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { SignJWT } from 'jose'; // Biblioteca para JWT que o Gemini recomendou pra performance melhor c/ Next

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // codifica o secret em bytes

export async function POST(request: Request) {
    const body = await request.json();

    const usuarioEncontrado = await prisma.usuario.findUnique({
        where :{
            email: body.email,
        },
        select: {
            id: true,
            senha: true,
            cargo: true,
        }
    })

    // Se não tiver encontrado o usuário
    if (!usuarioEncontrado) {
        console.log("Usuário não encontrado")
        return NextResponse.json(
            { erro: "Credenciais inválidas" },
            { status: 401 } 
        );
    }

    // Validação de senha com o hashing do BCrypt
    const senhaValidada = await bcrypt.compare(body.senha, usuarioEncontrado.senha);
    if (!senhaValidada) {
        console.log("Senha inválida")
        return NextResponse.json(
            { erro: "Credenciais inválidas" },
            { status: 401 } 
        );
    }

    console.log("logou");

    const token = await new SignJWT({ userId: usuarioEncontrado.id, cargo: usuarioEncontrado.cargo })
        .setProtectedHeader({ alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("2h") // Data de expiração evita ataques de Replay
        .sign(SECRET);

    const response = NextResponse.json(
        { login: true },
        { status: 200 }
    );

    response.cookies.set("token", token, {
        httpOnly: true, // Browser não consegue ler ==> evita XSS
        secure: process.env.NODE_ENV === "production", // Se tiver dado deploy em produção (trocando a variável no env), ativa esse modo para o cookie só ser transp. via HTTPS
        sameSite: "strict", // Os cookies só são enviados do mesmo site. Evita Cross-site request forgery
        maxAge: 60 * 60 * 2, // As 2h em seg,
        path: "/" // cookie acessível de todas as rotas
    })
    
    return response;
    
    
}