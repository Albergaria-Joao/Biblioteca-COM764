"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'; 

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

export default function AcervoTabela({ cargoUser, livros }: TabelaProps ) {
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
      setLivros(prev => prev.filter(livro => livro.id !== id)); // Remove o livro da lista sem precisar recarregar
    }
    else {
        alert("ERRO NA CRIAÇÃO: " + (await response.json()).error);
    }
  }

  return (
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
                  {cargoUser === "ADMIN" || cargoUser === "BIBLIO" && (
                  <>
                    <td className="px-4 py-3"><button className="bg-blue-500 text-white py-1 px-3 rounded-md"><Link href={`/acervo/editar?oid=${livro.id}`}>Editar</Link></button></td>
                    <td className="px-4 py-3"><button className="bg-red-500 text-white py-1 px-3 rounded-md" onClick={() => excluirLivro(livro.id)}>Excluir</button></td>
                  </>
									)}
									{cargoUser === "USER" && (
										<>
											<td className="px-4 py-3"><button className="bg-blue-500 text-white py-1 px-3 rounded-md" disabled={ livro.unidades <= 0 }><Link href={ livro.unidades > 0 ? `/acervo/reservar/${livro.id}` : `#`}>Reservar</Link></button></td>
										</>
									)}
                  </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
  );
}