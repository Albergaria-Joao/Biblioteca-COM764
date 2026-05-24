"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';


interface Props {
    reservaId: string;
    dataPrazo: Date;
    dataRetirada: Date;
}

export default function EfetivarButton({ reservaId, dataPrazo, dataRetirada }: Props) {

    const [reservado, setReservado] = useState<boolean>(false);

    const router = useRouter();

    const reservar = async ({ reservaId, dataPrazo, dataRetirada }: Props) => {
        const response = await fetch(`/api/acervo/reserva`, {
            method: 'PUT',
            body: JSON.stringify({ id: reservaId, dataPrazo: dataPrazo, dataRetirada: dataRetirada })
        });
        if (response.ok) {
            setReservado(true);
        } else {
            alert("ERRO NA CRIAÇÃO: " + (await response.json()).error);
        }
    }

    return (
        <div>
            {!reservado && (
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => { reservar({ reservaId, dataPrazo, dataRetirada }) }}
                >Efetivar reserva</button>
            )}


            {reservado && (
                <div>
                    <h2 className="text-xl text-blue-500">Reserva efetuada com sucesso!</h2>
                </div>
            )}
        </div>
    );
}