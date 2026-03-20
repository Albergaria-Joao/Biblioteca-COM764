"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export async function logout() {
    const cookieStore = cookies(); // Pega os cookies
    (await cookieStore).set("token", "", { 
        httpOnly: true,
        expires: new Date(0), // Muda a data de expiração do token p/ 1970
        path: "/"
    });

    (await cookieStore).delete("token") // Deleta ele dos cookies, por segurança
    redirect("/login");

    // Isso, porém, pode não ser suficiente. Se alguém tiver interceptado o JWT logo antes do logout, o token continua valendo até a expiração dele
    // A gente aqui só tira o token da mão do usuário; ele continua existindo
    // Não vou abordar uma correção aqui, porque envolve criar lista negra em banco de dados, etc.
}
