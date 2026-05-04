import AcervoForm from "../components/AcervoForm";
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';

export default async function EditarAcervoPage() {

    const session = await auth();
    if (!session) {
        redirect('/login');
    }


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Editar livro</h1>
            <AcervoForm tipo="editar" />
        </div>
    );
}