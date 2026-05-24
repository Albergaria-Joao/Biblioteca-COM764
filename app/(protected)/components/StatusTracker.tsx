'use client';
import { useEffect } from 'react';

interface StatusTrackerProps {
    userId: string;
}

export default function StatusTracker({ userId }: StatusTrackerProps) {
    useEffect(() => {
        if (!userId) return;

        fetch('/api/usuarios/status', {
            method: 'POST',
            body: JSON.stringify({ userId, status: 'ONLINE' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const setOffline = () => {
            const url = '/api/usuarios/status';
            const data = JSON.stringify({ userId, status: 'OFFLINE' });

            // sendBeacon envia dados de forma assíncrona sem bloquear o fechamento da aba
            navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
        };

        // Checa se saiu da aba, por exemplo
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setOffline();
            } else if (document.visibilityState === 'visible') {
                fetch('/api/usuarios/status', {
                    method: 'POST',
                    body: JSON.stringify({ userId, status: 'ONLINE' }),
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', setOffline);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', setOffline);
            setOffline();
        };
    }, [userId]);

    return null; // Componente invisível, apenas executa a lógica
}