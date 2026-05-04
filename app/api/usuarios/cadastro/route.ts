import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";
import { enviarEmailCadastro } from '@/lib/email';

// Cada função sempre vai ter o nome d o método 
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email: body.email,
        cpf: body.cpf,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json({ error: "Já existe um usuário com esse email ou CPF" }, { status: 400 });
    }


    const novoUsuario = await prisma.$transaction(async (prisma) => {
      

      const usuario = await prisma.usuario.create({
        data: {
          nome: body.nome,
          email: body.email,
          senha: await bcrypt.hash(body.senha, 10),
          cpf: body.cpf,
          dataNascimento: new Date(body.dataNasc),
          cargo: body.cargo,
          telefone: body.telefone,
        },
      });

      const endereco = await prisma.endereco.create({
        data: {
          rua: body.rua,
          cep: body.cep,
          complemento: body.complemento,
          numero: body.numero,
          cidade: body.cidade,
          estado: body.estado,
          bairro: body.bairro,
          usuarioId: usuario.id,
        }
      });

      return usuario;
    });
    await enviarEmailCadastro(novoUsuario);

    return NextResponse.json(novoUsuario, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}