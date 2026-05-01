
import { logout } from "../actions/auth";
import { auth } from '@/auth';
import AcervoTabela from "./components/AcervoTabela";
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
export default async function AcervoPage() {

  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  const cargoUser = session.user.cargo;


  // const livros = await prisma.acervo.findMany({
  //     where: {
  //         excluido: false, // Filtra apenas os livros não excluidoss
  //     },
  //     select: {
  //         id: true,
  //         isbn: true,
  //         titulo: true,
  //         autor: true,
  //         editora: true,
  //         edicao: true,
  //         anoPublicacao: true,
  //         genero: true,
  //         unidades: true,
  //     },
  // });


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button onClick={logout} className="p-1.5 pr-3 pl-3 bg-red-500 text-white rounded-xl cursor-pointer">Sair</button> {/*Teste de botão de logout com server action*/}
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Lista de Livros
        </h1>
      </div>
      <AcervoTabela cargoUser={cargoUser} />
    </div>
  );
}