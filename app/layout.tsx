import "@/app/globals.css";
import { registerCron } from '@/lib/cron';

// Descomentar quando estiver pronto
registerCron();
// Essa abordagem funciona p/ localhost, mas o ideal seria algo mais robusto
// p/ ambiente de prod, usando Vercel Cron por ex.

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html><body>
      <div className="bg-gray-200 min-h-screen">

        {children}


      </div>
    </body></html>
  );
}