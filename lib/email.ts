import nodemailer from "nodemailer";

// Ele não teria que enviar p/ todos os bibliotecarios?

export async function enviarEmailCadastro(usuario: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const linkAprovar = `http://localhost:3000/usuarios/aprovar/${usuario.id}`;

  await transporter.sendMail({
    from: `"Sistema Biblioteca" <${process.env.EMAIL_USER}>`,
    //to: "tg5tsxrdfe@gmail.com",
    to: "jvab1609@gmail.com",
    subject: "Novo cadastro pendente",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 20px;">
          
          <h2 style="color: #333; text-align: center;">Novo Cadastro</h2>

          <p style="font-size: 16px; color: #555;">
            Um novo usuário solicitou cadastro no sistema.
          </p>

          <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><b>Nome:</b> ${usuario.nome}</p>
            <p><b>Email:</b> ${usuario.email}</p>
            <p><b>Cargo:</b> ${usuario.cargo}</p>
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${linkAprovar}" 
               style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block;">
              Verificar aprovação
            </a>

          </p>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 12px; color: #999; text-align: center;">
            Sistema Biblioteca • Este é um email automático
          </p>
        </div>
      </div>
    `,
  });
}



export async function enviarEmail2Dias(email: string, dataPrazo: Date, dataRetirada: Date, titulo: string, autor: string, isbn: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Sistema Biblioteca" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Empréstimo prestes a atrasar!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 20px;">
          
          <h2 style="color: #333; text-align: center;">Empréstimo prestes a atrasar</h2>

          <p style="font-size: 16px; color: #555;">
            Um empréstimo seu irá vencer em 2 dias. Por favor, se possível, devolva o item ou entre em contato para explicar a situação.
          </p>

          <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><b>Título:</b> ${titulo}</p>
            <p><b>Autor:</b> ${autor}</p>
            <p><b>ISBN:</b> ${isbn}</p>
          </div>
          <p><b>Data da retirada:</b> ${dataRetirada}</p>
          <p><b>Data de prazo:</b> ${dataPrazo}</p>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 12px; color: #999; text-align: center;">
            Sistema Biblioteca • Este é um email automático
          </p>
        </div>
      </div>
    `,
  });
}