import AcervoForm from "../components/AcervoForm";
import { redirect, notFound } from 'next/navigation';
import { auth } from "@/auth";
export default async function AdicionarAcervoPage() {
    const session = await auth();
    if (!session || (session.user.cargo !== "ADMIN" && session.user.cargo !== "BIBLIO")) {
        redirect('/login');
    }
    return (
        <div className="p-4">
            {/* <h1 className="text-2xl font-bold mb-4">Adicionar Item ao Acervo</h1> */}
            <AcervoForm tipo="adicionar" />
        </div>
    );
}