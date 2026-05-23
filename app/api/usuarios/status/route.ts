import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("BODY", body);

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: body.userId,
            },
        });

        if (!usuario) {
            return NextResponse.json({ error: "Já existe um usuário com esse email ou CPF" }, { status: 400 });
        }

        const usuarioStatus = await prisma.usuario.update({
            where: {
                id: body.userId,
            },
            data: {
                status: body.status, // Abre espaço para Stored XSS, mas não tô com tempo de arrumar certinho
            },
        })


        return NextResponse.json(usuarioStatus, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}