import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

// Config do plugin PWA
const withPwa = withPWA({
    dest: 'public',
    disable: !isProd,
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    workboxOptions: {
        navigateFallback: '/offline.html',
        runtimeCaching: [
            {
                // 🔁 troque para o seu domínio real de API
                urlPattern: /^https:\/\/sua-api\.com\/.*/i,
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

// Next config (sem 'export')
export default withPwa({
    reactStrictMode: true,
    // Se você carrega imagens externas, liste os domínios aqui:
    images: {
        remotePatterns: [
            // { protocol: 'https', hostname: 'cdn.seu-dominio.com' },
            // { protocol: 'https', hostname: 'images.unsplash.com' },
        ]
    },
    // opcional:
    // experimental: { optimizePackageImports: ['lucide-react'] }
});
