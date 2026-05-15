import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import { enviarEmailValidade } from '@/lib/email';

export const registerCron = () => {
  if (process.env.NODE_ENV === 'development') {
    if ((global as any).cronStarted) {
      return;
    }
    (global as any).cronStarted = true;
  }

  console.log('inicializou cron');

  cron.schedule('*/5 * * * *', async () => {
    
    console.log('⏰ Verificando prazos...');
    
  });  
};



export async function verificarReservasExpiradas() {
    const reservas = await prisma.reservas.findMany({
      where: {
        retirada: null,
      },
      select: {
        valiRes: true,
        createdAt: true,
        Usuario: {
            select: {
                email: true,
            }
        },
        Acervo : {
            select: {
                titulo: true,
                autor: true,
                isbn: true,
            }
        }
      }
    });

    const agora = new Date();

    reservas.forEach(async (reserva) => {
        const validade = new Date(reserva.valiRes);
        if (validade < agora) {
            console.log(`Reserva expirada: ${reserva.Usuario.email} - ${reserva.Acervo.titulo}`);
            await enviarEmailValidade(
                reserva.Usuario.email,
                reserva.valiRes,
                reserva.createdAt,
                reserva.Acervo.titulo,
                reserva.Acervo.autor,
                reserva.Acervo.isbn
            );
        }
    });

}


export async function verificarPrazo2Dias() {
    const reservas = await prisma.reservas.findMany({
      where: {
        prazo: { not: null },
      },
      select: {
        retirada: true,
        prazo: true,
        Usuario: {
            select: {
                email: true,
            }
        },
        Acervo : {
            select: {
                titulo: true,
                autor: true,
                isbn: true,
            }
        }
      }
    });

    const agora = new Date();

    reservas.forEach(async (reserva) => {
        const prazo = new Date(reserva.prazo!);
        if (prazo < agora) {
            console.log(`Empréstimo atrasado: ${reserva.Usuario.email} - ${reserva.Acervo.titulo}`);
            await enviarEmailValidade(
                reserva.Usuario.email,
                reserva.prazo!,
                reserva.retirada!,
                reserva.Acervo.titulo,
                reserva.Acervo.autor,
                reserva.Acervo.isbn
            );
        }
    });

}