import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getSession } from 'next-auth/react';

// Cada função sempre vai ter o nome d o método 
export async function GET() {
  try {

    const session = await auth();  // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Funciona que nem um select do SQL. Você escolhe as colunas e um limite (take)
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        endereco: {
          select: {
            cep: true,
            numero: true,
          }
        }
      },
    });

    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado" },
        { status: 400 }
      );
    }

    // apaga endereço ligado ao usuário
    await prisma.endereco.deleteMany({
      where: {
        usuarioId: id,
      },
    });

    // apaga usuário
    await prisma.usuario.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Usuário removido com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao remover usuário" },
      { status: 500 }
    );
  }
}