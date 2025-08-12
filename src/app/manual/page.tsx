"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border px-4 sm:px-5 py-3 sm:py-4 bg-[var(--card-bg)] border-[var(--card-border)]">
      <button
        className="w-full flex items-center justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[var(--card-text)] font-semibold">{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden text-[var(--foreground)]/90 text-sm sm:text-base leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ManualPage() {
  const [q, setQ] = useState("");

  const sections: Section[] = useMemo(
    () => [
      {
        id: "intro",
        title: "Introdução",
        body: (
          <>
            <p className="mb-3">
              O <strong>Nexus</strong> é sua plataforma de{" "}
              <strong>gestão financeira pessoal</strong>. Aqui você registra
              despesas e receitas, gerencia cartões, define limites por
              categoria, analisa gráficos e acompanha investimentos.
            </p>
            <p>
              Use o menu ao lado para navegar entre as áreas. Este manual traz
              um passo a passo simples de cada recurso.
            </p>
          </>
        ),
      },
      {
        id: "dashboard",
        title: "Dashboard",
        body: (
          <>
            <p className="mb-3">
              A <strong>Dashboard</strong> mostra um resumo do mês: totais,
              médias, variação vs. mês anterior e gráficos por categoria. Use os
              filtros de mês/ano no topo para navegar.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Cards: Total do mês, Despesas fixas, Transações, Média por
                despesa.
              </li>
              <li>Gráficos: por categoria e por mês (linhas/barras).</li>
              <li>Alertas: limites estourados e avisos importantes.</li>
            </ul>
          </>
        ),
      },
      {
        id: "despesas",
        title: "Despesas",
        body: (
          <>
            <p className="mb-3">
              Registre <strong>despesas</strong> com método de pagamento
              (dinheiro, pix, cartão), categoria, data, quantidade e
              observações.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Cartão de crédito</strong>: ao selecionar, escolha um
                cartão e, se parcelado, informe parcelas.
              </li>
              <li>
                <strong>Despesa fixa</strong>: replica automaticamente do mês
                atual até dezembro.
              </li>
              <li>
                Edição/Exclusão: disponível na lista de despesas. Exclusão em
                cartão remove parcelas e devolve limite.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "receitas",
        title: "Receitas",
        body: (
          <>
            <p className="mb-3">
              Cadastre <strong>receitas</strong> (salário, vendas, freelance) e
              acompanhe por mês/ano.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Selecione a categoria de receita e a data.</li>
              <li>Veja o resumo por categoria e evolução mensal.</li>
            </ul>
          </>
        ),
      },
      {
        id: "cartoes",
        title: "Cartões",
        body: (
          <>
            <p className="mb-3">
              Gerencie seus <strong>cartões de crédito</strong>, com limite
              total, limite disponível e vencimento.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Edição do cartão respeita limites já utilizados.</li>
              <li>Exclusão só quando não existirem despesas vinculadas.</li>
            </ul>
          </>
        ),
      },
      {
        id: "categorias",
        title: "Categorias & Subcategorias",
        body: (
          <>
            <p className="mb-3">
              Crie <strong>categorias</strong> e <strong>subcategorias</strong>{" "}
              para organizar gastos e receitas.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>As cores das categorias alimentam os gráficos.</li>
              <li>Os resumos consideram despesas em subcategorias.</li>
            </ul>
          </>
        ),
      },
      {
        id: "limites",
        title: "Limites por Categoria",
        body: (
          <>
            <p className="mb-3">
              Defina <strong>limites mensais</strong> por categoria. O Nexus
              calcula % usada e indica excedentes.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Cards mostram barra de progresso, gasto, limite e excedente.
              </li>
              <li>Histórico exibe alterações de limite ao longo do tempo.</li>
            </ul>
          </>
        ),
      },
      {
        id: "investimentos",
        title: "Investimentos",
        body: (
          <>
            <p className="mb-3">
              Acompanhe ativos pré-definidos (dólar, euro, bitcoin etc.) e veja
              variação em tempo real.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Painel de mercado com preço e variação.</li>
              <li>Integração futura com carteira e rentabilidade acumulada.</li>
            </ul>
          </>
        ),
      },
      {
        id: "config",
        title: "Configurações",
        body: (
          <>
            <p className="mb-3">
              Ajuste preferências: tema claro/escuro, dados da conta e segurança
              (login).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alternância de tema pelo botão no rodapé da sidebar.</li>
              <li>Gerenciamento de sessão com cookies HttpOnly.</li>
            </ul>
          </>
        ),
      },
      {
        id: "faq",
        title: "FAQ - Perguntas Frequentes",
        body: (
          <>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Posso editar uma despesa fixa?</strong> Sim, afetará as
                cópias futuras.
              </li>
              <li>
                <strong>Excluir cartão apaga despesas?</strong> Só é permitido
                excluir cartão sem despesas vinculadas.
              </li>
              <li>
                <strong>Por que minha média por despesa sumiu?</strong>{" "}
                Verifique se o campo numérico está sendo formatado (Number)
                antes de toFixed.
              </li>
            </ul>
          </>
        ),
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!q.trim()) return sections;
    const s = q.toLowerCase();
    return sections.filter((sec) =>
      (sec.title + " " + (typeof sec.body === "string" ? sec.body : ""))
        .toLowerCase()
        .includes(s)
    );
  }, [q, sections]);

  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-8 bg-[var(--page-bg)] text-[var(--foreground)]">
      <div className="w-full mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Manual do Usuário
            </h1>
            <p className="text-sm sm:text-base text-[var(--foreground)]/70">
              Aprenda a usar o Nexus passo a passo.
            </p>
          </div>
        </div>

        {/* Busca */}
        <div className="mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar no manual (ex.: despesas, cartões, limites)"
            className="w-full rounded-xl border px-4 py-3 bg-[var(--filter-input-bg)] border-[var(--filter-input-border)] text-[var(--filter-text)] placeholder-[var(--filter-placeholder)] outline-none focus:ring-2 focus:ring-[#00D4D4]"
          />
        </div>

        {/* Lista de seções (accordion) */}
        <div className="space-y-3">
          {filtered.map((sec) => (
            <AccordionItem key={sec.id} title={sec.title}>
              {sec.body}
            </AccordionItem>
          ))}
        </div>

        {/* Rodapé de ajuda */}
        <div className="mt-10 text-sm text-[var(--foreground)]/70">
          Precisa de ajuda? Entre em contato pelo suporte do Nexus.
        </div>
      </div>
    </main>
  );
}
