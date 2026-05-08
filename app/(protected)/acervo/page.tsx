
import { logout } from "../actions/auth";
import { auth } from '@/auth';
import AcervoTabela from "./components/AcervoTabela";
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Plus } from "lucide-react";

export default async function AcervoPage() {

  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  const cargoUser = session.user.cargo;


  const livros = await prisma.acervo.findMany({
    where: {
      excluido: false, // Filtra apenas os livros não excluidoss
    },
    select: {
      id: true,
      isbn: true,
      titulo: true,
      autor: true,
      editora: true,
      edicao: true,
      anoPublicacao: true,
      genero: true,
      unidades: true,
    },
  });


  return (
    <div className="bg-gray-200">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 ml-6">
          Acervo
        </h1>

      </div>
      <Link href="/acervo/adicionar" className="text-blue-600 hover:text-blue-700 py-2 px-4 rounded-lg transition font-medium  text-xl">
        <Plus className="inline mr-2 mb-1" size={20} />
        Adicionar Livro
      </Link>
      <AcervoTabela cargoUser={cargoUser} livros={livros} />
    </div>
  );
}