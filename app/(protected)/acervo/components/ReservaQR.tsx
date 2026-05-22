"use client"

import { z } from "zod";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import { actionEmailQRCode } from "@/app/actions/reserva";
import QRCode from "./QRCode";
import { enviarEmailQRCode } from "@/lib/email";
// Depois, ver de colocar alguma pasta só com os tipos (ex: types/Livro.ts) e importar de lá, pra evitar repetição

interface Props {
    livro: {
        id: string;
        isbn: string;
        titulo: string;
        autor: string;
        editora: string;
        edicao: string;
        anoPublicacao: number;
        genero: string;
    },
    email: string,
    WEBSITE_URL: string
}



export default function ReservaToken({ livro, email, WEBSITE_URL }: Props) {

    const [token, setToken] = useState<string | null>(null);
    const [reservado, setReservado] = useState<boolean>(false);
    const [reservaId, setReservaId] = useState<string>("");
    //const searchParams = useSearchParams()
    //const oid = searchParams.get('oid')

    const router = useRouter();
    console.log(process.env.WEBSITE_URL);
    const handleReserva = async () => {

        const response = await fetch(`/api/acervo/reserva`, {
            method: 'POST',
            body: JSON.stringify({ livroId: livro.id })
        });

        const data = await response.json().catch(() => null);
        console.log(data.id);

        if (response.ok) {
            setReservado(true);
            setReservaId(data.id);
            console.log("ID RESERVA: ", data.id)
            const temp = `${WEBSITE_URL}/acervo/ativar-reserva/${data.id}`
            console.log("TEMP: ", temp)
            enviarEmailQRCode(email, livro.titulo, livro.autor, livro.isbn, data.valiRes, temp)
        } else {
            alert("ERRO NA RESERVA: " + (await response.json()).error);
        }
    }

    const urlQRCode = `${WEBSITE_URL}/acervo/ativar-reserva/${reservaId}`;

    return (
        <div>
            {!reservado && (
                <div>
                    <button
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
                        onClick={handleReserva}
                    >
                        Confirmar reserva
                    </button>
                    <button
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
                        onClick={() => { router.back() }}
                    >
                        Cancelar
                    </button>
                </div>
            )}


            {reservado && (
                <div>
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
            )}

        </div>

    );
}