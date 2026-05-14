'use client';

type usuario = {
    id: string,
    nome: string,
    email: string,
    cpf: string |null,
    telefone: string |null,
}

interface Props{
    usuario: usuario,
}

export default function AprovarButton({ usuario }: Props) {

    async function atualizarUsuario(id: string, status: string) {
        try {
            const response = await fetch("/api/usuarios/aprovar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status }),
            });

            if (!response.ok) throw new Error("Erro ao atualizar");

            alert(`Usuário ${status}!`);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar usuário");
        }
    }

    return (

        < div className="flex flex-col gap-3 mt-4" >

            <button
                onClick={() => atualizarUsuario(usuario.id, "ATIVADO")}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
            >
                Aprovar
            </button>

            <button
                onClick={() => atualizarUsuario(usuario.id, "SUSPENSO")}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-red-700 transition"
            >
                Recusar
            </button>

        </div >
    );
}