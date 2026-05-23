"use client"

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

type Usuario = {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
  endereco: {
    cep: string
    numero: string
  }
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
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

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const termo = busca.toLowerCase();
      return (
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.cpf?.includes(termo)
      );
    });
  }, [usuarios, busca]);

  return (
    <div className="space-y-6 p-6  mx-auto">

      {/* TOPO */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* INFO */}
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

      {/* CONTAINER DA TABELA - overflow-hidden garante o arredondamento perfeito nas pontas */}
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl">
        <div className="overflow-auto">
          <table className="w-full min-w-[1000px] border-collapse">

            {/* HEADER - Linha reta pura; o container pai cuida da curva */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-blue-600 text-white text-sm uppercase tracking-wide">
                <th className="px-6 py-5 text-left font-semibold">Usuário</th>
                <th className="px-6 py-5 text-left font-semibold">Email</th>
                <th className="px-6 py-5 text-left font-semibold">CPF</th>
                <th className="px-6 py-5 text-left font-semibold">Telefone</th>
                <th className="px-6 py-5 text-left font-semibold">CEP</th>
                <th className="px-6 py-5 text-left font-semibold">Número</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {usuariosFiltrados.map((usuario, index) => (
                <tr
                  key={usuario.id}
                  className={`
                    border-b border-gray-100/70 last:border-0
                    transition-all duration-200
                    hover:bg-blue-50/60
                    ${index % 2 === 0 ? "bg-white/40" : "bg-gray-50/40"}
                  `}
                >
                  {/* USUÁRIO */}
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

                  {/* EMAIL */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      {usuario.email}
                    </div>
                  </td>

                  {/* CPF */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200/50">
                      {usuario.cpf}
                    </span>
                  </td>

                  {/* TELEFONE */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      {usuario.telefone}
                    </div>
                  </td>

                  {/* CEP */}
                  <td className="px-6 py-5 text-gray-700">
                    {usuario.endereco?.cep || "-"}
                  </td>

                  {/* NÚMERO */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-700">
                      {usuario.endereco?.numero || "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}