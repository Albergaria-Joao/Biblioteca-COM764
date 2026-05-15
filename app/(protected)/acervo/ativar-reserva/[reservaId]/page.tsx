import { prisma } from '@/lib/prisma';
import QRCode from "../../components/QRCode";
import EfetivarButton from "../../components/EfetivarButton";
import { randomUUID } from 'crypto';
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { redirect, notFound } from 'next/navigation';



export default async function ReservarPage({ params }: { params: Promise<{ reservaId: string }> }) {

	const { reservaId } = await params;

	const session = await auth();

	if (!session || session.user.cargo !== "ADMIN" && session.user.cargo !== "BIBLIO") {
		redirect('/login');
	}
	const reserva = await prisma.reservas.findUnique({
		where: {
			id: reservaId,
		},
		select: {
			id: true,
			valiRes: true,
			retirada: true,
			token: true,
			Usuario: {
				select: {
					id: true,
					nome: true,
				}
			},
			Acervo: {
				select: {
					id: true,
					isbn: true,
					titulo: true,
				}
			}
		}
	});



	if (!reserva) return 404;

	if (reserva.retirada && reserva.retirada != null && reserva.retirada !== undefined) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">Reserva</h1>
				<div>
					<ul>
						<li>ISBN: {reserva.Acervo.isbn}</li>
						<li>Título: {reserva.Acervo.titulo}</li>
						<li>Validade: {reserva.valiRes.toISOString()}</li>
						<li>Usuário: {reserva.Usuario.nome}</li>
					</ul>

					<h1>Reserva já efetuada em {reserva.retirada.toISOString()}</h1>
				</div>
			</div>
		);
	}

	const dataRetirada = new Date();
	console.log(dataRetirada);
	const prazo = new Date();
	prazo.setHours(23, 59, 59, 999);
	const dataPrazo = new Date(prazo.setDate(prazo.getDate() + 7));

	return (

		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Reserva</h1>
			<div>
				<ul>
					<li>ISBN: {reserva.Acervo.isbn}</li>
					<li>Título: {reserva.Acervo.titulo}</li>
					<li>Validade: {reserva.valiRes.toISOString()}</li>
					<li>Usuário: {reserva.Usuario.nome}</li>
				</ul>

				<EfetivarButton reservaId={reservaId} dataPrazo={dataPrazo} dataRetirada={dataRetirada}></EfetivarButton>
			</div>
		</div>
	);
}