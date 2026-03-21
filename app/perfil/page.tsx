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
    const [usuarioOriginal, setUsuarioOriginal] = useState<Usuario | null>(null);
    const [editavel, setEditavel] = useState(false);

    useEffect(() => {
        async function carregarUsuario() {
            try {
                const response = await fetch('/api/usuarios/perfil');

                if (!response.ok) {
                    console.error("Erro ao buscar perfil");
                    return;
                }

                const data = await response.json();
                setUsuario(data);
                setUsuarioOriginal(data);

            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }

        carregarUsuario();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const dados = Object.fromEntries(formData.entries());

        const response = await fetch("/api/usuarios/perfil", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            alert("Erro ao salvar");
            return;
        }

        const usuarioAtualizado: Usuario = {
            ...usuario!,
            nome: String(dados.nome ?? usuario!.nome),
            telefone: String(dados.telefone ?? usuario!.telefone),
            dataNascimento: dados.datanasc
                ? String(dados.datanasc)
                : usuario!.dataNascimento,
            Endereco: {
                rua: String(dados.rua ?? usuario!.Endereco.rua),
                numero: String(dados.numero ?? usuario!.Endereco.numero),
                bairro: String(dados.bairro ?? usuario!.Endereco.bairro),
                cidade: String(dados.cidade ?? usuario!.Endereco.cidade),
                estado: String(dados.estado ?? usuario!.Endereco.estado),
                cep: String(dados.cep ?? usuario!.Endereco.cep),
            },
        };

        setUsuario(usuarioAtualizado);
        setUsuarioOriginal(usuarioAtualizado);
        setEditavel(false);
    };

    const handleCancelar = () => {
        setUsuario(usuarioOriginal);
        setEditavel(false);
    };

    if (!usuario) {
        return <p className="p-6">Carregando...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">

                <h1 className="text-2xl font-bold mb-6">Perfil</h1>

                <form
                    key={editavel ? "editando" : "visualizando"}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* Dados pessoais */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label>Nome</label>
                                <input
                                    name="nome"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.nome}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>Email</label>
                                <input
                                    name="email"
                                    className="border p-2 w-full rounded bg-gray-100"
                                    defaultValue={usuario.email}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label>Telefone</label>
                                <input
                                    name="telefone"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.telefone}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>Data nascimento</label>
                                <input
                                    name="datanasc"
                                    type="date"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.dataNascimento?.split("T")[0] || ""}
                                    readOnly={!editavel}
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
                                    name="rua"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.Endereco.rua}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>Número</label>
                                <input
                                    name="numero"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.Endereco.numero}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>Bairro</label>
                                <input
                                    name="bairro"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.Endereco.bairro}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>Cidade</label>
                                <input
                                    name="cidade"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.Endereco.cidade}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>Estado</label>
                                <input
                                    name="estado"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.Endereco.estado}
                                    readOnly={!editavel}
                                />
                            </div>

                            <div>
                                <label>CEP</label>
                                <input
                                    name="cep"
                                    className="border p-2 w-full rounded"
                                    defaultValue={usuario.Endereco.cep}
                                    readOnly={!editavel}
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
                                    onClick={handleCancelar}
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