import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from "bcrypt";

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }
) {

    const { userId } = await params;

    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

        if (!session || !session.user || session.user.cargo !== "BIBLIO") {
            console.log(session?.user.cargo);
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }


        const reservas = await prisma.reservas.findMany({
            where: {
                usuarioId: userId,
            },
            select: {
                id: true,
                createdAt: true,
                prazo: true,
                Acervo: {
                    select: {
                        titulo: true,
                        isbn: true,
                        autor: true,
                    }
                }
            },
        })
        return NextResponse.json(reservas, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao reservar livro" },
            { status: 500 }
        );
    }
}