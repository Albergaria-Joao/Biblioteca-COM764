"use client"

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Search,
    CalendarDays,
    BookOpen,
    User,
    Trash2,
    Clock3
} from "lucide-react";

type Reserva = {
    id: string,
    createdAt: Date
    valiRes: Date,
    Acervo: {
        isbn: string,
        titulo: string,
        autor: string,
    },
    Usuario: {
        nome: string,
    }
}

interface TabelaProps {
    reservas: Reserva[];
    cancelar: boolean;
}

export default function ReservasTabela({
    reservas,
    cancelar
}: TabelaProps) {

    const router = useRouter();

    const [busca, setBusca] = useState("");

    const reservasFiltradas = useMemo(() => {

        return reservas.filter((reserva) => {

            const termo = busca.toLowerCase();

            return (
                (reserva.Acervo.titulo || "")
                    .toLowerCase()
                    .includes(termo) ||

                (reserva.Acervo.autor || "")
                    .toLowerCase()
                    .includes(termo) ||

                (reserva.Acervo.isbn || "")
                    .toLowerCase()
                    .includes(termo) ||

                (reserva.Usuario?.nome || "")
                    .toLowerCase()
                    .includes(termo)
            );

        });

    }, [reservas, busca]);

    const formatarData = (data: Date | string) => {

        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    };

    const handleCancelar = async (id: string) => {

        const confirmar = window.confirm(
            "Deseja realmente cancelar esta reserva?"
        );

        if (!confirmar) return;

        try {

            const response = await fetch(
                `/api/reserva-operacoes/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {

                router.refresh();

            } else {

                console.error("Erro ao cancelar reserva.");

            }

        } catch (error) {

            console.error(
                "Erro ao cancelar reserva:",
                error
            );

        }
    };

    return (

        <div className="space-y-6">

            {/* TOPO */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* INFO */}
                <div>

                    <h3 className="text-xl font-bold text-gray-800">
                        Reservas cadastradas
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                        {reservasFiltradas.length} reservas encontradas
                    </p>

                </div>

                {/* BUSCA */}
                <div className="relative w-full lg:w-96">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Buscar reserva..."
                        value={busca}
                        onChange={(e) =>
                            setBusca(e.target.value)
                        }
                        className="
                            w-full
                            rounded-2xl
                            border border-gray-200
                            bg-white/80
                            py-3
                            pl-11
                            pr-4
                            shadow-sm
                            outline-none
                            transition-all
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                        "
                    />

                </div>

            </div>

            {/* TABELA */}
            <div className="overflow-auto rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl">

                <table className="w-full min-w-[1100px]">

                    {/* HEADER */}
                    <thead className="sticky top-0 z-10">

                        <tr className="bg-blue-600 text-white text-sm uppercase tracking-wide">

                            {cancelar && (
                                <th className="px-6 py-5 text-left">
                                    Usuário
                                </th>
                            )}

                            <th className="px-6 py-5 text-left">
                                Reserva
                            </th>

                            <th className="px-6 py-5 text-left">
                                Validade
                            </th>

                            <th className="px-6 py-5 text-left">
                                ISBN
                            </th>

                            <th className="px-6 py-5 text-left">
                                Livro
                            </th>

                            <th className="px-6 py-5 text-left">
                                Autor
                            </th>

                            {cancelar && (
                                <th className="px-6 py-5 text-left">
                                    Ações
                                </th>
                            )}

                        </tr>

                    </thead>

                    {/* BODY */}
                    <tbody>

                        {reservasFiltradas.map((reserva, index) => (

                            <tr
                                key={reserva.id}
                                className={`
                                    border-b border-gray-100
                                    transition-all duration-200
                                    hover:bg-blue-50/60
                                    ${index % 2 === 0
                                        ? "bg-white/40"
                                        : "bg-gray-50/40"
                                    }
                                `}
                            >

                                {/* USUÁRIO */}
                                {cancelar && (

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div>

                                                <p className="font-semibold text-gray-800">
                                                    {reserva.Usuario?.nome}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                )}

                                {/* DATA RESERVA */}
                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2 text-gray-700">

                                        <CalendarDays
                                            size={17}
                                            className="text-gray-400"
                                        />

                                        {formatarData(reserva.createdAt)}

                                    </div>

                                </td>

                                {/* VALIDADE */}
                                <td className="px-6 py-5">

                                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">

                                        <Clock3 size={16} />

                                        {formatarData(reserva.valiRes)}

                                    </div>

                                </td>

                                {/* ISBN */}
                                <td className="px-6 py-5">

                                    <span className="
                                        rounded-full
                                        bg-gray-100
                                        px-4 py-2
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    ">

                                        {reserva.Acervo.isbn}

                                    </span>

                                </td>

                                {/* LIVRO */}
                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">



                                        <div>

                                            <p className="font-semibold text-gray-800">
                                                {reserva.Acervo.titulo}
                                            </p>


                                        </div>

                                    </div>

                                </td>

                                {/* AUTOR */}
                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2 text-gray-700">

                                        {reserva.Acervo.autor}

                                    </div>

                                </td>

                                {/* AÇÕES */}
                                {cancelar && (

                                    <td className="px-6 py-5">

                                        <button
                                            onClick={() =>
                                                handleCancelar(reserva.id)
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-xl
                                                bg-red-500
                                                px-4 py-2
                                                text-sm
                                                font-semibold
                                                text-white
                                                shadow-md
                                                transition-all
                                                hover:scale-105
                                                hover:bg-red-600
                                            "
                                        >

                                            <Trash2 size={16} />

                                            Cancelar

                                        </button>

                                    </td>

                                )}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}