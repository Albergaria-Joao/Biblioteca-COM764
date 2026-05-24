"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Phone } from "lucide-react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  suspenso?: boolean;
  endereco: {
    cep: string;
    numero: string;
  };
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<Usuario | null>(null);
  const [mensagem, setMensagem] = useState("");

  async function carregarUsuarios() {
    const response = await fetch("/api/usuarios");
    const data = await response.json();
    setUsuarios(data);
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function suspenderUsuario() {
    if (!usuarioSelecionado) return;

    try {

      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usuarioSelecionado.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao remover usuário");
      }

      setMensagem(
        `${usuarioSelecionado.nome} foi ${usuarioSelecionado.suspenso
          ? "reativado"
          : "suspenso"
        } com sucesso.`
      );


      await carregarUsuarios();


      setUsuarioSelecionado(null);


      setTimeout(() => {
        setMensagem("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao suspender usuário.");
    }
  }

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();

    return usuarios.filter((usuario) => {
      return (
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.cpf?.includes(termo)
      );
    });
  }, [usuarios, busca]);

  return (
    <div className="space-y-6 p-6 mx-auto">
      {/* TOPO */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Lista de usuários
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {usuariosFiltrados.length} usuários encontrados
          </p>
        </div>

        {/* BUSCA */}
        <div className="relative w-full lg:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white/80 py-3 pl-11 pr-4 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex items-center justify-between">
        <div>
          {usuarioSelecionado && (
            <p className="text-sm text-gray-600">
              Selecionado:{" "}
              <span className="font-semibold">
                {usuarioSelecionado.nome}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={suspenderUsuario}
          disabled={!usuarioSelecionado}
          className={`rounded-2xl px-5 py-3 font-medium shadow-sm transition-all
            ${usuarioSelecionado
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Suspender
        </button>
      </div>

      {/* ALERTA */}
      {mensagem && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 shadow-sm">
          {mensagem}
        </div>
      )}

      {/* TABELA */}
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl">
        <div className="overflow-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-blue-600 text-white text-sm uppercase tracking-wide">
                <th className="px-6 py-5 text-left font-semibold">Usuário</th>
                <th className="px-6 py-5 text-left font-semibold">Email</th>
                <th className="px-6 py-5 text-left font-semibold">CPF</th>
                <th className="px-6 py-5 text-left font-semibold">Telefone</th>
                <th className="px-6 py-5 text-left font-semibold">CEP</th>
                <th className="px-6 py-5 text-left font-semibold">Número</th>
                <th className="px-6 py-5 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map((usuario, index) => {
                const selecionado =
                  usuarioSelecionado?.id === usuario.id;

                return (
                  <tr
                    key={usuario.id}
                    onClick={() =>
                      setUsuarioSelecionado(usuario)
                    }
                    className={`
                      border-b border-gray-100/70 last:border-0
                      transition-all duration-200 cursor-pointer
                      hover:bg-blue-50/60
                      ${selecionado
                        ? "bg-blue-100 ring-2 ring-blue-400"
                        : index % 2 === 0
                          ? "bg-white/40"
                          : "bg-gray-50/40"
                      }
                    `}
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {usuario.nome}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          ID #{usuario.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail
                          size={16}
                          className="text-gray-400"
                        />
                        {usuario.email}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200/50">
                        {usuario.cpf}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone
                          size={16}
                          className="text-gray-400"
                        />
                        {usuario.telefone}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {usuario.endereco?.cep || "-"}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {usuario.endereco?.numero || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-sm font-medium border ${usuario.suspenso
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-green-100 text-green-700 border-green-200"
                          }`}
                      >
                        {usuario.suspenso
                          ? "Suspenso"
                          : "Ativo"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}