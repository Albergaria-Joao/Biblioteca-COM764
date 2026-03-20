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
    const [editavel, setEditavel] = useState(false);

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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">

                <h1 className="text-2xl font-bold mb-6">Perfil</h1>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Dados pessoais */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label>Nome</label>
                                <input
                                    className="border p-2 w-full rounded"
                                    value={usuario.nome}
                                    disabled={!editavel}
                                    onChange={(e) =>
                                        setUsuario({ ...usuario, nome: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label>Email</label>
                                <input
                                    className="border p-2 w-full rounded bg-gray-100"
                                    value={usuario.email}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div>
                                <label>Telefone</label>
                                <input
                                    className="border p-2 w-full rounded"
                                    value={usuario.telefone}
                                    disabled={!editavel}
                                    onChange={(e) =>
                                        setUsuario({ ...usuario, telefone: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label>Data nascimento</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full rounded"
                                    value={usuario.dataNascimento?.split("T")[0] || ""}
                                    disabled={!editavel}
                                    onChange={(e) =>
                                        setUsuario({ ...usuario, dataNascimento: e.target.value })
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
                                    className="border p-2 w-full rounded"
                                    value={usuario.Endereco.rua}
                                    disabled={!editavel}
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
                                    className="border p-2 w-full rounded"
                                    value={usuario.Endereco.numero}
                                    disabled={!editavel}
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
                                    className="border p-2 w-full rounded"
                                    value={usuario.Endereco.cidade}
                                    disabled={!editavel}
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
                                    className="border p-2 w-full rounded"
                                    value={usuario.Endereco.estado}
                                    disabled={!editavel}
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

                    {/* Botões */}
                    <div className="flex gap-4 justify-end">

                        {!editavel ? (
                            <button
                                type="button"
                                onClick={() => setEditavel(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Editar
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setEditavel(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Salvar
                                </button>
                            </>
                        )}

                    </div>

                </form>
            </div>
        </div>
    );
}