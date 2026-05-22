import { prisma } from '@/lib/prisma';
import QRCode from "../../components/QRCode";
import { randomUUID } from 'crypto';
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { NextResponse } from 'next/server';
import { redirect, notFound } from 'next/navigation';
import { toast } from "sonner";
import { z } from "zod";
import ReservaQR from '../../components/ReservaQR';

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
	message: "OID inválido",
});

const token = getRandomInt(100000, 1000000)
export default async function ReservarPage({ params }: { params: Promise<{ oid: string }> }) {

	const { oid } = await params;


	const session = await auth();

	if (!session) {
		redirect('/login');
	}
	else if (session.user.cargo !== "USER") {
		redirect('/acervo');
	}


	const validation = objectIdSchema.safeParse(oid); // Valida o ID, se for inválido já para por aqui

	if (!validation.success) {
		//toast.error("ID do tryout inválido.");
		return redirect("/acervo");
	}




	const livro = await prisma.acervo.findUnique({
		where: {
			id: oid,
			excluido: false,
		},
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
		}
	});

	const reservaExistente = await prisma.reservas.findFirst({
		where: {
			usuarioId: session?.user.id,
			acervoId: livro?.id,
			OR: [
				{ devolucao: null },
				{ devolucao: { equals: undefined } },
				{ devolucao: { isSet: false } },
			],
			valiRes: {
				gte: new Date(),
			}
		},
		select: {
			id: true,
			valiRes: true,

		}
	});

	if (reservaExistente) {
		return (
			<div className="p-4">
				<h1>Você já tem uma reserva ativa para este livro!</h1>

			</div>);
	}

	if (!livro) {
		return new NextResponse("Livro não encontrado", { status: 404 });
	}

	if (livro.unidades <= 0) {
		return new NextResponse("Livro sem unidades disponíveis", { status: 400 });
	}

	const dataReserva = new Date();
	const validade = new Date(dataReserva.setDate(dataReserva.getDate() + 5));

	const websiteURL = process.env.WEBSITE_URL;
	//const tokenHash = await bcrypt.hash(token.toString(), 10);

	// const reserva = await prisma.reservas.create({
	// 	data: {
	// 		valiRes: validade,
	// 		usuarioId: session?.user.id,
	// 		acervoId: livro.id,
	// 	}
	// });


	return (

		<div className="p-4">
			<ReservaQR livro={livro} email={session.user.email!} WEBSITE_URL={websiteURL!}></ReservaQR>


		</div>
	);
}