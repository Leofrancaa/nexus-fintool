"use client";

import { useMemo, useState } from "react";
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
            <p className="mb-3">
              A navegação é feita pelo menu lateral. Todas as telas têm{" "}
              <strong>filtros de mês/ano</strong>, cards de resumo e listas com
              ações rápidas (editar, excluir, ver histórico).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Dados em tempo real</strong>: os totais e gráficos se
                atualizam após cada criação/edição/exclusão.
              </li>
              <li>
                <strong>Consistência</strong>: regras de cartões e limites
                garantem integridade (sem faturas inconsistentes).
              </li>
              <li>
                <strong>Acessibilidade</strong>: suporte a tema claro/escuro e
                layout responsivo.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "instalar-app",
        title: "Instalar no Celular",
        body: (
          <>
            <p className="mb-3">
              O <strong>Nexus</strong> pode ser instalado como um{" "}
              <strong>aplicativo</strong> no seu celular, funcionando em tela
              cheia e com acesso rápido a partir da tela inicial.
            </p>
            <p className="font-semibold mb-2">Android (Chrome, Edge, Brave)</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Acesse o Nexus pelo navegador do celular.</li>
              <li>
                Toque no menu <strong>⋮</strong> no canto superior direito.
              </li>
              <li>
                Selecione <em>Adicionar à tela inicial</em> ou{" "}
                <em>Instalar app</em>.
              </li>
              <li>Confirme e o ícone aparecerá junto aos seus apps.</li>
            </ul>
            <p className="font-semibold mb-2">iOS (Safari)</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Acesse o Nexus pelo Safari.</li>
              <li>
                Toque no botão de <em>Compartilhar</em> (ícone de quadrado com
                seta).
              </li>
              <li>
                Escolha <em>Adicionar à Tela de Início</em>.
              </li>
              <li>Confirme e o ícone aparecerá na tela inicial.</li>
            </ul>
            <p>
              Depois de instalado, o Nexus abrirá em <strong>tela cheia</strong>
              , sem a barra do navegador, proporcionando uma experiência mais
              parecida com um aplicativo nativo.
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
              A <strong>Dashboard</strong> mostra um panorama do período
              selecionado: totais, médias, variação vs. mês anterior e gráficos
              por categoria.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Cards</strong>: Total do mês, Despesas fixas,
                Transações, Média por despesa (converte valores para número
                antes de formatação).
              </li>
              <li>
                <strong>Comparativos</strong>: variação percentual mês a mês
                (positivo/negativo) e setas indicativas.
              </li>
              <li>
                <strong>Gráficos</strong>: pizza por categoria e barras/linhas
                por mês; cores vêm das categorias do usuário.
              </li>
              <li>
                <strong>Alertas</strong>: limites por categoria, excesso e
                avisos (cards com barra de progresso).
              </li>
            </ul>
            <p className="font-semibold">Dicas</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Use os <strong>filtros de mês/ano</strong> no topo para ver
                tendências e sazonalidade.
              </li>
              <li>
                Se algo não aparecer, verifique se as{" "}
                <strong>categorias</strong> existem e possuem cor; os gráficos
                dependem disso.
              </li>
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
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Cartão de crédito</strong>: ao selecionar, escolha um
                cartão e, se parcelado, informe parcelas. O sistema valida
                limite e competência.
              </li>
              <li>
                <strong>Despesa fixa</strong>: replica automaticamente do mês
                atual até dezembro (gera lançamentos futuros).
              </li>
              <li>
                <strong>Lista de despesas</strong>: permite busca por texto,
                filtro por categoria e período, e ações de excluir/editar
                (cartão não permite edição, apenas exclusão).
              </li>
              <li>
                <strong>Exclusão em cartão</strong>: remove parcelas associadas
                e devolve limite imediatamente.
              </li>
            </ul>
            <p className="font-semibold">Boas práticas</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Use <strong>subcategorias</strong> para granularidade (ex.:
                Alimentação &gt; Mercado &gt; Açougue).
              </li>
              <li>
                Evite editar lançamentos antigos quando houver{" "}
                <strong>limites</strong> e <strong>cartões</strong> envolvidos;
                prefira ajustes no mês corrente.
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
              Cadastre <strong>receitas</strong> (salário, vendas, freelance),
              com categoria, data e valor. Acompanhe por mês/ano e por origem.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Resumo por categoria</strong>: veja quais fontes mais
                contribuem.
              </li>
              <li>
                <strong>Evolução mensal</strong>: identifique tendências e meses
                atípicos.
              </li>
              <li>
                <strong>Busca e filtros</strong>: agilizam a localização de
                lançamentos específicos.
              </li>
            </ul>
            <p className="font-semibold">Dicas</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Mantenha categorias de receita simples (ex.: Salário, Vendas,
                Freelance) para relatórios mais claros.
              </li>
              <li>
                Use observações para marcar receitas não recorrentes ou bônus.
              </li>
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
              Gerencie seus <strong>cartões de crédito</strong>: limite total,
              limite disponível, fechamento e vencimento da fatura. Esta é a
              área mais “regrada” do sistema, pois controla ciclos de fatura e
              pagamento.
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-semibold">
                  Como funciona o ciclo (fechamento × vencimento)
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Vencimento</strong>: dia em que você paga a fatura
                    (ex.: dia <em>15</em>).
                  </li>
                  <li>
                    <strong>Fechamento</strong>: ocorre <em>X</em> dias antes do
                    vencimento (ex.: fecha <em>10 dias</em> antes ⇒ fecha no dia{" "}
                    <em>5</em>).
                  </li>
                  <li>
                    Compras <strong>até o dia do fechamento</strong> entram na
                    fatura que vence no mês atual.
                  </li>
                  <li>
                    Compras <strong>após o fechamento</strong> entram na{" "}
                    <u>próxima</u> fatura (mês seguinte).
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Competência da fatura</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Toda despesa de cartão recebe uma{" "}
                    <strong>competência (mês/ano)</strong> calculada pela{" "}
                    <strong>data da compra</strong>, pelo vencimento e pelos
                    dias de fechamento.
                  </li>
                  <li>
                    Se a competência já estiver <strong>paga</strong>, novas
                    despesas para aquele mês/ano são <strong>bloqueadas</strong>
                    .
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Adicionar despesas no cartão</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    O sistema valida <strong>limite disponível</strong> e a{" "}
                    <strong>competência paga</strong>.
                  </li>
                  <li>
                    <strong>À vista</strong>: reduz o limite pelo valor total
                    imediatamente.
                  </li>
                  <li>
                    <strong>Parcelada</strong>: registra as parcelas em
                    competências futuras e reduz o limite pelo{" "}
                    <strong>total da compra</strong> no ato.
                  </li>
                  <li>
                    Despesas no cartão <strong>não podem ser editadas</strong>{" "}
                    depois de criadas (para manter a integridade do ciclo). É
                    possível excluir; ao excluir, o limite é devolvido.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Pagamento da fatura</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    O botão <strong>Pagar</strong> só fica ativo{" "}
                    <strong>após o fechamento</strong> do ciclo vigente.
                  </li>
                  <li>
                    Ao pagar, o limite é <strong>devolvido</strong> e a
                    competência é marcada como <strong>paga</strong>.
                  </li>
                  <li>
                    Após pagar, você ainda pode lançar novas despesas no mês
                    corrente — elas entrarão na <strong>próxima</strong>{" "}
                    competência (seguindo a regra de fechamento).
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Edição do cartão</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    É possível alterar <strong>nome</strong>,{" "}
                    <strong>número (4 dígitos)</strong>,<strong> tipo</strong>,{" "}
                    <strong>cor</strong> e <strong>limite</strong>.
                  </li>
                  <li>
                    <strong>Vencimento</strong> e{" "}
                    <strong>dias de fechamento</strong> não são alterados na
                    edição (evita reclassificar faturas já pagas).
                  </li>
                  <li>
                    O <strong>limite disponível</strong> é recalculado com base
                    no <strong>saldo em aberto</strong> apenas (não reconta
                    faturas já pagas).
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Exclusão do cartão</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Não é possível excluir se houver{" "}
                    <strong>despesas no mês atual</strong>.
                  </li>
                  <li>
                    Se houver despesas em meses anteriores, ao excluir o cartão
                    essas despesas também serão <strong>removidas</strong>.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Exemplos rápidos</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Vence 15, fecha 10 dias antes (dia 5)</strong>:
                    compra em <em>03/08</em> entra na fatura que vence{" "}
                    <em>15/08</em>; compra em <em>12/08</em> entra na fatura que
                    vence <em>15/09</em>.
                  </li>
                  <li>
                    Pagou a fatura de <em>08/2025</em>? Novas despesas cuja
                    competência seja <em>08/2025</em> serão bloqueadas.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Dicas</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Escolha um <strong>vencimento</strong> logo após a data em
                    que você costuma receber (facilita pagar a fatura sem
                    aperto).
                  </li>
                  <li>
                    Ajuste os <strong>dias de fechamento</strong> conforme o
                    emissor do cartão (ex.: 7–10 dias é comum).
                  </li>
                  <li>
                    Se precisar corrigir algo já pago, prefira{" "}
                    <strong>lançar um ajuste</strong> em vez de editar despesas
                    antigas.
                  </li>
                </ul>
              </div>
            </div>
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
              para organizar gastos e receitas. As cores alimentam gráficos e
              painéis.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Hierarquia</strong>: uma categoria pai pode ter várias
                subcategorias; os resumos consideram ambas.
              </li>
              <li>
                <strong>Cores</strong>: usadas nos gráficos; escolha cores
                distintas para melhor leitura.
              </li>
              <li>
                <strong>Integridade</strong>: não é possível excluir uma
                categoria com despesas/receitas vinculadas (evita órfãos).
              </li>
            </ul>
            <p className="font-semibold">Sugestões</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Evite excesso de subcategorias; mantenha de 3 a 6 por pai para
                relatórios limpos.
              </li>
              <li>
                Reutilize categorias ao máximo para facilitar comparativos
                mensais.
              </li>
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
              calcula a <strong>porcentagem utilizada</strong>, destaca
              <strong> excedentes</strong> e mostra histórico de alterações.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Cards de limite</strong>: barra de progresso, valor
                gasto, limite e excedente; botões de editar e histórico.
              </li>
              <li>
                <strong>Escopo</strong>: limites se aplicam à categoria pai e
                somam as subcategorias.
              </li>
              <li>
                <strong>Alertas</strong>: aparecem na Dashboard ao ultrapassar o
                limite.
              </li>
            </ul>
            <p className="font-semibold">Estratégia</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Comece com limites baseados na{" "}
                <strong>média dos últimos 3–6 meses</strong>.
              </li>
              <li>
                Ajuste ao longo do mês conforme imprevistos, mantendo um{" "}
                <strong>colchão de segurança</strong>.
              </li>
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
              variação em tempo quase real no painel de mercado.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Painel</strong>: preço, variação e indicador de
                tendência (alta/baixa).
              </li>
              <li>
                <strong>Integração futura</strong>: carteira, preço médio e
                rentabilidade acumulada.
              </li>
              <li>
                <strong>Filtros</strong>: seleção de ativos relevantes para seu
                perfil (reduz ruído).
              </li>
            </ul>
            <p className="font-semibold">Observações</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Use a aba apenas como <strong>referência</strong>; decisões de
                investimento devem considerar seu perfil de risco.
              </li>
              <li>
                Mantenha registros de aportes para análise correta de
                rentabilidade quando a carteira for liberada.
              </li>
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
              Ajuste preferências do sistema: tema claro/escuro, dados da conta
              e segurança (login).
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>
                <strong>Tema</strong>: alternância pelo botão na sidebar; toda a
                UI responde via variáveis CSS.
              </li>
              <li>
                <strong>Conta</strong>: gerenciamento de dados pessoais e
                sessão.
              </li>
              <li>
                <strong>Autenticação</strong>: cookies HttpOnly, proteção por
                JWT e expiração de sessão.
              </li>
            </ul>
            <p className="font-semibold">Dica</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Caso o tema não mude em modais/overlays, verifique se a classe{" "}
                <code>dark</code> está no <code>html</code> (não apenas no{" "}
                <code>body</code>).
              </li>
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
                <strong>Posso editar uma despesa fixa?</strong> Sim, a edição
                afeta as cópias futuras; lançamentos já criados permanecem.
              </li>
              <li>
                <strong>Excluir cartão apaga despesas?</strong> Só é permitido
                excluir cartão sem despesas vinculadas (integridade dos dados).
              </li>
              <li>
                <strong>A média por despesa sumiu?</strong> Converta o campo
                para número antes de <code>toFixed</code> e valide nulos.
              </li>
              <li>
                <strong>Gráficos sem cor?</strong> Defina cores nas categorias;
                os gráficos usam essas cores.
              </li>
              <li>
                <strong>Despesa no cartão não edita?</strong> É por regra de
                ciclo; exclua para estornar limite e relance corretamente.
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

        <div className="mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar no manual (ex.: despesas, cartões, limites)"
            className="w-full rounded-xl border px-4 py-3 bg-[var(--filter-input-bg)] border-[var(--filter-input-border)] text-[var(--filter-text)] placeholder-[var(--filter-placeholder)] outline-none focus:ring-2 focus:ring-[#00D4D4]"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((sec) => (
            <AccordionItem key={sec.id} title={sec.title}>
              {sec.body}
            </AccordionItem>
          ))}
        </div>

        <div className="mt-10 text-sm text-[var(--foreground)]/70">
          Precisa de ajuda? Entre em contato pelo suporte do Nexus.
        </div>
      </div>
    </main>
  );
}
