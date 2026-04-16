"use server";

import { auth, signOut } from "@/auth";

export async function logout() {
    await signOut({ redirectTo: "/login" });
    // Muito mais simples
}
