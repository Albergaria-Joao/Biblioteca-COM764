import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from "bcrypt";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

        if (!session || !session.user || session.user.cargo !== "BIBLIO") {
            console.log(session?.user.cargo);
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const reserva = await prisma.reservas.findUnique({
            where: {
                id: id,
            },
            select: {
                acervoId: true,
            }
        })
        if (!reserva) {
            return NextResponse.json(
                { error: "Reserva não encontrada" },
                { status: 404 });
        }

        const livro = await prisma.acervo.findUnique({
            where: {
                id: reserva.acervoId,
            },
            select: {
                unidades: true,
            }
        })

        if (!livro) {
            return NextResponse.json(
                { error: "Livro não encontrado" },
                { status: 404 });
        }

        const reservaDel = await prisma.reservas.delete({
            where: {
                id: id,
            }
        })

        const livroUpdate = await prisma.acervo.update({
            where: {
                id: reserva.acervoId,
            },
            data: {
                unidades: livro?.unidades + 1,
            }
        })



        return NextResponse.json(reserva, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao reservar livro" },
            { status: 500 }
        );
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

        if (!session || !session.user || session.user.cargo !== "BIBLIO") {
            console.log(session?.user.cargo);
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const reserva = await prisma.reservas.findUnique({
            where: {
                id: id,
            },
            select: {
                acervoId: true,
            }
        })
        if (!reserva) {
            return NextResponse.json(
                { error: "Reserva não encontrada" },
                { status: 404 });
        }

        const livro = await prisma.acervo.findUnique({
            where: {
                id: reserva.acervoId,
            },
            select: {
                unidades: true,
            }
        })

        if (!livro) {
            return NextResponse.json(
                { error: "Livro não encontrado" },
                { status: 404 });
        }

        const reservaUpdate = await prisma.reservas.update({
            where: {
                id: id,
            },
            data: {
                devolucao: new Date(),
            }
        })

        const livroUpdate = await prisma.acervo.update({
            where: {
                id: reserva.acervoId,
            },
            data: {
                unidades: livro?.unidades + 1,
            }
        })



        return NextResponse.json(reserva, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao reservar livro" },
            { status: 500 }
        );
    }
}