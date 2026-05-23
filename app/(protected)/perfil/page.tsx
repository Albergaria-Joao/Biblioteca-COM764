"use client"

import { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    CalendarDays,
    MapPin,
    Pencil,
    Save,
    X,
    ShieldCheck
} from "lucide-react";

type Usuario = {
    nome: string
    email: string
    cpf: string
    telefone: string
    dataNascimento: string
    cargo: string
    endereco: {
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

    const [usuarioOriginal, setUsuarioOriginal] =
        useState<Usuario | null>(null);

    const [editavel, setEditavel] = useState(false);

    useEffect(() => {

        async function carregarUsuario() {

            try {

                const response = await fetch(
                    "/api/usuarios/perfil",
                    {
                        method: "GET"
                    }
                );

                if (!response.ok) {

                    console.error(
                        "Erro ao buscar perfil"
                    );

                    return;
                }

                const data = await response.json();

                setUsuario(data);
                setUsuarioOriginal(data);

            } catch (error) {

                console.error(
                    "Erro na requisição:",
                    error
                );

            }
        }

        carregarUsuario();

    }, []);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const formData = new FormData(
            e.currentTarget
        );

        const dados = Object.fromEntries(
            formData.entries()
        );

        const response = await fetch(
            "/api/usuarios/perfil",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dados),
            }
        );

        if (!response.ok) {

            alert("Erro ao salvar");

            return;
        }

        const usuarioAtualizado: Usuario = {

            ...usuario!,

            nome: String(
                dados.nome ?? usuario!.nome
            ),

            telefone: String(
                dados.telefone ?? usuario!.telefone
            ),

            dataNascimento: dados.datanasc
                ? String(dados.datanasc)
                : usuario!.dataNascimento,

            endereco: {

                rua: String(
                    dados.rua ?? usuario!.endereco.rua
                ),

                numero: String(
                    dados.numero ??
                    usuario!.endereco.numero
                ),

                bairro: String(
                    dados.bairro ??
                    usuario!.endereco.bairro
                ),

                cidade: String(
                    dados.cidade ??
                    usuario!.endereco.cidade
                ),

                estado: String(
                    dados.estado ??
                    usuario!.endereco.estado
                ),

                cep: String(
                    dados.cep ??
                    usuario!.endereco.cep
                ),
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

        return (

            <div className="
                min-h-screen
                flex items-center justify-center
                bg-gradient-to-br
                from-gray-100
                via-gray-200
                to-gray-300
            ">

                <div className="
                    animate-pulse
                    rounded-3xl
                    bg-white/70
                    px-10 py-8
                    shadow-xl
                    backdrop-blur-xl
                ">

                    <p className="
                        text-lg font-medium text-gray-600
                    ">
                        Carregando perfil...
                    </p>

                </div>

            </div>

        );
    }

    return (

        <div className="
            min-h-screen
        ">

            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="
                    rounded-3xl
                    bg-white/70
                    backdrop-blur-xl
                    border border-white/40
                    shadow-2xl
                    overflow-hidden
                ">

                    {/* TOPO */}
                    <div className="
                        bg-blue-600
                        px-8 py-10
                        text-white
                    ">

                        <div className="
                            flex flex-col lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-8
                        ">

                            {/* PERFIL */}
                            <div className="
                                flex items-center gap-6
                            ">


                                {/* INFO */}
                                <div>

                                    <h1 className="
                                        text-4xl
                                        font-bold
                                    ">
                                        {usuario.nome}
                                    </h1>

                                    <p className="
                                        text-blue-100
                                        text-lg
                                        mt-2
                                    ">
                                        {usuario.cargo === "USER" ? "Usuário" : "Bibliotecário"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* FORM */}
                    <form
                        key={
                            editavel
                                ? "editando"
                                : "visualizando"
                        }
                        onSubmit={handleSubmit}
                        className="p-8 md:p-10 space-y-10"
                    >

                        {/* DADOS PESSOAIS */}
                        <div>

                            <div className="
                                flex items-center gap-3 mb-6
                            ">

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-800
                                    ">
                                        Dados pessoais
                                    </h2>


                                </div>

                            </div>

                            <div className="
                                grid grid-cols-1
                                md:grid-cols-2
                                gap-6
                            ">

                                {/* NOME */}
                                <Campo
                                    icon={
                                        <User size={18} />
                                    }
                                    label="Nome"
                                    name="nome"
                                    defaultValue={usuario.nome}
                                    readOnly={!editavel}
                                />

                                {/* EMAIL */}
                                <Campo
                                    icon={
                                        <Mail size={18} />
                                    }
                                    label="Email"
                                    name="email"
                                    defaultValue={usuario.email}
                                    readOnly
                                />

                                {/* TELEFONE */}
                                <Campo
                                    icon={
                                        <Phone size={18} />
                                    }
                                    label="Telefone"
                                    name="telefone"
                                    defaultValue={usuario.telefone}
                                    readOnly={!editavel}
                                />

                                {/* DATA */}
                                <Campo
                                    icon={
                                        <CalendarDays size={18} />
                                    }
                                    label="Data nascimento"
                                    name="datanasc"
                                    type="date"
                                    defaultValue={
                                        usuario.dataNascimento
                                            ?.split("T")[0] || ""
                                    }
                                    readOnly={!editavel}
                                />

                            </div>

                        </div>

                        {/* ENDEREÇO */}
                        <div>

                            <div className="
                                flex items-center gap-3 mb-6
                            ">

                                <div>

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                        text-gray-800
                                    ">
                                        Endereço
                                    </h2>
                                </div>

                            </div>

                            <div className="
                                grid grid-cols-1
                                md:grid-cols-2
                                gap-6
                            ">

                                <Campo
                                    label="Rua"
                                    name="rua"
                                    defaultValue={usuario.endereco.rua}
                                    readOnly={!editavel}
                                />

                                <Campo
                                    label="Número"
                                    name="numero"
                                    defaultValue={usuario.endereco.numero}
                                    readOnly={!editavel}
                                />

                                <Campo
                                    label="Bairro"
                                    name="bairro"
                                    defaultValue={usuario.endereco.bairro}
                                    readOnly={!editavel}
                                />

                                <Campo
                                    label="Cidade"
                                    name="cidade"
                                    defaultValue={usuario.endereco.cidade}
                                    readOnly={!editavel}
                                />

                                <Campo
                                    label="Estado"
                                    name="estado"
                                    defaultValue={usuario.endereco.estado}
                                    readOnly={!editavel}
                                />

                                <Campo
                                    label="CEP"
                                    name="cep"
                                    defaultValue={usuario.endereco.cep}
                                    readOnly={!editavel}
                                />

                            </div>

                        </div>

                        {/* BOTÕES */}
                        <div className="
                            flex flex-col sm:flex-row
                            justify-end
                            gap-4
                            pt-4
                        ">

                            {!editavel ? (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditavel(true)
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-2xl
                                        bg-blue-600
                                        px-6 py-4
                                        text-white
                                        font-semibold
                                        shadow-xl
                                        transition-all
                                        hover:scale-105
                                        hover:bg-blue-700
                                    "
                                >

                                    <Pencil size={18} />

                                    Editar Perfil

                                </button>

                            ) : (

                                <>

                                    <button
                                        type="button"
                                        onClick={handleCancelar}
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-2xl
                                            bg-gray-300
                                            px-6 py-4
                                            text-gray-700
                                            font-semibold
                                            transition-all
                                            hover:bg-gray-400
                                        "
                                    >

                                        <X size={18} />

                                        Cancelar

                                    </button>

                                    <button
                                        type="submit"
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-2xl
                                            bg-green-600
                                            px-6 py-4
                                            text-white
                                            font-semibold
                                            shadow-xl
                                            transition-all
                                            hover:scale-105
                                            hover:bg-green-700
                                        "
                                    >

                                        <Save size={18} />

                                        Salvar alterações

                                    </button>

                                </>

                            )}

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );
}

/* COMPONENTE INPUT */
function Campo({
    label,
    name,
    defaultValue,
    readOnly,
    type = "text",
    icon
}: any) {

    return (

        <div>

            <label className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
            ">
                {label}
            </label>

            <div className="relative">

                {icon && (

                    <div className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    ">

                        {icon}

                    </div>

                )}

                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    readOnly={readOnly}
                    className={`
                        w-full
                        rounded-2xl
                        border border-gray-200
                        px-4 py-3
                        shadow-sm
                        outline-none
                        transition-all

                        ${icon ? "pl-11" : ""}

                        ${readOnly
                            ? "bg-gray-100 text-gray-600"
                            : `
                                bg-white
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                              `
                        }
                    `}
                />

            </div>

        </div>

    );
}