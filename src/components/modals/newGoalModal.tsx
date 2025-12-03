"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/auth";
import { toast } from "react-hot-toast";
import AddButton from "@/components/ui/addButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: number;
  nome: string;
  cor: string;
  tipo: "receita" | "despesa";
}

interface Props {
  onCreated: () => void;
}

export function NewGoalModal({ onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const now = new Date();
  const [formData, setFormData] = useState({
    nome: "",
    category_id: "",
    valor_alvo: "",
    mes: String(now.getMonth() + 1),
    ano: String(now.getFullYear()),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiRequest(`/api/categories?tipo=receita`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch {
      toast.error("Erro ao carregar categorias");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        tipo: "receita",
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        valor_alvo: Number(formData.valor_alvo),
        mes: Number(formData.mes),
        ano: Number(formData.ano),
      };

      const res = await apiRequest("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao criar meta");
      }

      toast.success("Meta criada com sucesso!");
      const closeBtn = document.querySelector("[data-radix-dialog-close]") as HTMLButtonElement;
      closeBtn?.click();
      setFormData({
        nome: "",
        category_id: "",
        valor_alvo: "",
        mes: String(now.getMonth() + 1),
        ano: String(now.getFullYear()),
      });
      onCreated();
    } catch (error) {
      toast.error((error as Error).message || "Erro ao criar meta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Nova Meta
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Nova Meta
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="text-white hover:text-gray-300 cursor-pointer"
                data-radix-dialog-close
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome da Meta</Label>
                <Input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Economizar para viagem"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Categoria (opcional)</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Valor Alvo</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={formData.valor_alvo}
                  onChange={(e) => setFormData({ ...formData, valor_alvo: e.target.value })}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mês</Label>
                  <Select
                    value={formData.mes}
                    onValueChange={(value) => setFormData({ ...formData, mes: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ano</Label>
                  <Select
                    value={formData.ano}
                    onValueChange={(value) => setFormData({ ...formData, ano: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            <div className="flex gap-2 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-[var(--card-border)] rounded-lg hover:bg-[var(--filter-input-bg)] transition-colors text-[var(--card-text)]"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar Meta"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
