"use client"

import { NextResponse } from "next/server";
import { useEffect, useState } from "react";

type Usuario = {
    nome: string
    email: string
    cpf: string
    telefone: string
    dataNascimento: Date,
    rua: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,
}

export default function PerfilPage() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        async function carregarUsuarios() {
            const response = await fetch('api/perfil', {
                method: "GET"
            });

            const data = await response.json();
            setUsuarios(data);
        }

        carregarUsuarios();
    }, []);

    return (
        <div>
            
        </div>
    );
}