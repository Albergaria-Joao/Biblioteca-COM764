"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, House } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-slate-100
            via-gray-100
            to-slate-200
            px-4
        ">

            <div className="
                w-full
                max-w-2xl
                rounded-3xl
                bg-white/80
                backdrop-blur-xl
                border
                border-white/40
                shadow-2xl
                overflow-hidden
            ">

                {/* HEADER */}
                <div className="
                    bg-gradient-to-r
                    from-red-500
                    to-rose-600
                    px-8
                    py-10
                    text-white
                    text-center
                ">
                    <h1 className="
                        text-4xl
                        font-bold
                        mb-3
                    ">
                        Oops...
                    </h1>

                    <p className="
                        text-red-100
                        text-lg
                        leading-relaxed
                        max-w-lg
                        mx-auto
                    ">
                        Ocorreu um erro inesperado durante a operação.
                    </p>

                </div>

                {/* BODY */}
                <div className="
                    p-8
                    md:p-10
                ">

                    <div className="
                        rounded-2xl
                        border
                        border-red-100
                        bg-red-50
                        p-5
                        mb-8
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-red-700
                            mb-2
                        ">
                            Detalhes do erro
                        </p>

                        <p className="
                            text-sm
                            text-red-600
                            break-words
                        ">
                            Se este é seu primeiro acesso, aguarde um bibliotecário aprovar seu cadastro.
                            Tente fazer login novamente.
                        </p>

                    </div>

                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        gap-4
                    ">

                        <button
                            onClick={() => reset()}
                            className="
                                flex-1
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                                py-4
                                px-6
                                transition-all
                                duration-300
                                hover:scale-[1.01]
                                shadow-lg
                            "
                        >

                            <RefreshCcw size={20} />

                            Tentar novamente

                        </button>

                        <Link
                            href="/"
                            className="
                                flex-1
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                hover:bg-gray-50
                                text-gray-700
                                font-semibold
                                py-4
                                px-6
                                transition-all
                                duration-300
                            "
                        >
                            Voltar ao início

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );
}