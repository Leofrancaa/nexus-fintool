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

interface Card {
  id: number;
  nome: string;
  numero: string;
}

interface Categoria {
  id: number;
  nome: string;
}

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export function NewExpenseForm({ onClose, onCreated }: Props) {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [cardId, setCardId] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [fixo, setFixo] = useState(false);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [observacoes, setObservacoes] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cartoes, setCartoes] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?tipo=despesa`, // ✅ filtro no endpoint
        { credentials: "include" }
      );
      const data = await res.json();
      setCategorias(data);
    };

    const fetchCartoes = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
        credentials: "include",
      });
      const data = await res.json();
      setCartoes(data);
    };

    fetchCategorias();
    fetchCartoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !descricao ||
      !quantidade ||
      !metodoPagamento ||
      !categoriaId ||
      !data
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (isNaN(parseFloat(quantidade))) {
      toast.error("Informe um valor válido.");
      return;
    }

    if (isNaN(parseInt(categoriaId))) {
      toast.error("Selecione uma categoria válida.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/expenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            tipo: descricao,
            quantidade: parseFloat(quantidade),
            metodo_pagamento: metodoPagamento,
            category_id: categoriaId ? parseInt(categoriaId) : null,
            card_id:
              metodoPagamento === "cartao de credito" ? parseInt(cardId) : null,
            parcelas: parseInt(parcelas),
            fixo,
            frequencia: null,
            data,
            observacoes,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Erro ao salvar despesa.");
        return;
      }

      toast.success("Despesa cadastrada!");
      onCreated?.();
      onClose();
    } catch {
      toast.error("Erro ao salvar despesa.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {/* Descrição + Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Descrição</Label>
          <Input
            placeholder="Ex: Almoço, Gasolina..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div>
          <Label>Valor</Label>
          <Input
            type="number"
            placeholder="Ex: 50.00"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>
      </div>

      {/* Categoria + Forma de Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Categoria</Label>
          <Select value={categoriaId} onValueChange={setCategoriaId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Forma de Pagamento</Label>
          <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="cartao de debito">Cartão de Débito</SelectItem>
              <SelectItem value="cartao de credito">
                Cartão de Crédito
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cartão + Parcelas */}
      {metodoPagamento === "cartao de credito" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Cartão</Label>
            <Select value={cardId} onValueChange={setCardId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cartão" />
              </SelectTrigger>
              <SelectContent>
                {cartoes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.nome} ****{c.numero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Parcelas</Label>
            <Input
              type="number"
              min={1}
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value)}
              placeholder="Ex: 1"
            />
          </div>
        </div>
      )}

      {/* Data */}
      <div>
        <Label>Data</Label>
        <Input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      {/* Toggle despesa fixa */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFixo(!fixo)}
          className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors duration-300 ${
            fixo ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              fixo ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-white text-sm">Despesa fixa</span>
      </div>

      {/* Observações */}
      <div>
        <Label>Observações</Label>
        <Textarea
          placeholder="Observações adicionais..."
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
          Salvar
        </button>
      </div>
    </form>
  );
}
