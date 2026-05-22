"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { DateTime } from "next-auth/providers/kakao";

export default function QRCodeGenerator({ url }: { url: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    // Gera o QR Code como um Data URL (Base64)
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000ff", // Cor do QR Code
        light: "#ffffffff", // Cor do fundo
      },
    }).then(setSrc);
  }, [url]);




  return (
    <div>
      {src ?
        <div>
          <img src={src} alt="QR Code" />
          <a href={src} download={`Reserva.png`}>Download</a>
        </div>
        : <p>Gerando...</p>}

    </div>
  );
}