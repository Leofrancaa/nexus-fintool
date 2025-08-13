import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NODE_ENV === 'production';

export default withPWA({
    dest: 'public',
    disable: !isProd,
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    workboxOptions: {
        navigateFallback: '/offline.html',
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/sua-api\.com\/.*/i,
                handler: 'NetworkFirst',
                options: { cacheName: 'api-cache', networkTimeoutSeconds: 5 }
            },
            {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'StaleWhileRevalidate',
                options: { cacheName: 'image-cache' }
            }
        ]
    }
})({
    reactStrictMode: true
});
