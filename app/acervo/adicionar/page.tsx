"use client";
import { z } from "zod";
import { useState } from "react";

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
  anoPublicacao: z.coerce.number(),
  genero: z.string(),
  unidades: z.number().min(0)
});

export default function AdicionarAcervoPage() {

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

    const criarLivro = async  (livro: LivroCadastro) => {
        const response = await fetch("/api/acervo", {
            method:'POST',
            body: JSON.stringify({livro: livro})
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

        const res = await criarLivro(novoLivro);
        const resJson = await res.json();
        if (resJson?.error) {
            alert("ERRO NA CRIAÇÃO: " + resJson.error);
        } else {
            alert("LIVRO ADICIONADO");
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Adicionar Item ao Acervo</h1>
            <form onSubmit={handleSubmit} onChange={(e) => {
                const { name, value } = e.target;
                setLivroAtual((prev) => ({ ...prev, [name]: value }));
            }} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-gray-800">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">Informações do Livro</h2>
                
                {/* Grid para informações principais */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                    
                    {/* Título: Ocupa mais espaço */}
                    <div className="flex flex-col md:col-span-8">
                    <label htmlFor="titulo" className="mb-1 font-medium text-sm">Título do Livro</label>
                    <input type="text" name="titulo" id="titulo" required placeholder="Ex: Dom Casmurro" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* ISBN: Ocupa menos espaço lateral */}
                    <div className="flex flex-col md:col-span-4">
                    <label htmlFor="isbn" className="mb-1 font-medium text-sm">ISBN</label>
                    <input type="text" name="isbn" id="isbn" required placeholder="978-0-00-000000-0" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* Autor */}
                    <div className="flex flex-col md:col-span-6">
                    <label htmlFor="autor" className="mb-1 font-medium text-sm">Autor</label>
                    <input type="text" name="autor" id="autor" required placeholder="Ex: Machado de Assis" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* Editora */}
                    <div className="flex flex-col md:col-span-6">
                    <label htmlFor="editora" className="mb-1 font-medium text-sm">Editora</label>
                    <input type="text" name="editora" id="editora" required placeholder="Ex: Companhia das Letras" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* Edição */}
                    <div className="flex flex-col md:col-span-3">
                    <label htmlFor="edicao" className="mb-1 font-medium text-sm">Edição</label>
                    <input type="text" name="edicao" id="edicao" placeholder="Ex: 2ª Edição" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* Ano de Publicação */}
                    <div className="flex flex-col md:col-span-3">
                    <label htmlFor="anoPublicacao" className="mb-1 font-medium text-sm">Ano de Publicação</label>
                    <input type="number" name="anoPublicacao" id="anoPublicacao" required placeholder="Ex: 1899" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* Gênero */}
                    <div className="flex flex-col md:col-span-3">
                    <label htmlFor="genero" className="mb-1 font-medium text-sm">Gênero</label>
                    <input type="text" name="genero" id="genero" placeholder="Ex: Romance" 
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>

                    {/* Unidades */}
                    <div className="flex flex-col md:col-span-3">
                    <label htmlFor="unidades" className="mb-1 font-medium text-sm">Unidades (Estoque)</label>
                    <input type="number" name="unidades" id="unidades" required min="0" defaultValue="1"
                        className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
                >
                    Cadastrar Livro
                </button>
            </form>
        </div>
    );
}