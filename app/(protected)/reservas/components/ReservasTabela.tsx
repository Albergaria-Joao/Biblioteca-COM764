"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useParams } from "next/navigation";

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
    //livros: Livro[];
    reservas: Reserva[];
    cancelar: boolean;
}

export default function ReservasTabela({ reservas, cancelar }: TabelaProps) {

    const router = useRouter();


    const handleCancelar = async (id: string) => {
        try {
            const response = await fetch(`/api/reserva-operacoes/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                console.log("Reserva cancelada com sucesso!");
                router.refresh();
            } else {
                console.error("Erro ao cancelar reserva.");
            }
        } catch (error) {
            console.error("Erro ao cancelar reserva:", error);
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
                            {cancelar && (<th className="px-4 py-3 text-left">Usuário</th>)}
                            <th className="px-4 py-3 text-left">Data de reserva</th>
                            <th className="px-4 py-3 text-left">Validade da reserva</th>
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
                                {cancelar && (<td className="px-4 py-3">{reserva.Usuario.nome}</td>)}
                                <td className="px-4 py-3">{reserva.createdAt.toISOString()}</td>
                                <td className="px-4 py-3">{reserva.valiRes.toISOString()}</td>
                                <td className="px-4 py-3">{reserva.Acervo.isbn}</td>
                                <td className="px-4 py-3">{reserva.Acervo.titulo}</td>
                                <td className="px-4 py-3">{reserva.Acervo.autor}</td>
                                {cancelar && (<td className="px-4 py-3"><button onClick={() => handleCancelar(reserva.id)}>CANCELAR RESERVA</button></td>)}
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}