
import { logout } from "@/app/actions/auth";
import { auth } from '@/auth';
import ReservasTabela from "./components/ReservasTabela";
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
export default async function AcervoPage() {

    const session = await auth();
    if (!session || (session.user.cargo !== 'BIBLIO' && session.user.cargo !== 'ADMIN')) {
        redirect('/login');
    }

    const reservas = await prisma.reservas.findMany({
        select: {
            id: true,
            createdAt: true,
            valiRes: true,
            Acervo: {
                select: {
                    titulo: true,
                    isbn: true,
                    autor: true,
                }
            },
            Usuario: {
                select: {
                    nome: true,
                }
            }
        },
    })

    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Reservas de Livros
                </h1>
            </div>
            <ReservasTabela reservas={reservas} />
        </div>
    );
}