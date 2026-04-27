"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

  return (
    <div>
        <h1>usuario</h1>
    </div>
  );
}