import { prisma } from "@/lib/prisma";

import EfetivarButton from "../../components/EfetivarButton";

import { auth } from "@/auth";

import { redirect } from "next/navigation";

import {
	BookOpen,
	CalendarDays,
	User,
	CheckCircle2,
	Clock3,
	BadgeCheck
} from "lucide-react";

export default async function ReservarPage({
	params
}: {
	params: Promise<{ reservaId: string }>
}) {

	const { reservaId } = await params;

	const session = await auth();

	if (
		!session ||
		(
			session.user.cargo !== "ADMIN" &&
			session.user.cargo !== "BIBLIO"
		)
	) {

		redirect("/login");

	}

	const reserva = await prisma.reservas.findUnique({

		where: {
			id: reservaId,
		},

		select: {

			id: true,

			valiRes: true,

			retirada: true,

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

	if (!reserva) {

		redirect("/reservas");

	}
	const reservaExpirada = reserva.valiRes < new Date() && !reserva.retirada;

	const dataRetirada = new Date();

	const prazo = new Date();

	prazo.setHours(23, 59, 59, 999);

	const dataPrazo =
		new Date(
			prazo.setDate(
				prazo.getDate() + 7
			)
		);

	return (

		<div className="
            min-h-screen
            px-3 py-4
            sm:p-6
        ">

			<div className="
                max-w-5xl
                mx-auto
            ">

				{/* CARD */}
				<div className="
                    overflow-hidden
                    rounded-2xl sm:rounded-3xl
                    border border-white/40
                    bg-white/80
                    backdrop-blur-xl
                    shadow-2xl
                ">

					{/* HEADER */}
					<div className="
                        bg-blue-600
                        px-5 py-6
                        sm:px-8 sm:py-10
                        text-white
                    ">

						<div className="
                            flex
                            flex-col
                            items-center
                            text-center
                            md:flex-row
                            md:items-center
                            md:justify-between
                            md:text-left
                            gap-6
                        ">

							<div>

								<div className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-white/15
                                    px-4 py-2
                                    text-sm
                                    mb-5
                                ">

									Efetivação de reserva

								</div>

								<h1 className="
                                    text-2xl
                                    sm:text-3xl
                                    md:text-4xl
                                    font-bold
                                    break-words
                                ">
									{reserva.Acervo.titulo}
								</h1>

								<p className="
                                    text-blue-100
                                    mt-2
                                    text-sm
                                    sm:text-base
                                    md:text-lg
                                    break-words
                                ">
									ISBN: {reserva.Acervo.isbn}
								</p>

							</div>

							<div className="
                                flex
                                items-center
                                justify-center
                            ">

							</div>

						</div>

					</div>

					{/* BODY */}
					<div className="
                        p-4
                        sm:p-6
                        md:p-10
                    ">

						<div className="
                            grid
                            grid-cols-1
                            xl:grid-cols-2
                            gap-6
                            md:gap-10
                        ">

							{/* INFORMAÇÕES */}
							<div>

								<div className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-6
                                ">


									<div>

										<h2 className="
                                            text-xl
                                            sm:text-2xl
                                            font-bold
                                            text-gray-800
                                        ">
											Informações
										</h2>

									</div>

								</div>

								<div className="
                                    space-y-4
                                ">

									<InfoCard
										icon={
											<User
												size={20}
												className="text-blue-600"
											/>
										}
										label="Usuário"
										value={reserva.Usuario.nome}
									/>

									<InfoCard
										icon={
											<CalendarDays
												size={20}
												className="text-blue-600"
											/>
										}
										label="Validade da reserva"
										value={
											reserva.valiRes.toLocaleString(
												"pt-BR"
											)
										}
									/>

									{reserva.retirada && (

										<InfoCard
											icon={
												<CheckCircle2
													size={20}
													className="text-green-600"
												/>
											}
											label="Reserva efetivada em"
											value={
												reserva.retirada.toLocaleString(
													"pt-BR"
												)
											}
										/>

									)}

								</div>

							</div>

							{/* AÇÕES */}
							<div>

								{reservaExpirada ? (

									<div className="
										flex
										flex-col
										items-center
										justify-center
										rounded-2xl
										sm:rounded-3xl
										border
										border-red-100
										bg-gradient-to-br
										from-red-50
										to-rose-50
										p-6
										sm:p-8
										md:p-10
										text-center
									">

										<div className="
											w-20 h-20
											sm:w-24 sm:h-24
											rounded-full
											bg-red-100
											flex
											items-center
											justify-center
											mb-6
										">

											<Clock3
												size={44}
												className="text-red-600"
											/>

										</div>

										<h2 className="
											text-2xl
											sm:text-3xl
											font-bold
											text-gray-800
										">
											Reserva expirada
										</h2>

										<p className="
											mt-4
											text-base
											sm:text-lg
											text-gray-600
											leading-relaxed
											max-w-md
										">
											O prazo para retirada deste livro já expirou.
											A reserva não pode mais ser efetivada.
										</p>

										<div className="
											mt-8
											rounded-2xl
											bg-white
											border
											border-red-100
											px-5 py-4
											sm:px-6 sm:py-5
											shadow-sm
											w-full
										">

											<p className="
												text-sm
												text-gray-500
												mb-1
											">
												Reserva válida até
											</p>

											<p className="
												text-base
												sm:text-lg
												md:text-xl
												font-bold
												text-red-600
												break-words
											">
												{reserva.valiRes.toLocaleString("pt-BR")}
											</p>

										</div>

									</div>

								) : !reserva.retirada ? (
									<div className="
                                        rounded-2xl
                                        sm:rounded-3xl
                                        border
                                        border-blue-100
                                        bg-gradient-to-br
                                        from-blue-50
                                        to-indigo-50
                                        p-5
                                        sm:p-6
                                        md:p-8
                                    ">

										<div className="
                                            flex
                                            items-center
                                            gap-3
                                            mb-5
                                        ">

											<Clock3
												size={24}
												className="text-blue-600"
											/>

											<h2 className="
                                                text-2xl
                                                sm:text-3xl
                                                font-bold
                                                text-gray-800
                                            ">
												Efetivar retirada
											</h2>

										</div>

										<p className="
                                            text-gray-600
                                            leading-relaxed
                                            mb-8
                                        ">
											Confirme a retirada
											do livro para gerar
											automaticamente o
											prazo de devolução.
										</p>

										<div className="
                                            rounded-2xl
                                            bg-white
                                            border
                                            border-gray-100
                                            p-5
                                            shadow-sm
                                            mb-8
                                        ">

											<p className="
                                                text-sm
                                                text-gray-500
                                                mb-1
                                            ">
												Prazo previsto
												para devolução
											</p>

											<p className="
                                                text-base
                                                sm:text-lg
                                                md:text-xl
                                                break-words
                                                font-bold
                                                text-gray-800
                                            ">
												{dataPrazo.toLocaleString(
													"pt-BR"
												)}
											</p>

										</div>

										<EfetivarButton
											reservaId={reservaId}
											dataPrazo={dataPrazo}
											dataRetirada={dataRetirada}
										/>

									</div>

								) : (

									<div className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        sm:rounded-3xl
                                        border
                                        border-green-100
                                        bg-gradient-to-br
                                        from-green-50
                                        to-emerald-50
                                        p-6
                                        sm:p-8
                                        md:p-10
                                        text-center
                                    ">

										<div className="
                                            w-20 h-20
                                            sm:w-24 sm:h-24
                                            rounded-full
                                            bg-green-100
                                            flex
                                            items-center
                                            justify-center
                                            mb-6
                                        ">

											<CheckCircle2
												size={44}
												className="text-green-600"
											/>

										</div>

										<h2 className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-gray-800
                                        ">
											Reserva já efetivada
										</h2>

										<p className="
                                            mt-4
                                            text-base
                                            sm:text-lg
                                            text-gray-600
                                            leading-relaxed
                                        ">
											Este livro já foi
											retirado pelo usuário.
										</p>

										<div className="
                                            mt-8
                                            rounded-2xl
                                            bg-white
                                            border
                                            border-green-100
                                            px-5 py-4
                                            sm:px-6 sm:py-5
                                            shadow-sm
                                            w-full
                                        ">

											<p className="
                                                text-sm
                                                text-gray-500
                                                mb-1
                                            ">
												Data da retirada
											</p>

											<p className="
                                                text-base
                                                sm:text-lg
                                                md:text-xl
                                                break-words
                                                font-bold
                                                text-gray-800
                                            ">
												{reserva.retirada.toLocaleString(
													"pt-BR"
												)}
											</p>

										</div>

									</div>

								)}

							</div>

						</div>

					</div>

				</div>

			</div>

		</div>

	);
}

/* INFO CARD */
function InfoCard({
	icon,
	label,
	value
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {

	return (

		<div className="
            flex
            flex-col
            sm:flex-row
            items-start
            gap-4
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
        ">

			<div className="
                rounded-xl
                bg-blue-50
                p-3
            ">
				{icon}
			</div>

			<div className="min-w-0">

				<p className="
                    text-sm
                    text-gray-500
                    mb-1
                ">
					{label}
				</p>

				<p className="
                    text-base
                    sm:text-lg
                    font-semibold
                    text-gray-800
                    break-words
                ">
					{value}
				</p>

			</div>

		</div>

	);
}