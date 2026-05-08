"use client"

import { z } from "zod";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
// Depois, ver de colocar alguma pasta só com os tipos (ex: types/Livro.ts) e importar de lá, pra evitar repetição

interface Props {
    reservaId: string;
    dataPrazo: Date;
    dataRetirada: Date;
}

const tokenSchema = z.object({
    tkn: z.string().regex(/^\d{6}$/)
});



export default function ReservaToken({ reservaId, dataPrazo, dataRetirada }: Props) {

    const [token, setToken] = useState<string | null>(null);
    const [reservado, setReservado] = useState<boolean>(false);
    const searchParams = useSearchParams()
    const oid = searchParams.get('oid')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        tokenSchema.safeParse(token);

        e.preventDefault();
        const response = await fetch(`/api/acervo/reserva`, {
            method: 'PUT',
            body: JSON.stringify({ id: reservaId, dataPrazo: dataPrazo, dataRetirada: dataRetirada, token: token })
        });
        if (response.ok) {
            setReservado(true);
        } else {
            alert("ERRO NA RESERVA: " + (await response.json()).error);
        }
    }


    return (
        <div>
            {!reservado && (
                <form onSubmit={handleSubmit} onChange={(e) => {
                    setToken(e.target.value);
                }} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-gray-800">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">Informações do Livro</h2>

                    {/* Grid para informações principais */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">

                        {/* Título: Ocupa mais espaço */}
                        <div className="flex flex-col md:col-span-8">
                            <label htmlFor="titulo" className="mb-1 font-medium text-sm">TOKEN DA RESERVA</label>
                            <input type="text" name="titulo" id="titulo" required placeholder="Token numérico gerado"
                                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                        </div>


                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
                    >
                        Ativar reserva
                    </button>
                </form>)}


            {reservado && (
                <div>
                    <h2>Reserva efetuada com sucesso!</h2>
                    <ul>
                        <li>Data da reserva: {dataRetirada.toISOString()}</li>
                        <li>Prazo de devolução: {dataPrazo.toISOString()}</li>
                    </ul>
                </div>
            )}

        </div>

    );
}