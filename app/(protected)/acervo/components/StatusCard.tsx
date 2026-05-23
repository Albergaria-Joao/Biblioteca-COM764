// components/StatusCard.tsx

"use client";

import Link from "next/link";
import {
    AlertTriangle,
    BookX,
    ArrowLeft,
    LibraryBig
} from "lucide-react";

type Props = {
    titulo: string;
    descricao: string;
    tipo?: "erro" | "warning";
};

export default function StatusCard({
    titulo,
    descricao,
    tipo = "warning"
}: Props) {

    return (

        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            p-6
            bg-gradient-to-br
            from-gray-100
            via-gray-200
            to-gray-300
        ">

            <div className="
                max-w-xl
                w-full
                overflow-hidden
                rounded-3xl
                border border-white/40
                bg-white/80
                backdrop-blur-xl
                shadow-2xl
            ">

                {/* HEADER */}
                <div className={`
                    px-8 py-10 text-white
                    ${tipo === "erro"
                        ? "bg-red-500"
                        : "bg-amber-500"}
                `}>

                    <div className="
                        flex
                        items-center
                        gap-5
                    ">

                        <div className="
                            w-20 h-20
                            rounded-2xl
                            bg-white/20
                            flex
                            items-center
                            justify-center
                            shrink-0
                        ">

                            {tipo === "erro"
                                ? <BookX size={40} />
                                : <AlertTriangle size={40} />
                            }

                        </div>

                        <div>

                            <p className="
                                uppercase
                                tracking-widest
                                text-sm
                                font-semibold
                                opacity-90
                            ">
                                Biblioteca
                            </p>

                            <h1 className="
                                text-3xl
                                font-bold
                                mt-1
                            ">
                                {titulo}
                            </h1>

                        </div>

                    </div>

                </div>

                {/* BODY */}
                <div className="p-8">

                    <p className="
                        text-gray-600
                        text-lg
                        leading-relaxed
                    ">
                        {descricao}
                    </p>

                    <div className="
                        mt-8
                        flex
                        flex-col
                        sm:flex-row
                        gap-4
                    ">

                        <Link
                            href="/acervo"
                            className="
                                flex-1
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-blue-600
                                px-6 py-4
                                text-lg
                                font-semibold
                                text-white
                                shadow-lg
                                transition-all
                                hover:scale-[1.02]
                                hover:bg-blue-700
                            "
                        >

                            <ArrowLeft size={20} />

                            Voltar ao acervo

                        </Link>


                    </div>

                </div>

            </div>

        </div>

    );
}