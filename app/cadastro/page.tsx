"use client"

import { useEffect, useState } from "react";

import { z } from "zod";
const usuarioSchema = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  cpf: z.string(),
  telefone: z.string(),
  dataNasc: z.string(),
  cep: z.string(),
  rua: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string()

  // Validação que a IA gerou para usarmos depois
  //nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  //email: z.string().email("E-mail com formato inválido"),
  // senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  // cpf: z.string().length(14, "O CPF deve estar formatado corretamente"),
  // telefone: z.string().min(10, "Telefone inválido"),
  // dataNasc: z.string(),
  // cep: z.string().length(9, "CEP inválido"),
  // rua: z.string().min(2, "Rua é obrigatória"),
  // numero: z.string().min(1, "Número é obrigatório"),
  // complemento: z.string().optional(),
  // bairro: z.string().min(2, "Bairro é obrigatório"),
  // cidade: z.string().min(2, "Cidade é obrigatória"),
  // estado: z.string().length(2, "O estado deve ter 2 letras (UF)")
});

export default function UsuariosPage() {

  async function criarUsuario(
    email: string,
    senha: string,
    nome: string,
    cpf: string,
    telefone: string,
    dataNasc: string,
    rua: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,

  ) {
    console.log(cpf)

    const dataNascStr = dataNasc + "T00:00:00.000Z";
    console.log(dataNascStr)
    const response = await fetch("/api/usuarios/cadastrar", {
        method:'POST',
        body: JSON.stringify({
          email, senha, 
          nome, cpf, 
          telefone, dataNasc: dataNascStr,
          rua, numero,
          complemento, bairro,
          cidade, estado,
          cep
        })
    });
    // const data = await response.json();
    // if (data.status == 200) {
    //   navigate("/usuarios")
    // }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dadosBrutos = Object.fromEntries(formData.entries());

    const validacao = usuarioSchema.safeParse(dadosBrutos);

    if (!validacao.success) {
      console.error(validacao.error.format());
      alert("Há erros de formato nos dados");
      return;
    }
    const dados = validacao.data;

    console.log("Dados prontos para envio:", dados);
    criarUsuario(dados.email, dados.senha, dados.nome, dados.cpf, dados.telefone, dados.dataNasc, dados.rua, dados.numero, dados.complemento, dados.bairro, dados.cidade, dados.estado, dados.numero);
  };

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Cadastro</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl text-gray-800">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Dados Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="flex flex-col">
              <label htmlFor="nome" className="mb-1 font-medium text-sm">Nome Completo</label>
              <input type="text" name="nome" id="nome" required placeholder="Ex: João da Silva" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

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

            <div className="flex flex-col">
              <label htmlFor="cpf" className="mb-1 font-medium text-sm">CPF</label>
              <input type="text" name="cpf" id="cpf" required placeholder="000.000.000-00" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="telefone" className="mb-1 font-medium text-sm">Telefone</label>
              <input type="tel" name="telefone" id="telefone" required placeholder="(00) 00000-0000" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="dataNasc" className="mb-1 font-medium text-sm">Data de Nascimento</label>
              <input type="date" name="dataNasc" id="dataNasc" required 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Endereço</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
            <div className="flex flex-col md:col-span-3">
              <label htmlFor="cep" className="mb-1 font-medium text-sm">CEP</label>
              <input type="text" name="cep" id="cep" required placeholder="00000-000" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col md:col-span-7">
              <label htmlFor="rua" className="mb-1 font-medium text-sm">Rua</label>
              <input type="text" name="rua" id="rua" required placeholder="Nome da rua, avenida, etc." 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="numero" className="mb-1 font-medium text-sm">Número</label>
              <input type="text" name="numero" id="numero" required placeholder="123" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col md:col-span-4">
              <label htmlFor="complemento" className="mb-1 font-medium text-sm">Complemento <span className="text-gray-400 font-normal">(Opcional)</span></label>
              <input type="text" name="complemento" id="complemento" placeholder="Apto 42, Bloco B" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col md:col-span-4">
              <label htmlFor="bairro" className="mb-1 font-medium text-sm">Bairro</label>
              <input type="text" name="bairro" id="bairro" required placeholder="Centro" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col md:col-span-3">
              <label htmlFor="cidade" className="mb-1 font-medium text-sm">Cidade</label>
              <input type="text" name="cidade" id="cidade" required placeholder="Sua Cidade" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="flex flex-col md:col-span-1">
              <label htmlFor="estado" className="mb-1 font-medium text-sm">UF</label>
              <input type="text" name="estado" id="estado" required maxLength={2} placeholder="SP" 
                className="border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all uppercase" />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors shadow-md"
          >
            Cadastrar Usuário
          </button>
        </form>
      </div>

      <div>
        <h1>RATO</h1>
      </div>

    </div>
  );
}