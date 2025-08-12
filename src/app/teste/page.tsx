"use client";

import { ThemeToggle } from "../../components/toggles/themeToggle";

export default function TesteTheme() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="p-6 bg-white text-black dark:bg-black dark:text-white rounded-lg shadow-lg transition-all">
        <p className="text-lg font-semibold">Teste de Tema</p>
        <p className="text-sm">
          Este bloco deve mudar ao alternar a classe dark.
        </p>
      </div>
      <button
        onClick={() => {
          document.documentElement.classList.toggle("dark");
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Alternar Tema manualmente
      </button>

      <ThemeToggle />
    </div>
  );
}
