"use client"

import { z } from "zod";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
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
  pin: z.string().regex(/^\d{6}$/)
});


export default function ReservaToken({ tipo }: AcervoFormProps) {

    const [token, setToken] = useState<string | null>(null);

    const searchParams = useSearchParams()
    const oid = searchParams.get('oid')

    const editarLivro = async (livro: LivroCadastro) => {
        
        if (!livroPrevio) {
            const response = await fetch(`/api/acervo/${oid}`, {
                method:'POST',
                body: JSON.stringify({livro: livro})
            });
            return response;
        }

        const response = await fetch(`/api/acervo/${oid}`, {
            method:'PUT',
            body: JSON.stringify({livro: livro, livroPrevio: livroPrevio})
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
            alert("Há erros de formato nos dados");
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
            alert("ERRO NA CRIAÇÃO: " + resJson.error);
        } else {
            alert("LIVRO EDITADO");
        }
    }


    return (
    <form onSubmit={handleSubmit} onChange={(e) => {
        setToken(e.target.value);
    }} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-gray-800">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Informações do Livro</h2>
        
        {/* Grid para informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
            
            {/* Título: Ocupa mais espaço */}
            <div className="flex flex-col md:col-span-8">
            <label htmlFor="titulo" className="mb-1 font-medium text-sm">TOKEN DA RESERVA</label>
            <input type="text" name="titulo" id="titulo" required placeholder="Ex: Dom Casmurro" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            
        </div>

        <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
        >
            Ativar reserva
        </button>
    </form>
    );
}