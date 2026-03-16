"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Usuario = {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
}

export default function UsuariosPage() {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function carregarUsuarios() {
      const response = await fetch("/api/usuarios", {
        method: "GET"
      });

      const data = await response.json();
      setUsuarios(data);
    }

    carregarUsuarios();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Lista de Usuários
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
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">CPF</th>
                <th className="px-4 py-3 text-left">Telefone</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{usuario.id}</td>
                  <td className="px-4 py-3">{usuario.nome}</td>
                  <td className="px-4 py-3">{usuario.email}</td>
                  <td className="px-4 py-3">{usuario.cpf}</td>
                  <td className="px-4 py-3">{usuario.telefone}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}