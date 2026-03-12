const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

function gerarCPF() {
  return String(Math.floor(Math.random() * 90000000000) + 10000000000)
}

function gerarTelefone() {
  return "119" + Math.floor(Math.random() * 90000000 + 10000000)
}

async function main() {

  for (let i = 1; i <= 20; i++) {

    const endereco = await prisma.endereco.create({
      data: {
        rua: `Rua ${i}`,
        numero: `${100 + i}`,
        bairro: "Centro",
        cidade: "Campinas",
        estado: "SP",
        cep: "13000000"
      }
    })

    const usuario = await prisma.usuario.create({
      data: {
        nome: `Usuario ${i}`,
        email: `usuario${i}@email.com`,
        senha: "123456",
        cpf: gerarCPF(),
        telefone: gerarTelefone(),
        dataNascimento: new Date("2000-01-01"),
        enderecoId: endereco.id
      }
    })

    console.log(`Usuário criado: ${usuario.nome}`)
  }

  console.log("Banco populado com sucesso 🚀")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })