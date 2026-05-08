import "@/app/globals.css";

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