"use client"
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';

import { z } from "zod";
import { LoginButton } from "./components/LoginButton";
import { useState } from "react";
const loginSchema = z.object({
    email: z.string(),
    senha: z.string(),
});

export default function LoginPage() {

    const [carregando, setCarregando] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/acervo';
    async function efetuarLogin(
        email: string,
        senha: string,
    ) {
        setCarregando(true);

        const result = await signIn("credentials", {
            email,
            password: senha,
            redirect: false, // Impedir o refresh automático para tratar o erro com alert
        });

        if (result?.error) {
            alert("E-mail ou senha incorretos.");
            setCarregando(false);
        } else {
            router.push(callbackUrl);
            router.refresh(); // Garante que o servidor perceba a sessão nova
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const dadosBrutos = Object.fromEntries(formData.entries());

        const validacao = loginSchema.safeParse(dadosBrutos);

        if (!validacao.success) {
            console.error(validacao.error.format());
            alert("Há erros de formato nos dados");
            return;
        }
        // Valida no Zod
        const dados = validacao.data;


        efetuarLogin(dados.email, dados.senha);
    };

    return (
        <div>
            <div className="p-6">

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-gray-800 w-2/8">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">Login</h2>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-5 mb-8">

                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 font-medium text-sm">E-mail</label>
                            <input type="email" name="email" id="email" required placeholder="joao@exemplo.com"
                                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="senha" className="mb-1 font-medium text-sm">Senha</label>
                            <input type="password" name="senha" id="senha" required placeholder="••••••••"
                                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                        </div>


                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
                    >
                        Login
                    </button>
                </form>

                <LoginButton></LoginButton>
            </div>
        </div>
    );
}