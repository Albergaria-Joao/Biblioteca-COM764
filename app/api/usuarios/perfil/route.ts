import prisma from "@/lib/prisma";
import { error } from "console";
import { request } from "http";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

        if (!session || !session.user) {
            return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
            );
        }

        const userId = session.user.id;

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
            },
        });

        const endereco = await prisma.endereco.findUnique({
            where: {
                usuarioId: userId,
            },
            select: {
                rua: true,
                numero: true,
                bairro: true,
                cidade: true,
                estado: true,
                cep: true,
            },
        })

        if (!usuario) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

        const userObject = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
            telefone: usuario.telefone,
            dataNascimento: usuario.dataNascimento,
            endereco: {
                rua: endereco?.rua,
                numero: endereco?.numero,
                bairro: endereco?.bairro,
                cidade: endereco?.cidade,
                estado: endereco?.estado,
                cep: endereco?.cep,
            }
        }
        //Validação da existencia do usuario no banco
        if (!usuario) {
            return NextResponse.json(
                { error: "Usuario não encontrado" },
                { status: 404 }
            )
        }

        //Sucesso na busca por user especifíco
        return NextResponse.json(userObject);

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
        const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

        if (!session || !session.user) {
            return NextResponse.json(
            { error: "Usuário não autenticado" },
            { status: 401 }
            );
        }

        const userId = session.user.id;
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

        const endereco = await prisma.endereco.findUnique({
            where: { usuarioId: userId },
            select: { id: true },
        });

        if (!endereco) {
            return NextResponse.json({ success: true });
        }

        // if (!usuario?.enderecoId) {
        //     return NextResponse.json(
        //         { error: "Endereço não encontrado" },
        //         { status: 404 }
        //     );
        // }

        //Atualiza endereço
        await prisma.endereco.update({
            where: { id: endereco.id },
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