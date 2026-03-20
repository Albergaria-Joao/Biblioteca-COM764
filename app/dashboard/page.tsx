// app/dashboard/page.tsx
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <pre>
      {JSON.stringify(session?.user, null, 2)}
      {/* Aqui deve aparecer o seu ID do banco e o seu CARGO */}
    </pre>
  );
}