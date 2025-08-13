// next.config.mjs
import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const withPwa = withPWA({
    dest: 'public',
    disable: !isProd,
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    // ⚠️ Evite offline global. Restrinja ou remova:
    workboxOptions: {
        navigationPreload: true,
        // Se quiser manter uma página offline, restrinja o allowlist:
        navigateFallback: '/offline.html',
        navigateFallbackAllowlist: [
            /^\/$/ // só a home pode cair no offline.html
        ],
        runtimeCaching: [
            {
                // troque para seu domínio real de API:
                urlPattern: /^https:\/\/nexus-backend-m35w\.onrender\.com\/.*/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'api-cache',
                    networkTimeoutSeconds: 5,
                    cacheableResponse: { statuses: [0, 200] }
                }
            },
            {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'image-cache',
                    cacheableResponse: { statuses: [0, 200] }
                }
            }
        ]
    }
});

export default withPwa({
    reactStrictMode: true,
});
