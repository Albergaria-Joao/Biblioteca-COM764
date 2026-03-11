import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cada função sempre vai ter o nome d o método 
export async function GET() {
  try {

    // Funciona que nem um select do SQL. Você escolhe as colunas e um limite (take)
    const usuarios = await prisma.usuario.findMany({
      take: 10,
      select: {
        id: true,
        nome: true,
        email: true,
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