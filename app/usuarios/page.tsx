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
    <div style={{ padding: "20px" }}>
      <h1>Lista de Usuários</h1>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Telefone</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.cpf}</td>
              <td>{usuario.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}