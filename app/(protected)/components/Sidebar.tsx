// components/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { BookAIcon, BookOpenIcon, UserIcon, RefreshCcw } from "lucide-react"
import { auth } from '@/auth';
import type { Session } from "next-auth";

interface SidebarProps {
	session: Session | null;
}


export default function Sidebar({ session }: SidebarProps) {
	const pathname = usePathname();

	const links = [
		{ nome: "Acervo", href: "/acervo", icon: <BookAIcon size={20} /> },

	];

	if (session?.user?.cargo === "BIBLIO" || session?.user?.cargo === "ADMIN") {
		links.push(
			{ nome: "Usuários", href: "/usuarios", icon: <UserIcon size={20} /> },
			{ nome: "Reservas", href: "/reservas", icon: <BookOpenIcon size={20} /> },
			{ nome: "Empréstimos", href: "/emprestimos", icon: <RefreshCcw size={20} /> }
		)
	}
	else {
		links.push(
			{ nome: "Minhas Reservas", href: "/minhas-reservas", icon: <BookOpenIcon size={20} /> },
			{ nome: "Meus Empréstimos", href: "/meus-emprestimos", icon: <RefreshCcw size={20} /> }
		)
	}
	return (
		<aside className="w-72 sticky top-0 h-screen bg-slate-900 text-white flex flex-col shadow-2xl">

			{/* LOGO */}
			<div className="h-20 flex items-center px-6 border-b border-slate-800">
				<h1 className="text-2xl font-bold tracking-wide">
					Biblioteca
				</h1>
			</div>

			{/* LINKS */}
			<nav className="flex-1 p-4 space-y-2">

				{links.map((link) => {
					const ativo = pathname === link.href;

					return (
						<Link
							key={link.href}
							href={link.href}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              
              ${ativo
									? "bg-blue-600 text-white shadow-lg"
									: "text-slate-300 hover:bg-slate-800 hover:text-white"
								}
              
              `}
						>
							<span className="text-xl">
								{link.icon}
							</span>

							<span className="font-medium">
								{link.nome}
							</span>
						</Link>
					);
				})}
			</nav>

			{/* FOOTER */}
			<div className="p-4 border-t border-slate-800">
				<button onClick={logout} className="w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-semibold">
					Sair
				</button>
			</div>
		</aside>
	);
}
