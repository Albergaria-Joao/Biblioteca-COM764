import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const usuario = await prisma.usuario.findUnique({
      where: { id: id as string }, // ou String(id) dependendo do seu schema
    });

    return NextResponse.json(usuario, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}