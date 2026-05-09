
import { logout } from "@/app/actions/auth";
import { auth } from '@/auth';
import EmprestimosTabela from "./components/EmprestimosTabela";
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
export default async function AcervoPage() {

    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    let emprestimos: any[];

    if (session.user.cargo == 'BIBLIO' || session.user.cargo == 'ADMIN') {
        emprestimos = await prisma.reservas.findMany({
            where: {
                retirada: {
                    not: null,
                },
                prazo: {
                    not: null,
                }
            },
            select: {
                id: true,
                retirada: true,
                prazo: true,
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
        });
    }
    else {
        emprestimos = await prisma.reservas.findMany({
            where: {
                usuarioId: session.user.id,
                retirada: {
                    not: null,
                },
                prazo: {
                    not: null,
                }
            },
            select: {
                id: true,
                retirada: true,
                prazo: true,
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
        });
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Lista de Empréstimos
                </h1>
            </div>
            <EmprestimosTabela emprestimos={emprestimos} />
        </div>
    );
}