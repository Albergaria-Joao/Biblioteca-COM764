import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from "./components/Sidebar";
import StatusTracker from './components/StatusTracker';

export default async function SistemaLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await auth();
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex bg-gray-200 min-h-screen">
            <StatusTracker userId={session.user.id}></StatusTracker>
            {/* SIDEBAR */}
            <Sidebar session={session} />

            {/* CONTEÚDO */}
            <main className="flex-1 p-8 overflow-y-clip">
                {children}
            </main>

        </div>

    );
}