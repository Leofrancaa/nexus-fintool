'use client';
import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function useSwUpdate() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const wb = new Workbox('/sw.js');
            wb.addEventListener('waiting', async () => {
                // ativa nova versão sem esperar fechar todas as abas
                await wb.messageSkipWaiting();
                window.location.reload();
            });
            wb.register();
        }
    }, []);
}
