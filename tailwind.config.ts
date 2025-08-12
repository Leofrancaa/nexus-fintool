/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
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
