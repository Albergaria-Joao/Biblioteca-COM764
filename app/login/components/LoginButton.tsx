"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginButton() {
    const [isPending, setIsPending] = useState(false);

    const handleLogin = async () => {
        setIsPending(true);
        await signIn("google", { callbackUrl: "/usuarios" });
       
    }
    return (
        <button
        onClick={handleLogin}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
            {isPending ? "Redirecionando..." : "Logar com Google"}
        </button>
    );
}