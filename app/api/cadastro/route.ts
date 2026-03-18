import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";


// Cada função sempre vai ter o nome d o método 
export async function POST(request: Request) {
  try {
    const body = await request.json();
    

    const endereco = await prisma.endereco.create({
        data: {
            rua: body.rua,
            cep: body.cep,
            complemento: body.complemento,
            numero: body.numero,
            cidade: body.cidade,
            estado: body.estado,
            bairro: body.bairro
        }
    });

    const usuario = await prisma.usuario.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha: await bcrypt.hash(body.senha, 10),
        cpf: body.cpf,
        dataNascimento: body.dataNasc,
        telefone: body.telefone,
        enderecoId: endereco.id
      },
    });

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: 500 }
    );
  }
}