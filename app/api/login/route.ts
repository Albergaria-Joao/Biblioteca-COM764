import { NextResponse } from "next/server";

//Quando criar a pagina de login utilizar esta rota para armazenar o id nos cookies
export async function POST() {

    const userId = "69b349dd03f7611173120d95"; //Id do usuario vai entrar aqui

    const response = NextResponse.json({ ok: true });

    response.cookies.set("userId", userId, {
        httpOnly: true, //Java script do navegador não pode acessar esse cookies, questões de segurança
        path: "/", //todas rotas tem acesso a esse cookie
    });

    return response
}