"use client"
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { z } from "zod";
import { LoginButton } from "./components/LoginButton";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().email("Por favor, insira um e-mail válido."),
    senha: z.string().min(1, "A senha é obrigatória."),
});

export default function LoginPage() {
    const [carregando, setCarregando] = useState(false);
    const [erroMensagem, setErroMensagem] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') || '/acervo';

    async function efetuarLogin(email: string, senha: string) {
        setCarregando(true);
        setErroMensagem(null); // Reseta erros anteriores

        const result = await signIn("credentials", {
            email,
            password: senha,
            redirect: false,
        });

        if (result?.error) {
            setErroMensagem("E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.");
            setCarregando(false);
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErroMensagem(null);

        const formData = new FormData(e.currentTarget);
        const dadosBrutos = Object.fromEntries(formData.entries());
        const validacao = loginSchema.safeParse(dadosBrutos);

        if (!validacao.success) {
            // Pega a primeira mensagem de erro definida no esquema Zod
            const primeiroErro = validacao.error.message || "Erro de validação nos campos.";
            setErroMensagem(primeiroErro);
            return;
        }

        const dados = validacao.data;
        efetuarLogin(dados.email, dados.senha);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Acesse sua Conta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{" "}
                    <Link href="/cadastro" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        crie seu cadastro na biblioteca
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">

                    {/* Banner de Erro Estilizado */}
                    {erroMensagem && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{erroMensagem}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-1 font-medium text-sm text-gray-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder="joao@exemplo.com"
                                disabled={carregando}
                                className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="senha" className="mb-1 font-medium text-sm text-gray-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                name="senha"
                                id="senha"
                                required
                                placeholder="••••••••"
                                disabled={carregando}
                                className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-md py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                        >
                            {carregando ? "Autenticando..." : "Entrar"}
                        </button>
                    </form>

                    {/* Divisor Visual */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <LoginButton callbackUrl={callbackUrl} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}