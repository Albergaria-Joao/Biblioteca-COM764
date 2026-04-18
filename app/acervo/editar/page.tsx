"use client";
import { z } from "zod";
import { use, useState, useEffect } from "react";
import AcervoForm from "../components/AcervoForm";
import { useSearchParams } from 'next/navigation'

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
  unidades: z.coerce.number().min(0)
});

export default function EditarAcervoPage() {

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

    const editarLivro = async  (livro: LivroCadastro) => {
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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Editar livro</h1>
            <AcervoForm tipo="editar" livroAtual={livroAtual} setLivroAtual={setLivroAtual} handleSubmit={handleSubmit} />
        </div>
    );
}