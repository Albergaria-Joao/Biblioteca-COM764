import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getSession } from 'next-auth/react';

// Cada função sempre vai ter o nome d o método 
export async function GET() {
  try {

    const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido
    
    if (!session || !session.user) {
        return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
        );
    }

    // Funciona que nem um select do SQL. Você escolhe as colunas e um limite (take)
    const acervo = await prisma.acervo.findMany({
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
      },
    });

    return NextResponse.json(acervo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

        const livroExiste = await prisma.acervo.findUnique({
            where: {
                isbn: body.livro.isbn,
            }
        });

        if (livroExiste) {
            return NextResponse.json({ error: "Já existe um livro com esse ISBN" }, { status: 400 });
        }

        const novoLivro = await prisma.acervo.create({
            data: {
                titulo: body.livro.titulo,
                isbn: body.livro.isbn,
                autor: body.livro.autor,
                editora: body.livro.editora,
                anoPublicacao: body.livro.anoPublicacao,
                genero: body.livro.genero,
                edicao: body.livro.edicao,
                unidades: body.livro.unidades,
            }
        });

        return NextResponse.json(novoLivro, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro ao adicionar livro" },
            { status: 500 }
        );
    }
};

export async function PUT(request: Request) {

}