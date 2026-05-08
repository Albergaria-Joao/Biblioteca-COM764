"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useParams } from "next/navigation";

type Reserva = {
    id: string,
    createdAt: Date
    prazo: Date | null,
    Acervo: {
        isbn: string,
        titulo: string,
        autor: string,
    }


}

interface TabelaProps {
    //livros: Livro[];
    cargoUser: string;
}

export default function ReservasTabela({ cargoUser }: TabelaProps) {
    const [reservas, setReservas] = useState<Reserva[]>([]);

    const { id } = useParams();

    const router = useRouter();
    useEffect(() => {
        async function carregarReservas() {
            const response = await fetch(`/api/acervo/reserva/${id}`, {
                method: "GET",
            });

            const data = await response.json();
            console.log(data);
            setReservas(data);
        }
        console.log(reservas);
        carregarReservas();
    }, []);



    // const excluirLivro = async (id: string) => {
    //     const confirmacao = window.confirm("Tem certeza que deseja excluir este livro?");
    //     if (!confirmacao) return;
    //     const response = await fetch(`/api/acervo/${id}`, {
    //         method: "DELETE"
    //     });
    //     if (response.ok) {
    //         setLivros(prev => prev.filter(livro => livro.id !== id)); // Remove o livro da lista sem precisar recarregar
    //     }
    //     else {
    //         alert("ERRO NA CRIAÇÃO: " + (await response.json()).error);
    //     }
    // }

    return (
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

            {/* SCROLL AREA */}
            <div className="max-h-[500px] overflow-y-auto">

                <table className="w-full text-gray-700">

                    {/* HEADER AZUL */}
                    <thead className="bg-blue-700 text-white text-sm uppercase sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Data de reserva</th>
                            <th className="px-4 py-3 text-left">Prazo de devolução</th>
                            <th className="px-4 py-3 text-left">ISBN</th>
                            <th className="px-4 py-3 text-left">Título</th>
                            <th className="px-4 py-3 text-left">Autor</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reservas.map((reserva) => (
                            <tr
                                key={reserva.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td>Status</td>
                                <td className="px-4 py-3">{reserva.createdAt.toString()}</td>
                                <td className="px-4 py-3">{
                                    reserva.prazo !== null && reserva.prazo !== undefined ?
                                        reserva.prazo.toISOString()
                                        : "Livro não retirado"
                                }</td>
                                <td className="px-4 py-3">{reserva.Acervo.isbn}</td>
                                <td className="px-4 py-3">{reserva.Acervo.titulo}</td>
                                <td className="px-4 py-3">{reserva.Acervo.autor}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}