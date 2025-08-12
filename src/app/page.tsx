"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ShieldCheck,
  LineChart,
  Wallet2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/toggles/themeToggle";

const nexusGradient = {
  background: `
    linear-gradient(135deg, #0f172a 0%, #0f172a 30%, #0f172a 100%),
    radial-gradient(1200px 700px at 70% 85%, rgba(0, 212, 212, 0.35), transparent 60%),
    radial-gradient(900px 600px at 35% 25%, rgba(0, 102, 255, 0.35), transparent 58%),
    radial-gradient(1100px 700px at 65% 45%, rgba(155, 214, 12, 0.20), transparent 60%)
  `,
  backgroundBlendMode: "overlay" as const,
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header fixo */}
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)]/60 backdrop-blur bg-[var(--card-bg)]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="mt-6 mb-6 w-[100px]">
            <Image
              src="/logo-nexus.png"
              alt="Logo Nexus"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-lg">
            <a href="#recursos" className="hover:opacity-80">
              Recursos
            </a>
            <a href="#como-funciona" className="hover:opacity-80">
              Como funciona
            </a>
            <a href="#depoimentos" className="hover:opacity-80">
              Depoimentos
            </a>
          </nav>
          <div className="flex items-center gap-20">
            <div className="gap-6 hidden lg:flex">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] hover:bg-[var(--hover-bg)]"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0066FF] via-[#00D4AA] to-[#00D4D4] text-white hover:opacity-95"
              >
                Criar conta
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative" style={nexusGradient}>
        <div className="absolute inset-0 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-white/15 text-white/90 bg-white/10 dark:bg-white/10 mb-4">
                <Sparkles className="w-4 h-4" /> Novo: Limites por categoria &
                Painel de investimentos
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
                Controle total das suas{" "}
                <span className="text-[#00D4D4]">finanças</span> com o Nexus
              </h1>
              <p className="mt-4 text-white/90 text-lg md:text-xl leading-relaxed">
                Despesas, receitas, cartões, limites e investimentos — tudo em
                um só lugar. Visual limpo, dados em tempo real e segurança
                corporativa.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white bg-[#0f172a] border border-white/15 hover:opacity-95"
                >
                  Começar agora{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0f172a] hover:bg-white/95"
                >
                  Já tenho conta
                </Link>
              </div>

              <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-white/90">
                {[
                  "Relatórios claros e gráficos em tempo real",
                  "Limites por categoria com alertas inteligentes",
                  "Gestão de cartões e despesas parceladas",
                  "Sessões seguras com HttpOnly e TLS",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock de preview (substitua por imagens reais depois) */}
            <div className="relative">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-2">
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="/preview.png"
                    alt="Preview do Nexus"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white/90 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm">
                      Segurança corporativa no seu acesso
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">
          O que você pode fazer com o Nexus
        </h2>
        <p className="text-[var(--foreground)]/70 mt-2">
          Centralize operações financeiras e ganhe clareza para decidir melhor.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Despesas & Receitas",
              desc: "Registre tudo com categorias e filtros por período. Visualize evolução mensal.",
              icon: <Wallet2 className="w-5 h-5" />,
            },
            {
              title: "Limites inteligentes",
              desc: "Defina limites por categoria e receba alertas quando estiver perto de estourar.",
              icon: <ShieldCheck className="w-5 h-5" />,
            },
            {
              title: "Cartões de crédito",
              desc: "Controle limites, faturas e despesas parceladas por cartão.",
              icon: <CreditCardIcon />,
            },
            {
              title: "Gráficos em tempo real",
              desc: "Acompanhe receitas x despesas e categorias com clareza.",
              icon: <LineChart className="w-5 h-5" />,
            },
            {
              title: "Investimentos",
              desc: "Panorama do mercado e ativos populares. Base para carteira e rentabilidade.",
              icon: <Sparkles className="w-5 h-5" />,
            },
            {
              title: "Segurança de ponta",
              desc: "Sessões com cookies HttpOnly, TLS e auditoria de login.",
              icon: <ShieldCheck className="w-5 h-5" />,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-[var(--card-bg)] border-[var(--card-border)] p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--card-icon-bg-blue)] text-[var(--card-text)]">
                  {f.icon}
                </div>
                <h3 className="font-semibold">{f.title}</h3>
              </div>
              <p className="mt-2 text-sm text-[var(--foreground)]/75">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Como funciona</h2>
        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          {[
            {
              step: "1. Conecte-se",
              desc: "Crie sua conta e personalize categorias, cartões e limites.",
            },
            {
              step: "2. Registre & analise",
              desc: "Insira despesas/receitas, veja gráficos e alertas de limite.",
            },
            {
              step: "3. Decida melhor",
              desc: "Use relatórios claros para planejar metas e investir com segurança.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border bg-[var(--card-bg)] border-[var(--card-border)] p-6"
            >
              <div className="text-sm font-semibold text-[#00D4D4]">
                {s.step}
              </div>
              <p className="mt-2 text-[var(--foreground)]/80">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Quem usa, recomenda</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {[
            {
              name: "Mariana S.",
              role: "Autônoma",
              text: "Finalmente entendo para onde vai meu dinheiro. Os limites por categoria salvaram meu mês.",
            },
            {
              name: "Carlos A.",
              role: "PME",
              text: "Troquei planilhas pelo Nexus. Os gráficos e alertas me ajudam a decidir rapidinho.",
            },
            {
              name: "João P.",
              role: "Analista",
              text: "Painel de investimentos e dashboard claros. Experiência super fluida.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border bg-[var(--card-bg)] border-[var(--card-border)] p-5"
            >
              <p className="text-[var(--foreground)]/90">“{t.text}”</p>
              <div className="mt-4 text-sm text-[var(--foreground)]/70">
                <strong>{t.name}</strong> • {t.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-3xl p-6 md:p-10 border bg-[var(--card-bg)] border-[var(--card-border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">
              Pronto para organizar suas finanças com o Nexus?
            </h3>
            <p className="text-[var(--foreground)]/70 mt-2">
              Leve, seguro e direto ao ponto. Comece em menos de 2 minutos.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#00D4AA] to-[#00D4D4] text-white"
            >
              Criar conta
            </Link>
            <Link
              href="/login"
              className="px-5 py-3 rounded-xl border border-[var(--card-border)] hover:bg-[var(--hover-bg)]"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--card-border)]">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-[var(--foreground)]/70 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} Nexus. Todos os direitos reservados.
          </span>
          <div className="flex gap-4">
            <Link href="/manual" className="hover:opacity-80">
              Manual
            </Link>
            <a href="#recursos" className="hover:opacity-80">
              Recursos
            </a>
            <a href="#como-funciona" className="hover:opacity-80">
              Como funciona
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/** Ícone de cartão estilizado (evita conflito com import padrão do Sidebar) */
function CreditCardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <path d="M7 15h5" />
    </svg>
  );
}
