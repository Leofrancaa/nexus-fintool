/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-manrope)", "sans-serif"],
            },
            colors: {
                nexus: {
                    background: "#111827",
                    border: "#3B82F6",
                    text: "#F3F4F6",
                    success: "#22c55e",
                    error: "#ef4444",
                },
            },
        },
    },
    plugins: [],
};
