import { prisma } from '@/lib/prisma';
import QRCode from "../../components/QRCode";
import { randomUUID } from 'crypto';
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { NextResponse } from 'next/server';


export default async function ReservarPage({ params }: { params: Promise<{ reservaId: string }> }) {

    const { reservaId } = await params;

    const session = await auth();

    if (!session) {
        return;
    }
    const reserva = await prisma.reservas.findUnique({
			where: {
				id: reservaId,
			},
			select: {
				id: true,
				valiRes: true,
				token: true,
				// Note o 'U' maiúsculo para bater com o model Reservas
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

	if (!reserva) return new NextResponse("Reserva não encontrada", { status: 404 });
	
	const dataRetirada = new Date();
	console.log(dataRetirada);
	const prazo = new Date();
	const dataPrazo = new Date(prazo.setDate(prazo.getDate() + 5));

	const reservaEfetivada = await prisma.reservas.update({
		where: {
			id: reserva.id,
		},
		data: {
				retirada: dataRetirada,
				prazo: dataPrazo,
			}
		})

    const urlQRCode = `${process.env.WEBSITE_URL}/acervo/ativar-reserva/${reserva.id}`

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
            </div>
        

        </div>
    );
}