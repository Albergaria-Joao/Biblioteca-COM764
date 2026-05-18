"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Lista de estados do Brasil para o Select
const ESTADOS_BR = [
  { uf: "AC", nome: "Acre" }, { uf: "AL", nome: "Alagoas" }, { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" }, { uf: "BA", nome: "Bahia" }, { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" }, { uf: "ES", nome: "Espírito Santo" }, { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" }, { uf: "MT", nome: "Mato Grosso" }, { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" }, { uf: "PA", nome: "Pará" }, { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" }, { uf: "PE", nome: "Pernambuco" }, { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" }, { uf: "RN", nome: "Rio Grande do Norte" }, { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" }, { uf: "RR", nome: "Roraima" }, { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" }, { uf: "SE", nome: "Sergipe" }, { uf: "TO", nome: "Tocantins" }
];

const usuarioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Insira um endereço de e-mail válido."),
  senha: z.string().min(5, "A senha deve ter no mínimo 5 caracteres."),
  cpf: z.string().min(14, "Insira o CPF completo com pontos e traço."),
  telefone: z.string().min(14, "Insira o telefone completo com DDD."),
  dataNasc: z.string().min(1, "A data de nascimento é obrigatória."),
  cargo: z.string().min(1, "Selecione o tipo de perfil"),
  cep: z.string().min(9, "O CEP deve conter 8 dígitos e o traço."),
  rua: z.string().min(2, "O nome da rua é obrigatório."),
  numero: z.string().min(1, "O número residencial é obrigatório."),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "O campo bairro é obrigatório."),
  cidade: z.string().min(2, "A cidade é obrigatória."),
  estado: z.string().length(2, "Selecione um estado válido.")
});

export default function CadastroPage() {
  const [carregando, setCarregando] = useState(false);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const router = useRouter();

  // Estados locais para controlar os valores com máscara
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");

  // Funções de Mascaramento de String
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14);
  };

  const maskTelefone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
      .substring(0, 15);
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  async function criarUsuario(dados: z.infer<typeof usuarioSchema>) {
    setCarregando(true);
    setErroMensagem(null);

    const dataNascStr = dados.dataNasc + "T00:00:00.000Z";

    try {
      const response = await fetch("/api/usuarios/cadastro", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dados,
          dataNasc: dataNascStr
        })
      });

      if (!response.ok) {
        const erroApi = await response.json().catch(() => null);
        setErroMensagem(response.statusText || "Houve um erro inesperado.");
        throw new Error(erroApi?.error || "Não foi possível concluir o registro.");
      }

      router.push("/login");
    } catch (error: any) {
      console.error(error);
      setErroMensagem(error.message || "Houve um erro inesperado.");
    } finally {
      setCarregando(false);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroMensagem(null);

    const formData = new FormData(e.currentTarget);
    const dadosBrutos = Object.fromEntries(formData.entries());

    const validacao = usuarioSchema.safeParse(dadosBrutos);

    if (!validacao.success) {
      console.error(validacao.error.format());
      const primeiroErro = validacao.error.issues[0]?.message || "Há erros de preenchimento nos dados.";
      setErroMensagem(primeiroErro);
      return;
    }

    criarUsuario(validacao.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Crie sua Conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Já possui uma conta?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Faça login aqui
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-100">

          {erroMensagem && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2.5 animate-fadeIn">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{erroMensagem}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Seção: Dados Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Dados Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label htmlFor="nome" className="mb-1 font-medium text-sm text-gray-700">Nome Completo</label>
                  <input type="text" name="nome" id="nome" required placeholder="Ex: João da Silva" disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-medium text-sm text-gray-700">E-mail</label>
                  <input type="email" name="email" id="email" required placeholder="joao@exemplo.com" disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="senha" className="mb-1 font-medium text-sm text-gray-700">Senha</label>
                  <input type="password" name="senha" id="senha" required placeholder="••••••••" disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                {/* Input CPF Mascarado */}
                <div className="flex flex-col">
                  <label htmlFor="cpf" className="mb-1 font-medium text-sm text-gray-700">CPF</label>
                  <input type="text" name="cpf" id="cpf" required placeholder="000.000.000-00" disabled={carregando}
                    value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                {/* Input Telefone Mascarado */}
                <div className="flex flex-col">
                  <label htmlFor="telefone" className="mb-1 font-medium text-sm text-gray-700">Telefone</label>
                  <input type="tel" name="telefone" id="telefone" required placeholder="(00) 00000-0000" disabled={carregando}
                    value={telefone} onChange={(e) => setTelefone(maskTelefone(e.target.value))}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="dataNasc" className="mb-1 font-medium text-sm text-gray-700">Data de Nascimento</label>
                  <input type="date" name="dataNasc" id="dataNasc" required disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>
              </div>
            </div>

            {/* Seção: Endereço e Perfil */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Endereço & Perfil
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Input CEP Mascarado */}
                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="cep" className="mb-1 font-medium text-sm text-gray-700">CEP</label>
                  <input type="text" name="cep" id="cep" required placeholder="00000-000" disabled={carregando}
                    value={cep} onChange={(e) => setCep(maskCEP(e.target.value))}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col md:col-span-6">
                  <label htmlFor="rua" className="mb-1 font-medium text-sm text-gray-700">Rua</label>
                  <input type="text" name="rua" id="rua" required placeholder="Nome da rua, avenida..." disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col md:col-span-3">
                  <label htmlFor="numero" className="mb-1 font-medium text-sm text-gray-700">Número</label>
                  <input type="text" name="numero" id="numero" required placeholder="123" disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col md:col-span-4">
                  <label htmlFor="complemento" className="mb-1 font-medium text-sm text-gray-700">Complemento <span className="text-gray-400 font-normal">(Opcional)</span></label>
                  <input type="text" name="complemento" id="complemento" placeholder="Apto, Bloco..." disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col md:col-span-4">
                  <label htmlFor="bairro" className="mb-1 font-medium text-sm text-gray-700">Bairro</label>
                  <input type="text" name="bairro" id="bairro" required placeholder="Centro" disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="cidade" className="mb-1 font-medium text-sm text-gray-700">Cidade</label>
                  <input type="text" name="cidade" id="cidade" required placeholder="Sua Cidade" disabled={carregando}
                    className="border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50" />
                </div>

                {/* Select de UF Unificado */}
                <div className="flex flex-col md:col-span-2">
                  <label htmlFor="estado" className="mb-1 font-medium text-sm text-gray-700">UF</label>
                  <select
                    name="estado"
                    id="estado"
                    required
                    disabled={carregando}
                    defaultValue=""
                    className="border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all disabled:opacity-50 appearance-none"
                  >
                    <option value="" disabled hidden>--</option>
                    {ESTADOS_BR.map((estado) => (
                      <option key={estado.uf} value={estado.uf}>
                        {estado.uf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center md:col-span-12 pt-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Tipo de Perfil:</span>
                  <div className="flex items-center">
                    <input type="radio" name="cargo" id="cargo-user" value="USER" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled={carregando} />
                    <label htmlFor="cargo-user" className="ml-2 font-medium text-sm text-gray-700 cursor-pointer">Sou Usuário / Leitor</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" name="cargo" id="cargo-biblio" value="BIBLIO" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled={carregando} />
                    <label htmlFor="cargo-biblio" className="ml-2 font-medium text-sm text-gray-700 cursor-pointer">Sou Bibliotecário</label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-md py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
            >
              {carregando ? "Processando Cadastro..." : "Concluir Cadastro"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}