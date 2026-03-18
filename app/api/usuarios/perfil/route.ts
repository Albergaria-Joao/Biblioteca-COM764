import prisma from "@/lib/prisma";
import { error } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        //Buscando o id do user utilizanod a pagina
        const cookieStorage = cookies();
        const userId = (await cookieStorage).get("userId")?.value;

        //Verifica autenticação
        if (!userId) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        //Busca no banco
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                telefone: true,
                dataNascimento: true,
                Endereco: {
                    select: {
                        rua: true,
                        numero: true,
                        bairro: true,
                        cidade: true,
                        estado: true,
                        cep: true,
                    },
                },
            },
        });

        //Validação da existencia do usuario no banco
        if (!usuario) {
            return NextResponse.json(
                { error: "Usuario não encontrado" },
                { status: 401 }
            )
        }

        //Sucesso na busca por user especifíco
        return NextResponse.json(usuario);

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);

        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }



}

export async function POST(
    email: string,
    nome: string,
    telefone: string,
    dataNasc: Date,
    rua: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,

) {

    //Buscando o id do user utilizanod a pagina
    const cookieStorage = cookies();
    const userId = (await cookieStorage).get("userId")?.value;

    //Verifica autenticação
    if (!userId) {
        return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
        );
    }

    prisma.usuario.update({
        where: {
            id: userId,
        },
        data: {
            email: email,
            nome: nome,
            telefone: telefone,
            dataNascimento: dataNasc,
        },
    });

    const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        select: { enderecoId: true },
    });

    if (!usuario?.enderecoId) {
        return NextResponse.json(
            { error: "Endereço não encontrado" },
            { status: 404 }
        );
    }

    prisma.endereco.update({
        where: {
            id: usuario.enderecoId,
        },
        data: {
            rua: rua,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            cep: cep,
        },
    });

}