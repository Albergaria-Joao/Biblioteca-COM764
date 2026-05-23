"use client"

import { useMemo, useState } from "react";
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

  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("");

  const livrosFiltrados = useMemo(() => {

    let resultado = livros.filter((livro) => {

      const termo = busca.toLowerCase();

      return (
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo) ||
        livro.isbn.toLowerCase().includes(termo) ||
        livro.genero.toLowerCase().includes(termo)
      );
    });

    switch (ordenacao) {

      case "titulo":
        resultado.sort((a, b) =>
          a.titulo.localeCompare(b.titulo)
        );
        break;

      case "autor":
        resultado.sort((a, b) =>
          a.autor.localeCompare(b.autor)
        );
        break;

      case "ano":
        resultado.sort((a, b) =>
          a.anoPublicacao - b.anoPublicacao
        );
        break;
    }

    return resultado;

  }, [livros, busca, ordenacao]);

  const excluirLivro = async (id: string) => {

    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir este livro?"
    );

    if (!confirmacao) return;

    const response = await fetch(`/api/acervo/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      router.refresh();
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
          Exibindo 1 - {livrosFiltrados.length} de {livros.length}
        </p>

        <div className="flex gap-3">

          {/* BUSCA */}
          <div className="relative">

            <input
              type="text"
              placeholder="Buscar livro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="
                            w-full
                            rounded-2xl
                            border border-gray-200
                            bg-white/80
                            py-3
                            pl-11
                            pr-4
                            shadow-sm
                            outline-none
                            transition-all
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                        "
            />

            <span className="absolute left-3 top-3.5 text-gray-400">
              <Search size={24} />
            </span>

          </div>

          {/* ORDENAÇÃO */}
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="
                            rounded-2xl
                            border border-gray-200
                            bg-white/80
                            py-3
                            pr-4
                            shadow-sm
                            outline-none
                            transition-all
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                        "
          >
            <option value="">Ordenar por</option>
            <option value="titulo">Título</option>
            <option value="autor">Autor</option>
            <option value="ano">Ano</option>
          </select>

        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {livrosFiltrados.map((livro) => (

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

            <h2 className="text-center font-bold text-lg mt-4 line-clamp-2">
              {livro.titulo}
            </h2>

            <p className="text-center text-gray-600 text-sm mt-0 line-clamp-2">
              {livro.autor}
            </p>
            <p className="text-center text-gray-600 text-sm mt-0 line-clamp-2">
              {livro.anoPublicacao}
            </p>

            <p className="text-center text-gray-600 text-sm mt-4 line-clamp-2">
              ISBN: {livro.isbn}
            </p>

            <div className="flex justify-center mt-4">
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                {livro.genero}
              </span>
            </div>

            <p className="text-center text-gray-600 text-sm mt-4 line-clamp-2">
              Unds. disponíveis: {livro.unidades}
            </p>

            <div className="mt-6 flex gap-2">

              {(cargoUser === "ADMIN" || cargoUser === "BIBLIO") && (
                <>
                  <Link
                    href={`/acervo/editar?oid=${livro.id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm"
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