"use client"

import { useEffect, useState } from "react";

type Usuario = {
    nome: string
    email: string
    cpf: string
    telefone: string
    dataNascimento: string
    Endereco: {
        rua: string
        numero: string
        bairro: string
        cidade: string
        estado: string
        cep: string
    }
}

export default function PerfilPage() {

    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        async function carregarUsuario() {
            try {
                const response = await fetch('/api/usuarios/perfil', {
                    method: "GET"
                });

                if (!response.ok) {
                    console.error("Erro ao buscar perfil");
                    return;
                }

                const data = await response.json();
                setUsuario(data);

            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }

        carregarUsuario();
    }, []);

    //Criar função para passar os parametros e chamar o método POST da rota perfil
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        
    };


    
    // Enquanto carrega
    if (!usuario) {
        return <p className="p-6">Carregando...</p>;
    }

    //Adicionar um form cubbrindo tudo isso, para lidar com o handleSubit
    return (
        <div className="p-6 max-w-4xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">Perfil</h1>

            {/* Dados pessoais */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label>Nome</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.nome}
                            onChange={(e) =>
                                setUsuario({ ...usuario, nome: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.email}
                            disabled
                        />
                    </div>

                    <div>
                        <label>Telefone</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.telefone}
                            onChange={(e) =>
                                setUsuario({ ...usuario, telefone: e.target.value })
                            }
                        />
                    </div>

                </div>
            </div>

            {/* Endereço */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Endereço</h2>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label>Rua</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.Endereco.rua}
                            onChange={(e) =>
                                setUsuario({
                                    ...usuario,
                                    Endereco: {
                                        ...usuario.Endereco,
                                        rua: e.target.value
                                    }
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Número</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.Endereco.numero}
                            onChange={(e) =>
                                setUsuario({
                                    ...usuario,
                                    Endereco: {
                                        ...usuario.Endereco,
                                        numero: e.target.value
                                    }
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Cidade</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.Endereco.cidade}
                            onChange={(e) =>
                                setUsuario({
                                    ...usuario,
                                    Endereco: {
                                        ...usuario.Endereco,
                                        cidade: e.target.value
                                    }
                                })
                            }
                        />
                    </div>

                    <div>
                        <label>Estado</label>
                        <input
                            className="border p-2 w-full"
                            value={usuario.Endereco.estado}
                            onChange={(e) =>
                                setUsuario({
                                    ...usuario,
                                    Endereco: {
                                        ...usuario.Endereco,
                                        estado: e.target.value
                                    }
                                })
                            }
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}