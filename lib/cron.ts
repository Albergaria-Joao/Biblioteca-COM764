import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer'; // Certifique-se de importar o nodemailer
import { enviarEmail2Dias, enviarSuspensao } from '@/lib/email'; // Importa a função de envio de email

export const registerCron = () => {
    if (process.env.NODE_ENV === 'development') {
        if ((global as any).cronStarted) {
            return;
        }
        (global as any).cronStarted = true;
    }

    console.log('🚀 Inicializou cron');

    // Ajustado para rodar a cada 1 minuto
    cron.schedule('*/1 * * * *', async () => {
        console.log('⏰ Verificando prazos...');
        try {
            // CRÍTICO: Aguardar a execução da função assíncrona
            await verificarPrazoAtraso();
            await suspenderAtraso();
        } catch (error) {
            console.error('❌ Erro durante a execução do cron:', error);
        }
    });
};

export async function verificarPrazoAtraso() {
    const agora = new Date();

    agora.setDate(agora.getDate() + 2);
    console.log(`[Prazo] Verificando reservas com prazo até ${agora.toISOString()}...`);

    // OTIMIZAÇÃO: Filtrar direto no banco apenas o que está atrasado
    const reservas = await prisma.reservas.findMany({
        where: {
            prazo: {
                not: null,
                lte: agora // 2 dias em milissegundos
            },
            email2DiasEnviado: false
        },
        select: {
            id: true,
            retirada: true,
            prazo: true,
            Usuario: {
                select: { email: true }
            },
            Acervo: {
                select: { titulo: true, autor: true, isbn: true }
            }
        }
    });

    //console.log(`[Atraso] Encontradas ${reservas.length} reservas atrasadas.`);
    for (const reserva of reservas) {
        try {
            console.log(`Empréstimo atrasado detectado: ${reserva.Usuario.email} - ${reserva.Acervo.titulo}`);

            // Garantir fallbacks para campos que podem ser null
            const dataPrazo = reserva.prazo ?? new Date();
            const dataRetirada = reserva.retirada ?? new Date();

            await enviarEmail2Dias(
                reserva.Usuario.email,
                dataPrazo,
                dataRetirada,
                reserva.Acervo.titulo,
                reserva.Acervo.autor,
                reserva.Acervo.isbn
            );
            await prisma.reservas.update({
                where: { id: reserva.id },
                data: { email2DiasEnviado: true }
            });

            console.log(`✅ Email enviado para ${reserva.Usuario.email}`);
        } catch (emailError) {
            console.error(`❌ Falha ao enviar e-mail para ${reserva.Usuario.email}:`, emailError);
        }
    }
}



export async function suspenderAtraso() {
    const dataCorte = new Date();
    dataCorte.setDate(dataCorte.getDate() - 5);

    console.log(`[Prazo] Verificando atrasos onde o prazo era até ou antes de: ${dataCorte.toISOString()}...`);

    const reservas = await prisma.reservas.findMany({
        where: {
            prazo: {
                not: null,
                lte: dataCorte
            },
            OR: [
                { devolucao: null },
                { devolucao: { equals: undefined } },
                { devolucao: { isSet: false } },
            ],
            emailAtrasoEnviado: false
        },
        select: {
            id: true,
            retirada: true,
            prazo: true,
            Usuario: {
                select: { id: true, email: true }
            },
            Acervo: {
                select: { titulo: true, autor: true, isbn: true }
            }
        }
    });

    console.log(`[Atraso] Encontrados ${reservas.length} empréstimos atrasados para suspensão.`);

    for (const reserva of reservas) {
        try {
            console.log(`Empréstimo atrasado detectado: ${reserva.Usuario.email} - ${reserva.Acervo.titulo}`);

            const dataPrazo = reserva.prazo ?? new Date();

            const dataFimSuspensao = new Date();
            dataFimSuspensao.setDate(dataFimSuspensao.getDate() + 30);

            await prisma.usuario.update({
                where: { id: reserva.Usuario.id },
                data: {
                    situacao: "SUSPENSO",
                    dataFimSuspensao: dataFimSuspensao
                }
            });

            await prisma.reservas.update({
                where: { id: reserva.id },
                data: { emailAtrasoEnviado: true }
            });

            await enviarSuspensao(
                reserva.Usuario.email,
                dataPrazo,
                dataFimSuspensao,
                reserva.Acervo.titulo,
                reserva.Acervo.autor,
                reserva.Acervo.isbn
            );

            console.log(`✅ Email enviado para ${reserva.Usuario.email}`);
        } catch (emailError) {
            console.error(`❌ Falha ao processar suspensão/e-mail para ${reserva.Usuario.email}:`, emailError);
        }
    }
}