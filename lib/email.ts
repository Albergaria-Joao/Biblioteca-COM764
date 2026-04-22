import nodemailer from "nodemailer";

export async function enviarEmailCadastro(usuario: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Sistema Biblioteca" <${process.env.EMAIL_USER}>`,
    to: "tg5tsxrdfe@gmail.com",
    subject: "Novo cadastro pendente",
    html: `
      <h2>Novo cadastro aguardando aprovação</h2>
      <p><b>Nome:</b> ${usuario.nome}</p>
      <p><b>Email:</b> ${usuario.email}</p>
      <p><b>CPF:</b> ${usuario.cpf}</p>
    `,
  });
}