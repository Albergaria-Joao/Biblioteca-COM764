import { prisma } from '@/lib/prisma';
import QRCode from "../../components/QRCode";
import { randomUUID } from 'crypto';
import bcrypt from "bcrypt";

export default async function ReservarPage({ params }: { params: Promise<{ oid: string }> }) {

	const { oid } = await params;

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
		}
	})

	const urlQRCode = `${process.env.WEBSITE_URL}/acervo/ativar-reserva/${await bcrypt.hash(oid, 10)}`

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