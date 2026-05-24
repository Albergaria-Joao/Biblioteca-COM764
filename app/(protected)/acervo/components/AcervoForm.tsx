"use client"

import { z } from "zod";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
// Depois, ver de colocar alguma pasta só com os tipos (ex: types/Livro.ts) e importar de lá, pra evitar repetição
type AcervoFormProps = {
    tipo: "adicionar" | "editar";
};


type LivroCadastro = {
    isbn: string,
    titulo: string,
    autor: string,
    editora: string,
    edicao?: string,
    anoPublicacao: number,
    genero: string,
    unidades: number,
}

const livroSchema = z.object({
    titulo: z.string(),
    isbn: z.string(),
    autor: z.string(),
    editora: z.string(),
    edicao: z.string().optional(),
    anoPublicacao: z.coerce.number().max(2040),
    genero: z.string(),
    unidades: z.coerce.number().min(0)
});


export default function AcervoForm({ tipo }: AcervoFormProps) {

    const [livroAtual, setLivroAtual] = useState<LivroCadastro>({
        titulo: "",
        isbn: "",
        autor: "",
        editora: "",
        edicao: "",
        anoPublicacao: 0,
        genero: "",
        unidades: 1,
    });

    const [livroPrevio, setLivroPrevio] = useState<LivroCadastro | null>(null);
    const [erroMensagem, setErroMensagem] = useState<string | null>(null);
    const router = useRouter();

    const searchParams = useSearchParams()
    const oid = searchParams.get('oid')

    useEffect(() => {
        async function carregarLivro() {
            const response = await fetch(`/api/acervo/${oid}`, {
                method: "GET"
            });
            const data = await response.json();
            setLivroAtual(data);
            setLivroPrevio(data);
            console.log(data);
        }
        carregarLivro();
    }, []);

    const editarLivro = async (livro: LivroCadastro) => {

        if (tipo === "adicionar") {
            console.log("ADICIONANDO LIVRO")
            const response = await fetch(`/api/acervo`, {
                method: 'POST',
                body: JSON.stringify({ livro: livro })
            });
            return response;
        }

        const response = await fetch(`/api/acervo/${oid}`, {
            method: 'PUT',
            body: JSON.stringify({ livro: livro, livroPrevio: livroPrevio })
        });
        return response;
    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //const formData = new FormData(e.currentTarget);
        //const dadosBrutos = Object.fromEntries(formData.entries());
        const dadosBrutos = livroAtual;
        console.log(dadosBrutos);
        const validacao = livroSchema.safeParse(dadosBrutos);

        if (!validacao.success) {
            console.error(validacao.error.format());
            const primeiroErro = validacao.error.issues[0]?.message || "Há erros de preenchimento nos dados.";
            setErroMensagem(primeiroErro);
            return;
        }
        const dados = validacao.data;
        console.log("Dados validados:", dados);
        const novoLivro: LivroCadastro = {
            titulo: dados.titulo,
            isbn: dados.isbn,
            autor: dados.autor,
            editora: dados.editora,
            edicao: dados.edicao,
            anoPublicacao: dados.anoPublicacao,
            genero: dados.genero,
            unidades: dados.unidades,
        }

        const res = await editarLivro(novoLivro);
        const resJson = await res.json();
        if (resJson?.error) {
            //alert("ERRO NA CRIAÇÃO: " + resJson.error);
            setErroMensagem("ERRO NA CRIAÇÃO: " + resJson.error)
        } else {
            // if (tipo === "adicionar") {
            //     alert("LIVRO ADICIONADO");
            // } else {
            //     alert("LIVRO EDITADO");
            // }
            router.push('/acervo');
            router.refresh();
        }
    }


    return (
        <div className="min-h-screen py-10 px-4">

            <form
                onSubmit={handleSubmit}
                onChange={(e: any) => {
                    const { name, value, type } = e.target;

                    setLivroAtual((prev) => ({
                        ...prev,
                        [name]:
                            type === "number"
                                ? Number(value)
                                : value
                    }));
                }}
                className="max-w-6xl mx-auto"
            >

                {/* CARD */}
                <div className="bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl overflow-hidden">

                    {/* HEADER */}
                    <div className="bg-blue-600 px-8 py-8 text-white">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            <div>

                                <h1 className="text-3xl md:text-4xl font-bold mt-2">
                                    {tipo === "adicionar"
                                        ? "Adicionar livro"
                                        : "Editar livro"}
                                </h1>

                            </div>

                            {/* CAPA */}
                            <div className="flex justify-center">

                                <img
                                    src={`https://books.google.com/books/content?vid=ISBN${livroAtual.isbn}&printsec=frontcover&img=1&zoom=1`}
                                    alt={livroAtual.titulo}
                                    className="w-32 h-44 rounded-xl object-cover shadow-2xl border-4 border-white/20 bg-white"
                                    onError={(e) => {
                                        e.currentTarget.src = "/sem-capa.png";
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    {/* BODY */}
                    <div className="p-8 md:p-10">
                        {erroMensagem && (
                            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
                                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>{erroMensagem}</span>
                            </div>
                        )}

                        {/* SEÇÃO */}
                        <div className="mb-10">

                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                Informações gerais
                            </h2>

                            <p className="text-sm text-gray-500 mb-6">
                                Preencha os dados do livro abaixo
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                {/* TÍTULO */}
                                <div className="md:col-span-8">
                                    <label
                                        htmlFor="titulo"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Título
                                    </label>

                                    <input
                                        type="text"
                                        name="titulo"
                                        id="titulo"
                                        defaultValue={livroAtual.titulo}
                                        required
                                        placeholder="Ex: Dom Casmurro"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* ISBN */}
                                <div className="md:col-span-4">
                                    <label
                                        htmlFor="isbn"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        ISBN
                                    </label>

                                    <input
                                        type="text"
                                        name="isbn"
                                        id="isbn"
                                        defaultValue={livroAtual.isbn}
                                        required
                                        placeholder="978-0-00-000000-0"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* AUTOR */}
                                <div className="md:col-span-6">
                                    <label
                                        htmlFor="autor"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Autor
                                    </label>

                                    <input
                                        type="text"
                                        name="autor"
                                        id="autor"
                                        defaultValue={livroAtual.autor}
                                        required
                                        placeholder="Ex: Machado de Assis"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* EDITORA */}
                                <div className="md:col-span-6">
                                    <label
                                        htmlFor="editora"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Editora
                                    </label>

                                    <input
                                        type="text"
                                        name="editora"
                                        id="editora"
                                        defaultValue={livroAtual.editora}
                                        required
                                        placeholder="Ex: Companhia das Letras"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* EDIÇÃO */}
                                <div className="md:col-span-3">
                                    <label
                                        htmlFor="edicao"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Edição
                                    </label>

                                    <input
                                        type="text"
                                        name="edicao"
                                        id="edicao"
                                        defaultValue={livroAtual.edicao}
                                        placeholder="2ª edição"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* ANO */}
                                <div className="md:col-span-3">
                                    <label
                                        htmlFor="anoPublicacao"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Ano
                                    </label>

                                    <input
                                        type="number"
                                        name="anoPublicacao"
                                        id="anoPublicacao"
                                        value={livroAtual.anoPublicacao}
                                        required
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* GÊNERO */}
                                <div className="md:col-span-3">
                                    <label
                                        htmlFor="genero"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Gênero
                                    </label>

                                    <input
                                        type="text"
                                        name="genero"
                                        id="genero"
                                        defaultValue={livroAtual.genero}
                                        placeholder="Romance"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                {/* UNIDADES */}
                                <div className="md:col-span-3">
                                    <label
                                        htmlFor="unidades"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Estoque
                                    </label>

                                    <input
                                        type="number"
                                        name="unidades"
                                        id="unidades"
                                        min="0"
                                        value={livroAtual.unidades}
                                        required
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* BOTÃO */}
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:from-blue-700 hover:to-indigo-700"
                        >
                            {tipo === "adicionar"
                                ? "Adicionar Livro"
                                : "Salvar Alterações"}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
}