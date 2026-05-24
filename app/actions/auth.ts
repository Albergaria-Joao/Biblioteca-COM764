"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma"; 

export async function logout() {
    const session = await auth();

    const user = await prisma.usuario.update({
        where: {
            id: session?.user.id
        },
        data: {
            status: "OFFLINE"
        }
    });

    await signOut({ redirectTo: "/login" });
    // Muito mais simples
}

export async function getRole() {
    const session = await auth();
    return session?.user.cargo;
}