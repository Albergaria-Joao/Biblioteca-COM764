import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from "bcrypt";



export async function GET(request: Request) {

	try {
		const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

		if (!session || !session.user || session.user.cargo !== "BIBLIO") {
			console.log(session?.user.cargo);
			return NextResponse.json(
				{ error: "Usuário não autenticado" },
				{ status: 401 }
			);
		}


		const reservas = await prisma.reservas.findMany({
			select: {
				id: true,
				createdAt: true,
				prazo: true,
				Acervo: {
					select: {
						titulo: true,
						isbn: true,
						autor: true,
					}
				}
			},
		})
		return NextResponse.json(reservas, { status: 200 });

	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao reservar livro" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {

	try {
		const session = await auth();
		if (!session || !session.user) {
			console.log(session?.user.cargo);
			return NextResponse.json(
				{ error: "Usuário não autenticado" },
				{ status: 401 }
			);
		}
		const body = await request.json();

		const dataReserva = new Date();
		const validade = new Date(dataReserva.setDate(dataReserva.getDate() + 5));

		const livro = await prisma.acervo.findUnique({
			where: {
				id: body.livroId,
			},
			select: {
				unidades: true,
			}
		})

		if (!livro || livro.unidades <= 0) {
			return NextResponse.json(
				{ error: "Livro sem unidades disponíveis" },
				{ status: 400 }
			);
		}

		const reserva = await prisma.reservas.create({
			data: {
				valiRes: validade,
				usuarioId: session?.user.id,
				acervoId: body.livroId,
			}
		});

		const livroAtualizado = await prisma.acervo.update({
			where: {
				id: body.livroId,
			},
			data: {
				unidades: livro.unidades - 1,
			}
		});

		console.log(reserva);
		return NextResponse.json(reserva, { status: 200 });

	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao reservar livro" },
			{ status: 500 }
		);
	}
}


export async function PUT(request: Request) {

	try {
		const session = await auth(); // O próprio nextAuth vai pegar o token dos cookies, validar ele, e retornar os dados do usuário (payload) caso o token seja válido

		if (!session || !session.user || session.user.cargo !== "BIBLIO") {
			console.log(session?.user.cargo);
			return NextResponse.json(
				{ error: "Usuário não autenticado" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const reserva = await prisma.reservas.findUnique({
			where: {
				id: body.id,
			},
		})

		if (!reserva) {
			return NextResponse.json(
				{ error: "Reserva não encontrada" },
				{ status: 404 }
			);
		}

		// const tokenValido = await bcrypt.compare(reserva.token, body.token);

		// if (!tokenValido) {

		// }


		const reservaEfetivada = await prisma.reservas.update({
			where: {
				id: body.id,
			},
			data: {
				retirada: body.dataRetirada,
				prazo: body.dataPrazo,
			}
		})
		return NextResponse.json(reservaEfetivada, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao reservar livro" },
			{ status: 500 }
		);
	}
}