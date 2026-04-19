import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ oid: string }> }
) {
    
    const { oid } = await params;
    if (!oid) {
        return NextResponse.json(
            { error: "ID do livro não fornecido" },
            { status: 400 }
        );
    }

    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido   
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const livro = await prisma.acervo.findUnique({
            where: {
                id: oid.toString()  ,
            },
            select: {
                id: true,
                isbn: true,
                titulo: true,
                autor: true,
                editora: true,
                edicao: true,
                anoPublicacao: true,
                genero: true,
                unidades: true,
            }
        })

        return NextResponse.json(livro, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { status: 500 }
        );
    }

}

export async function PUT(request: Request, { params }: { params: Promise<{ oid: string }> }) {
    const { oid } = await params;
    if (!oid) {
        return NextResponse.json(
            { error: "ID do livro não fornecido" },
            { status: 400 }
        );
    }
    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido
        
        if (!session || !session.user || session.user.cargo !== "BIBLIO") {
            console.log(session?.user.cargo);
            return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
            );
        }

        const body = await request.json();

        for (const key in body.livro) {
            if (body.livro[key] === body.livroPrevio[key]) {
                body.livro[key] = undefined; 
                // O que for undefined, o Prisma vai ignorar na hora de atualizar
                // Ou seja, só vai atualizar no banco os campos que realmente foram editados
            }
        }

        const livro = await prisma.acervo.update({
            where: {
                id: oid.toString(),
            },
            data: {
                titulo: body.livro.titulo,
                isbn: body.livro.isbn,
                autor: body.livro.autor,
                editora: body.livro.editora,
                edicao: body.livro.edicao,
                anoPublicacao: body.livro.anoPublicacao,
                genero: body.livro.genero,
                unidades: body.livro.unidades,
            }
        })
        return NextResponse.json(livro, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ oid: string }> }) {
    const { oid } = await params;
    if (!oid) {
        return NextResponse.json(
            { error: "ID do livro não fornecido" },
            { status: 400 }
        );
    }

    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido
        
        if (!session || !session.user || session.user.cargo !== "BIBLIO") {
            console.log(session?.user.cargo);
            return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
            );
        }

        const livroExcluido = await prisma.acervo.update({
            where: {
                id: oid.toString(),
            },
            data: {
                excluido: true,
            }
        });

        console.log("Livro excluído:", livroExcluido);
        return NextResponse.json(livroExcluido, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { status: 500 }
        );
    }

}