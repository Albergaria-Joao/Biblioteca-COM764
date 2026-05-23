"use client"

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Search,
    CalendarDays,
    BookOpen,
    User,
    Undo2,
    Clock3
} from "lucide-react";

type Emprestimo = {
    id: string,
    retirada: Date
    prazo: Date,

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
    emprestimos: Emprestimo[];
    devolver: boolean;
}

export default function EmprestimosTabela({
    emprestimos,
    devolver
}: TabelaProps) {

    const router = useRouter();

    const [busca, setBusca] = useState("");

    const emprestimosFiltrados = useMemo(() => {

        return emprestimos.filter((emprestimo) => {

            const termo = busca.toLowerCase();

            return (

                (emprestimo.Acervo.titulo || "")
                    .toLowerCase()
                    .includes(termo) ||

                (emprestimo.Acervo.autor || "")
                    .toLowerCase()
                    .includes(termo) ||

                (emprestimo.Acervo.isbn || "")
                    .toLowerCase()
                    .includes(termo) ||

                (emprestimo.Usuario?.nome || "")
                    .toLowerCase()
                    .includes(termo)

            );

        });

    }, [emprestimos, busca]);

    const formatarData = (
        data: Date | string
    ) => {

        return new Date(data).toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );

    };

    const handleDevolver = async (id: string) => {

        const confirmar = window.confirm(
            "Deseja realmente devolver este livro?"
        );

        if (!confirmar) return;

        try {

            const response = await fetch(
                `/api/reserva-operacoes/${id}`,
                {
                    method: "PUT",
                }
            );

            if (response.ok) {

                router.refresh();

            } else {

                console.error(
                    "Erro ao devolver livro"
                );

            }

        } catch (error) {

            console.error(
                "Erro ao devolver livro:",
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
                        Empréstimos ativos
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                        {emprestimosFiltrados.length} empréstimos encontrados
                    </p>

                </div>

                {/* BUSCA */}
                <div className="relative w-full lg:w-96">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        type="text"
                        placeholder="Buscar empréstimo..."
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
            <div className="
                overflow-auto
                rounded-3xl
                border border-white/40
                bg-white/60
                backdrop-blur-xl
                shadow-xl
            ">

                <table className="w-full min-w-[1100px]">

                    {/* HEADER */}
                    <thead className="sticky top-0 z-10">

                        <tr className="
                            bg-blue-600
                            text-white
                            text-sm
                            uppercase
                            tracking-wide
                        ">

                            <th className="px-6 py-5 text-left">
                                Usuário
                            </th>

                            <th className="px-6 py-5 text-left">
                                Retirada
                            </th>

                            <th className="px-6 py-5 text-left">
                                Prazo
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

                            {devolver && (
                                <th className="px-6 py-5 text-left">
                                    Ações
                                </th>
                            )}

                        </tr>

                    </thead>

                    {/* BODY */}
                    <tbody>

                        {emprestimosFiltrados.map(
                            (emprestimo, index) => (

                                <tr
                                    key={emprestimo.id}
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
                                    <td className="px-6 py-5">

                                        <div className="
                                            flex items-center gap-3
                                        ">


                                            <div>

                                                <p className="
                                                    font-semibold
                                                    text-gray-800
                                                ">
                                                    {emprestimo.Usuario?.nome}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* RETIRADA */}
                                    <td className="px-6 py-5">

                                        <div className="
                                            flex items-center gap-2
                                            text-gray-700
                                        ">

                                            <CalendarDays
                                                size={17}
                                                className="text-gray-400"
                                            />

                                            {formatarData(
                                                emprestimo.retirada
                                            )}

                                        </div>

                                    </td>

                                    {/* PRAZO */}
                                    <td className="px-6 py-5">

                                        <div className="
                                            inline-flex
                                            items-center gap-2
                                            rounded-full
                                            bg-amber-100
                                            px-4 py-2
                                            text-sm
                                            font-medium
                                            text-amber-700
                                        ">

                                            <Clock3 size={16} />

                                            {formatarData(
                                                emprestimo.prazo
                                            )}

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

                                            {emprestimo.Acervo.isbn}

                                        </span>

                                    </td>

                                    {/* LIVRO */}
                                    <td className="px-6 py-5">

                                        <div className="
                                            flex items-center gap-3
                                        ">


                                            <div>

                                                <p className="
                                                    font-semibold
                                                    text-gray-800
                                                ">
                                                    {emprestimo.Acervo.titulo}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* AUTOR */}
                                    <td className="px-6 py-5">

                                        <div className="
                                            flex items-center gap-2
                                            text-gray-700
                                        ">

                                            {emprestimo.Acervo.autor}

                                        </div>

                                    </td>

                                    {/* AÇÕES */}
                                    {devolver && (

                                        <td className="px-6 py-5">

                                            <button
                                                onClick={() =>
                                                    handleDevolver(
                                                        emprestimo.id
                                                    )
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-xl
                                                    bg-green-500
                                                    px-4 py-2
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    shadow-md
                                                    transition-all
                                                    hover:scale-105
                                                    hover:bg-green-600
                                                "
                                            >

                                                <Undo2 size={16} />

                                                Devolver

                                            </button>

                                        </td>

                                    )}

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}