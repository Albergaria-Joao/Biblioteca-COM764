"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";

type Livro= {
  id: string,
  isbn: string,
  titulo: string,
  autor: string,
  editora: string,
  edicao: string,
  anoPublicacao: number,
  genero: string,
  unidades: number,
}

export default function AcervoPage() {

  const [livros, setLivros] = useState<Livro[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function carregarLivros() {
      const response = await fetch("/api/acervo", {
        method: "GET"
      });

      const data = await response.json();
      setLivros(data);
    }

    carregarLivros();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button onClick={logout} className="p-1.5 pr-3 pl-3 bg-red-500 text-white rounded-xl cursor-pointer">Sair</button> {/*Teste de botão de logout com server action*/}
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Lista de Livros
        </h1>

        {/* BOTÃO PERFIL */}
        <button
          onClick={() => router.push("/perfil")}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-600 transition"
        >
          <img
            src="/user.png"
            alt="Foto do usuário"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* CARD TABELA */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

        {/* SCROLL AREA */}
        <div className="max-h-[500px] overflow-y-auto">

          <table className="w-full text-gray-700">

            {/* HEADER AZUL */}
            <thead className="bg-blue-700 text-white text-sm uppercase sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">ISBN</th>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Autor</th>
                <th className="px-4 py-3 text-left">Editora</th>
                <th className="px-4 py-3 text-left">Ano</th>
                <th className="px-4 py-3 text-left">Edição</th>
                <th className="px-4 py-3 text-left">Gênero</th>
                <th className="px-4 py-3 text-left">Unidades</th>
              </tr>
            </thead>

            <tbody>
              {livros.map((livro) => (
                <tr
                  key={livro.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{livro.isbn}</td>
                  <td className="px-4 py-3">{livro.titulo}</td>
                  <td className="px-4 py-3">{livro.autor}</td>
                  <td className="px-4 py-3">{livro.editora}</td>
                  <td className="px-4 py-3">{livro.anoPublicacao}</td>
                  <td className="px-4 py-3">{livro.edicao}</td>
                  <td className="px-4 py-3">{livro.genero}</td>
                  <td className="px-4 py-3">{livro.unidades}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}