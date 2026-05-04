"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { METHODS } from "http";

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
  const { uid } = useParams(); // ✅ no topo

  useEffect(() => {

    if (!uid) return;

    async function carregarUsuarios() {
      const response = await fetch(`/api/usuarios/aprovar?id=${uid}`);
      const data = await response.json();

      // findUnique retorna objeto, não array
      setUsuarios(data ? [data] : []);
    }

    carregarUsuarios();
  }, [uid]);

  async function atualizarUsuario(id: number, status: string) {
    try {
      const response = await fetch("/api/usuarios/aprovar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      alert(`Usuário ${status}!`);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar usuário");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Detalhes do Usuário</h1>

        {usuarios.length === 0 ? (
          <p className="text-center text-gray-500">Carregando usuário...</p>
        ) : (
          usuarios.map((user) => (
            <div key={user.id} className="space-y-3">
              <div>
                <span className="font-semibold">Nome:</span>
                <p className="text-gray-700">{user.nome}</p>
              </div>

              <div>
                <span className="font-semibold">Email:</span>
                <p className="text-gray-700">{user.email}</p>
              </div>

              <div>
                <span className="font-semibold">CPF:</span>
                <p className="text-gray-700">{user.cpf}</p>
              </div>

              <div>
                <span className="font-semibold">Telefone:</span>
                <p className="text-gray-700">{user.telefone}</p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => atualizarUsuario(user.id, "ATIVADO")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition"
                >
                  Aprovar
                </button>

                <button
                  onClick={() => atualizarUsuario(user.id, "SUSPENSO")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
                >
                  Recusar
                </button>
              </div>

              <button
                onClick={() => router.back()}
                className="w-full mt-4 text-sm text-gray-500 hover:underline"
              >
                Voltar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}