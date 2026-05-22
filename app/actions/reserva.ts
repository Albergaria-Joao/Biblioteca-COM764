import { enviarEmailQRCode } from "@/lib/email";

export function actionEmailQRCode(email: string, titulo: string, autor: string, isbn: string, validade: Date, url: string) {
    enviarEmailQRCode(email, titulo, autor, isbn, validade, url);
}