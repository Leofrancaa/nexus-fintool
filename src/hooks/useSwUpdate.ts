

'use client';
import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function useSwUpdate() {
    useEffect(() => {
        // ❗ só registra em produção e se houver suporte
        if (process.env.NODE_ENV !== 'production') return;
        if (!('serviceWorker' in navigator)) return;

        const wb = new Workbox('/sw.js');
        wb.addEventListener('waiting', async () => {
            await wb.messageSkipWaiting?.();
            window.location.reload();
        });
        wb.register();
    }, []);
}
