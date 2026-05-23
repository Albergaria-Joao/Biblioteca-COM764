// app/api/auth/checar-situacao/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ erro: "Email obrigatório" }, { status: 400 });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email },
            select: { situacao: true, cargo: true }
        });

        if (usuario && usuario.situacao === "ESPERA") {
            return NextResponse.json({ erro: "USUARIO_EM_ESPERA" }, { status: 403 });
        }

        if (usuario?.cargo == "BIBLIO") {
            const bibliosAtivos = await prisma.usuario.findMany({
                where: {
                    cargo: "BIBLIO",
                    status: "ONLINE"
                }
            });

            if (bibliosAtivos.length >= 1) {
                return NextResponse.json({ erro: "BIBLIO_ONLINE" }, { status: 403 });
            }
        }

        return NextResponse.json({ status: "LIBERADO" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
    }
}