import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';


export async function POST(request: Request) {
    const body = await request.json();

    const usuarioEncontrado = await prisma.usuario.findUnique({
        where :{
            email: body.email,
        },
        select: {
            id: true,
            senha: true,
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

    const cookiesApp = await cookies();
    cookiesApp.set("userId", usuarioEncontrado.id, {
        httpOnly: true, 
        path: "/", 
    }); // Além do ID simplesmente, podemos usar verificação via JWT para mais segurança em cada requisição do banco

    return NextResponse.json(
        { login: true },
        { status: 200 }
    );
    
    
}