import { prisma } from '@/lib/prisma';
import QRCode from "../../components/QRCode";
import { randomUUID } from 'crypto';
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { NextResponse } from 'next/server';


function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const token = getRandomInt(100000, 1000000)
export default async function ReservarPage({ params }: { params: Promise<{ oid: string }> }) {

	const { oid } = await params;

	const session = await auth();

	if (!session) {
		return;
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

	if (!livro) {
		return new NextResponse("Livro não encontrado", { status: 404 });
	}

	if (livro.unidades <= 0) {
		return new NextResponse("Livro sem unidades disponíveis", { status: 400 });
	}

	const dataReserva = new Date();
	const validade = new Date(dataReserva.setDate(dataReserva.getDate() + 5));
	


	const reserva = await prisma.reservas.create({
		data: {
			valiRes: validade,
			token: token.toString(),
			usuarioId: session?.user.id,
			acervoId: livro.id,
		}
	});

	const livroAtualizado = await prisma.acervo.update({
		where: {
			id: livro.id,
		},
		data: {
			unidades: livro.unidades - 1,
		}
	});


	const urlQRCode = `${process.env.WEBSITE_URL}/acervo/ativar-reserva/${reserva.id}`

	return (

		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Reserva</h1>
			<div>
				<ul>
					<li>ISBN: {livro?.isbn}</li>
					<li>Título: {livro?.titulo}</li>
					<li>Autor: {livro?.autor}</li>
					<li>Editora: {livro?.editora}</li>
					<li>Edição: {livro?.edicao}</li>
					<li>Ano de Publicação: {livro?.anoPublicacao}</li>
					<li>Gênero: {livro?.genero}</li>
				</ul>
			</div>
			<QRCode url={urlQRCode} />
		

		</div>
	);
}