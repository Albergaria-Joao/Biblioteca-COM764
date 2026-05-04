"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();

  const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;

  useEffect(() => {
    if (!uid) return;

    async function carregarUsuarios() {
      try {
        const response = await fetch(`/api/usuarios/aprovar?id=${uid}`);

        if (!response.ok) {
          console.error("Erro na API:", response.status);
          return;
        }

        const data = await response.json();
        console.log("DATA:", data);

        setUsuarios(data ? [data] : []);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarUsuarios();
  }, [uid]);

  async function atualizarUsuario(id: string, status: string) {
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
      router.back(); // volta após ação
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar usuário");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-6 space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Detalhes do Usuário
        </h1>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-500">Carregando usuário...</p>

        ) : usuarios.length === 0 ? (
          /* NÃO ENCONTRADO */
          <p className="text-center text-red-500">Usuário não encontrado</p>

        ) : (
          usuarios.map((user) => (
            <div key={user.id} className="space-y-4">

              {/* CARD DE DADOS */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3 border">

                <div>
                  <span className="text-sm text-gray-500">Nome</span>
                  <p className="text-gray-800 font-medium">{user.nome}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-gray-800">{user.email}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">CPF</span>
                  <p className="text-gray-800">{user.cpf || "-"}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Telefone</span>
                  <p className="text-gray-800">{user.telefone || "-"}</p>
                </div>
              </div>

              {/* BOTÕES */}
              <div className="flex flex-col gap-3 mt-4">

                <button
                  onClick={() => atualizarUsuario(user.id, "ATIVADO")}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
                >
                  Aprovar
                </button>

                <button
                  onClick={() => atualizarUsuario(user.id, "SUSPENSO")}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-red-700 transition"
                >
                  Recusar
                </button>

              </div>

              {/* VOLTAR */}
              <button
                onClick={() => router.back()}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Voltar
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}