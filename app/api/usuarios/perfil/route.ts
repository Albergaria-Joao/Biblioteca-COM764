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
                { status: 404 }
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

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            email,
            nome,
            telefone,
            datanasc,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep
        } = body;

        const cookieStorage = cookies();
        const userId = (await cookieStorage).get("userId")?.value;

        if (!userId) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        // Atualiza usuário
        await prisma.usuario.update({
            where: { id: userId },
            data: {
                email,
                nome,
                telefone,
                dataNascimento: datanasc ? new Date(datanasc) : undefined
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

        //Atualiza endereço
        await prisma.endereco.update({
            where: { id: usuario.enderecoId },
            data: {
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
            },
        });

        //resposta de sucesso
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erro interno" },
            { status: 500 }
        );
    }
}