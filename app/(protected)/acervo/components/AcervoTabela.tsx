"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Search } from "lucide-react";

type Livro = {
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

interface TabelaProps {
  livros: Livro[];
  cargoUser: string;
}

export default function AcervoTabela({ cargoUser, livros }: TabelaProps) {
  //const [livros, setLivros] = useState<Livro[]>([]);

  const router = useRouter();
  // useEffect(() => {
  //   async function carregarLivros() {
  //     const response = await fetch("/api/acervo", {
  //       method: "GET"
  //     });

  //     const data = await response.json();
  //     setLivros(data);
  //   }

  //   carregarLivros();
  // }, []);



  const excluirLivro = async (id: string) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este livro?");
    if (!confirmacao) return;
    const response = await fetch(`/api/acervo/${id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      // setLivros(prev => prev.filter(livro => livro.id !== id)); // Remove o livro da lista sem precisar recarregar
      router.refresh(); // Recarrega a página para atualizar a lista
    }
    else {
      alert("ERRO NA CRIAÇÃO: " + (await response.json()).error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6">

      {/* TOPO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <p className="text-sm text-gray-500">
          Exibindo 1 - {livros.length} de {livros.length}
        </p>

        <div className="flex gap-3">

          {/* BUSCA */}
          <div className="relative">
            <input
              type="text"
              placeholder="Campo busca"
              className="pl-10 pr-4 py-2 rounded-lg border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <span className="absolute left-3 top-3.5 text-gray-400">
              <Search size={16} />
            </span>
          </div>

          <select className="px-4 py-2 rounded-lg border bg-white shadow-sm">
            <option>Ordenar por</option>
            <option>Título</option>
            <option>Autor</option>
            <option>Ano</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {livros.map((livro) => (

          <div
            key={livro.id}
            className="bg-[#f7f7f7] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 relative min-h-[430px]"
          >

            <div className="flex justify-center">

              <div className="relative">

                <img
                  src={`https://books.google.com/books/content?vid=ISBN${livro.isbn}&printsec=frontcover&img=1&zoom=1`}
                  alt={livro.titulo}
                  className="w-32 h-44 object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/sem-capa.png";
                  }}
                />

              </div>

            </div>

            {/* TÍTULO */}
            <h2 className="text-center font-bold text-lg mt-4 line-clamp-2 ">
              {livro.titulo}
            </h2>

            {/* AUTOR */}
            <p className="text-center text-gray-600 text-sm mt-0 line-clamp-2">
              {livro.autor}
            </p>

            <p className="text-center text-gray-600 text-sm mt-4 line-clamp-2">
              ISBN: {livro.isbn}
            </p>

            {/* GÊNERO */}
            <div className="flex justify-center mt-4">
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                {livro.genero}
              </span>
            </div>

            <p className="text-center text-gray-600 text-sm mt-4 line-clamp-2">
              Unds. disponíveis: {livro.unidades}
            </p>

            {/* BOTÕES */}
            <div className="mt-6 flex gap-2">

              {(cargoUser === "ADMIN" || cargoUser === "BIBLIO") && (
                <>
                  <Link
                    href={`/acervo/editar?oid=${livro.id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-600 text-white py-2 rounded-lg transition text-sm"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => excluirLivro(livro.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition text-sm"
                  >
                    Excluir
                  </button>
                </>
              )}

              {cargoUser === "USER" && (
                <Link
                  href={
                    livro.unidades > 0
                      ? `/acervo/reservar/${livro.id}`
                      : "#"
                  }
                  className={`flex-1 text-center py-2 rounded-lg text-white transition text-sm ${livro.unidades > 0
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Reservar
                </Link>
              )}

            </div>

          </div>

        ))}
      </div>
    </div>
  );
}