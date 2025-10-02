"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)] px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-500/10">
            <WifiOff className="w-16 h-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          Você está offline
        </h1>

        <p className="text-[var(--foreground)]/70 mb-8">
          Parece que você perdeu a conexão com a internet.
          Algumas funcionalidades podem estar limitadas até que você se reconecte.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-[#2256FF] via-[#00D4AA] to-[#00D4D4] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Tentar novamente
        </button>

        <div className="mt-8 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
          <p className="text-sm text-[var(--foreground)]/60">
            <strong>Dica:</strong> Assim que sua conexão for restabelecida,
            o Nexus voltará a funcionar normalmente.
          </p>
        </div>
      </div>
    </div>
  );
}
