import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from '@/lib/prisma';
import AprovarButton from "./components/AprovarButton";



export default async function UsuariosPage({ params }: { params: { uid: string } }) {

  const { uid } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  //if (session.user.cargo !== "bibliotecario") {
  //  redirect("/acervo");
  //}


  if (!uid) {
    console.log("UID NÃO ENCONTRADO")
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: uid as string
    },
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      situacao: true,
    },
  });

  if (!usuario) {
    console.log("USER NÃO ENCONTRADO")
    redirect("/login")
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-6 space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Detalhes do Usuário
        </h1>


        <div key={usuario.id} className="space-y-4">

          {/* CARD DE DADOS */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3 border">

            <div>
              <span className="text-sm text-gray-500">Nome</span>
              <p className="text-gray-800 font-medium">{usuario.nome}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="text-gray-800">{usuario.email}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">CPF</span>
              <p className="text-gray-800">{usuario.cpf || "-"}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Telefone</span>
              <p className="text-gray-800">{usuario.telefone || "-"}</p>
            </div>
          </div>
          {usuario.situacao == "ESPERA" && (
            <AprovarButton usuario={usuario} />
          )}
          {usuario.situacao != "ESPERA" && (
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border">
              <div>
                <p className="text-gray-800">O cadastro do usuário já foi aprovado.</p>
              </div>
            </div>
          )}


        </div>

      </div>
    </div>
  );
}