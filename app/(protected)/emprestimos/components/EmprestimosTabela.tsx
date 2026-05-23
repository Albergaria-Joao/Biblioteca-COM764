"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useParams } from "next/navigation";

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
    //livros: Livro[];
    emprestimos: Emprestimo[];
    devolver: boolean;
}

export default function EmprestimosTabela({ emprestimos, devolver }: TabelaProps) {

    const router = useRouter();


    const handleDevolver = async (id: string) => {
        try {
            const response = await fetch(`/api/reserva-operacoes/${id}`, {
                method: "PUT",
            });
            if (response.ok) {
                console.log("Livro devolvido com sucesso!");
                router.refresh();
            } else {
                console.error("Erro ao devolver livro");
            }
        } catch (error) {
            console.error("Erro ao devolver livro:", error);
        }
    };


    return (
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

            {/* SCROLL AREA */}
            <div className="max-h-[500px] overflow-y-auto">

                <table className="w-full text-gray-700">

                    {/* HEADER AZUL */}
                    <thead className="bg-blue-700 text-white text-sm uppercase sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left">Usuário</th>
                            <th className="px-4 py-3 text-left">Data de retirada</th>
                            <th className="px-4 py-3 text-left">Prazo de devolução</th>
                            <th className="px-4 py-3 text-left">ISBN</th>
                            <th className="px-4 py-3 text-left">Título</th>
                            <th className="px-4 py-3 text-left">Autor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {emprestimos.map((emprestimo) => (
                            <tr
                                key={emprestimo.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">{emprestimo.Usuario.nome}</td>
                                <td className="px-4 py-3">{emprestimo.retirada.toISOString()}</td>
                                <td className="px-4 py-3">{emprestimo.prazo.toISOString()}</td>
                                <td className="px-4 py-3">{emprestimo.Acervo.isbn}</td>
                                <td className="px-4 py-3">{emprestimo.Acervo.titulo}</td>
                                <td className="px-4 py-3">{emprestimo.Acervo.autor}</td>
                                {devolver && (<td className="px-4 py-3"><button onClick={() => handleDevolver(emprestimo.id)}>DEVOLVER LIVRO</button></td>)}
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}