"use client"

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
    BookOpen,
    CheckCircle2,
    QrCode,
    Mail,
    CalendarDays,
    ArrowLeft,
    Sparkles
} from "lucide-react";

import QRCode from "./QRCode";

import { enviarEmailQRCode } from "@/lib/email";

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

export default function ReservaToken({
    livro,
    email,
    WEBSITE_URL
}: Props) {

    const [reservado, setReservado] =
        useState<boolean>(false);

    const [reservaId, setReservaId] =
        useState<string>("");

    const [carregando, setCarregando] =
        useState<boolean>(false);

    const router = useRouter();

    const handleReserva = async () => {

        try {

            setCarregando(true);

            const response = await fetch(
                `/api/acervo/reserva`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        livroId: livro.id
                    })
                }
            );

            const data = await response.json()
                .catch(() => null);

            if (response.ok) {

                setReservado(true);

                setReservaId(data.id);

                const temp =
                    `${WEBSITE_URL}/acervo/ativar-reserva/${data.id}`;

                console.log("EMAIL EENVIADO", email);
                enviarEmailQRCode(
                    email,
                    livro.titulo,
                    livro.autor,
                    livro.isbn,
                    data.valiRes,
                    temp
                );

            } else {

                alert(
                    "ERRO NA RESERVA: " +
                    data?.error
                );

            }

        } catch (error) {

            console.error(error);

            alert("Erro ao realizar reserva");

        } finally {

            setCarregando(false);

        }
    };

    const urlQRCode =
        `${WEBSITE_URL}/acervo/ativar-reserva/${reservaId}`;

    return (

        <div className="
            min-h-screen
            p-6
        ">

            <div className="
                max-w-5xl
                mx-auto
            ">

                {/* CARD */}
                <div className="
                    overflow-hidden
                    rounded-3xl
                    border border-white/40
                    bg-white/70
                    backdrop-blur-xl
                    shadow-2xl
                ">

                    {/* HEADER */}
                    <div className="
                        bg-blue-600
                        px-8 py-10
                        text-white
                    ">

                        <div className="
                            flex flex-col lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-8
                        ">

                            {/* INFO */}
                            <div className="
                                flex items-center gap-6
                            ">

                                {/* CAPA */}
                                <img
                                    src={`https://books.google.com/books/content?vid=ISBN${livro.isbn}&printsec=frontcover&img=1&zoom=1`}
                                    alt={livro.titulo}
                                    className="
                                        w-32 h-44
                                        rounded-2xl
                                        object-cover
                                        shadow-2xl
                                        border-4
                                        border-white/20
                                        bg-white
                                    "
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/sem-capa.png";
                                    }}
                                />

                                {/* TEXTO */}
                                <div>
                                    <h1 className="
                                        text-3xl
                                        font-bold">Reservando:</h1>
                                    <h2 className="
                                        text-4xl
                                        font-bold
                                    ">
                                        {livro.titulo}
                                    </h2>

                                    <p className="
                                        text-blue-100
                                        text-lg
                                        mt-2
                                    ">
                                        {livro.autor}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* BODY */}
                    <div className="p-8 md:p-10">

                        {!reservado ? (

                            <div className="
                                grid grid-cols-1
                                lg:grid-cols-2
                                gap-10
                                items-start
                            ">

                                {/* DETALHES */}
                                <div>

                                    <div className="
                                        flex items-center gap-3
                                        mb-6
                                    ">

                                        <div>

                                            <h2 className="
                                                text-2xl
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

                                        <Info
                                            label="ISBN"
                                            value={livro.isbn}
                                        />

                                        <Info
                                            label="Editora"
                                            value={livro.editora}
                                        />

                                        <Info
                                            label="Edição"
                                            value={livro.edicao}
                                        />

                                        <Info
                                            label="Ano"
                                            value={String(
                                                livro.anoPublicacao
                                            )}
                                        />

                                        <Info
                                            label="Gênero"
                                            value={livro.genero}
                                        />

                                    </div>

                                </div>

                                {/* AÇÕES */}
                                <div>

                                    <div className="
                                        rounded-3xl
                                        bg-gradient-to-br
                                        from-blue-50
                                        to-indigo-50
                                        border border-blue-100
                                        p-8
                                    ">

                                        <div className="
                                            flex items-center gap-3
                                            mb-5
                                        ">

                                            <CheckCircle2
                                                size={24}
                                                className="text-blue-600"
                                            />

                                            <h2 className="
                                                text-2xl
                                                font-bold
                                                text-gray-800
                                            ">
                                                Confirmar reserva
                                            </h2>

                                        </div>

                                        <p className="
                                            text-gray-600
                                            leading-relaxed
                                            mb-8
                                        ">
                                            Após confirmar,
                                            um QR Code será
                                            gerado e enviado
                                            para seu email.
                                        </p>

                                        <div className="
                                            flex items-center gap-3
                                            rounded-2xl
                                            bg-white
                                            p-4
                                            shadow-sm
                                            border border-gray-100
                                            mb-8
                                        ">

                                            <Mail
                                                size={20}
                                                className="text-blue-600"
                                            />

                                            <div>

                                                <p className="
                                                    text-sm
                                                    text-gray-500
                                                ">
                                                    Email de envio
                                                </p>

                                                <p className="
                                                    font-semibold
                                                    text-gray-800
                                                ">
                                                    {email}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="
                                            flex flex-col gap-4
                                        ">

                                            <button
                                                onClick={handleReserva}
                                                disabled={carregando}
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    bg-blue-600
                                                    py-4
                                                    text-lg
                                                    font-bold
                                                    text-white
                                                    shadow-xl
                                                    transition-all
                                                    hover:scale-[1.02]
                                                    hover:bg-blue-700
                                                    disabled:opacity-50
                                                    disabled:cursor-not-allowed
                                                "
                                            >

                                                {carregando
                                                    ? "Reservando..."
                                                    : "Confirmar reserva"
                                                }

                                            </button>

                                            <button
                                                onClick={() =>
                                                    router.back()
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-2xl
                                                    bg-gray-200
                                                    py-4
                                                    text-lg
                                                    font-semibold
                                                    text-gray-700
                                                    transition-all
                                                    hover:bg-gray-300
                                                "
                                            >

                                                <ArrowLeft size={18} />

                                                Voltar

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="
                                flex flex-col
                                items-center
                                text-center
                            ">

                                {/* SUCESSO */}
                                {/* <div className="
                                    w-24 h-24
                                    rounded-full
                                    bg-green-100
                                    flex items-center justify-center
                                    mb-6
                                ">

                                    <CheckCircle2
                                        size={50}
                                        className="text-green-600"
                                    />

                                </div> */}

                                <h1 className="
                                    text-4xl
                                    font-bold
                                    text-gray-800
                                ">
                                    Reserva confirmada
                                </h1>

                                <p className="
                                    mt-4
                                    max-w-2xl
                                    text-lg
                                    text-gray-600
                                    leading-relaxed
                                ">
                                    Seu QR Code foi gerado
                                    com sucesso e enviado
                                    para o email cadastrado.
                                </p>

                                {/* CARD QR */}
                                <div className="
                                    mt-10
                                    rounded-3xl
                                    border border-gray-200
                                    bg-white
                                    p-8
                                    shadow-xl
                                ">

                                    <div className="
                                        flex items-center
                                        justify-center
                                        gap-3
                                        mb-6
                                    ">

                                        <QrCode
                                            size={26}
                                            className="text-blue-600"
                                        />

                                        <h2 className="
                                            text-2xl
                                            font-bold
                                            text-gray-800
                                        ">
                                            QR Code da reserva
                                        </h2>

                                    </div>

                                    <QRCode url={urlQRCode} />

                                </div>

                                {/* INFO */}
                                <div className="
                                    mt-8
                                    flex flex-wrap
                                    justify-center
                                    gap-4
                                ">

                                    <div className="
                                        rounded-2xl
                                        bg-blue-100
                                        px-5 py-3
                                        text-blue-700
                                        font-medium
                                    ">
                                        {livro.titulo}
                                    </div>

                                    <div className="
                                        rounded-2xl
                                        bg-gray-100
                                        px-5 py-3
                                        text-gray-700
                                        font-medium
                                    ">
                                        ISBN: {livro.isbn}
                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );
}

/* COMPONENTE INFO */
function Info({
    label,
    value
}: {
    label: string;
    value: string;
}) {

    return (

        <div className="
            rounded-2xl
            border border-gray-100
            bg-white
            px-5 py-4
            shadow-sm
        ">

            <p className="
                text-sm
                text-gray-500
                mb-1
            ">
                {label}
            </p>

            <p className="
                font-semibold
                text-gray-800
            ">
                {value}
            </p>

        </div>

    );
}