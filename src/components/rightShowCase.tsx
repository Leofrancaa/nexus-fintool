"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// Hook de digitação com deleção lenta
function useTypewriter(
  frases: string[],
  typeSpeed = 42,
  pause = 2800,
  eraseFactor = 2.8
) {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [apagando, setApagando] = useState(false);
  const frasesRef = useRef(frases);
  const frasesKey = useMemo(() => frases.join("§"), [frases]);

  useEffect(() => {
    frasesRef.current = frases;
  }, [frasesKey, frases]);

  useEffect(() => {
    const arr = frasesRef.current;
    const fraseAtual = arr[idx % arr.length] ?? "";
    const interval = apagando ? typeSpeed * eraseFactor : typeSpeed;

    const t = setTimeout(() => {
      if (!apagando) {
        const next = fraseAtual.slice(0, txt.length + 1);
        setTxt(next);
        if (next.length === fraseAtual.length) setApagando(true);
      } else {
        const next = fraseAtual.slice(0, Math.max(0, txt.length - 1));
        setTxt(next);
        if (next.length === 0) {
          setApagando(false);
          setIdx((i) => (i + 1) % arr.length);
        }
      }
    }, interval);

    return () => clearTimeout(t);
  }, [txt, apagando, idx, typeSpeed, eraseFactor]);

  useEffect(() => {
    const arr = frasesRef.current;
    const fraseAtual = arr[idx % arr.length] ?? "";
    if (!apagando && txt.length === fraseAtual.length) {
      const t = setTimeout(() => setApagando(true), pause);
      return () => clearTimeout(t);
    }
  }, [txt, apagando, idx, pause]);

  return txt;
}

export function RightShowcase() {
  const frases = useMemo(
    () => [
      "Controle total das suas finanças com o Nexus.",
      "Acompanhe gastos, metas e cartões em tempo real.",
      "Relatórios claros para decisões melhores.",
      "Planeje hoje. Invista no seu amanhã.",
    ],
    []
  );

  const typed = useTypewriter(frases, 42, 4000, 2.2);

  return (
    <div
      className="relative hidden lg:flex items-center justify-center m-4 rounded-3xl"
      style={{
        background: `
  linear-gradient(135deg, #0f172a 0%, #1a2433 40%, #0f172a 100%),
  radial-gradient(1200px 700px at 70% 85%, rgba(0, 212, 212, 0.35), transparent 60%),
  radial-gradient(900px 600px at 45% 35%, rgba(0, 102, 255, 0.35), transparent 58%),
  radial-gradient(1000px 700px at 65% 45%, rgba(155, 214, 12, 0.25), transparent 60%)
`,
        backgroundBlendMode: "overlay",
      }}
    >
      {/* “Input” central */}
      <div className="relative z-10 w-full flex items-center justify-center px-8">
        <div
          className="flex items-center gap-3 w-full max-w-2xl rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.1)",
            padding: "18px 22px",
          }}
        >
          <span className="text-[15px] sm:text-base text-[#0f172a]">
            {typed || "Organize suas finanças com o Nexus..."}
          </span>
          <button
            aria-label="Enviar"
            className="ml-auto inline-flex items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#0f172a",
              color: "#ffffff",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
            }}
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
