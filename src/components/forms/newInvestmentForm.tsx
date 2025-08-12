"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

interface MarketItem {
  nome: string;
  preco: number | null;
  moeda: string;
}

export function InvestmentForm({ onClose, onCreated }: Props) {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [investido, setInvestido] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [ativos, setAtivos] = useState<Record<string, MarketItem>>({});

  useEffect(() => {
    const fetchAtivos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/finance/market`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAtivos(data);
      } catch {
        toast.error("Erro ao buscar ativos do mercado.");
      }
    };

    fetchAtivos();
  }, []);

  const ativoSelecionado = categoriaId ? ativos[categoriaId] : null;
  const qtd = parseFloat(quantidade);
  const valorAtual =
    ativoSelecionado?.preco && qtd ? ativoSelecionado.preco * qtd : 0;
  const valorInvestido = parseFloat(investido);
  const rendimento = valorInvestido ? valorAtual - valorInvestido : 0;
  const variacaoPercentual = valorInvestido
    ? (rendimento / valorInvestido) * 100
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao || !quantidade || !investido || !categoriaId) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/investments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ativo: categoriaId,
            descricao,
            quantidade: parseFloat(quantidade),
            valor_investido: parseFloat(investido),
            data: new Date().toISOString().split("T")[0],
            observacoes,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Erro ao salvar investimento.");
        return;
      }

      toast.success("Investimento salvo com sucesso!");
      onCreated?.();
      onClose();
    } catch {
      toast.error("Erro ao salvar investimento.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {/* Descrição + Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Ativo</Label>
          <Select value={categoriaId} onValueChange={setCategoriaId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ativo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ativos).map(([key, item]) => (
                <SelectItem key={key} value={key}>
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Descrição</Label>
          <Input
            placeholder="Ex: Compra de Bitcoin"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
      </div>

      {/* Quantidade + Valor investido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Quantidade adquirida</Label>
          <Input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Ex: 0.05"
          />
        </div>

        <div>
          <Label>Valor investido (R$)</Label>
          <Input
            type="number"
            value={investido}
            onChange={(e) => setInvestido(e.target.value)}
            placeholder="Ex: 1500"
          />
        </div>
      </div>

      {/* Resultado automático */}
      {ativoSelecionado && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Valor atual</Label>
            <p className="bg-[#1F2937] text-white px-4 py-2 rounded-lg">
              {valorAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <div>
            <Label>Rendimento</Label>
            <p
              className={`px-4 py-2 rounded-lg ${
                rendimento >= 0 ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {rendimento.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <div>
            <Label>Variação</Label>
            <p
              className={`px-4 py-2 rounded-lg ${
                variacaoPercentual >= 0 ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {variacaoPercentual.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Observações */}
      <div>
        <Label>Observações</Label>
        <Textarea
          placeholder="Informações adicionais sobre o investimento..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 w-full rounded-xl font-medium text-white bg-[#1F2937] hover:bg-[#374151] transition-all"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-6 py-3 w-full rounded-xl text-white font-semibold text-[16px] bg-[#00D4D4] hover:opacity-80 hover:text-black transition-all"
        >
          Simular
        </button>
      </div>
    </form>
  );
}
