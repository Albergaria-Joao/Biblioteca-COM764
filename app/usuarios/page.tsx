"use client"

import { useEffect, useState } from "react";

type Usuario = {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
}

export default function UsuariosPage() {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    async function carregarUsuarios() {
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      setUsuarios(data);
    }

    carregarUsuarios();
  }, []);

 return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>

      <table className="border border-gray-300 w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">CPF</th>
            <th className="border px-4 py-2">Telefone</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{usuario.id}</td>
              <td className="border px-4 py-2">{usuario.nome}</td>
              <td className="border px-4 py-2">{usuario.email}</td>
              <td className="border px-4 py-2">{usuario.cpf}</td>
              <td className="border px-4 py-2">{usuario.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}