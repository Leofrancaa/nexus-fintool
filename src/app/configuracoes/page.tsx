"use client";

import { useState } from "react";
import PageTitle from "@/components/pageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { tokenManager } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ConfiguracoesPage() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMessage({
        type: "error",
        text: "Todos os campos são obrigatórios.",
      });
      return;
    }

    if (novaSenha.length < 6) {
      setMessage({
        type: "error",
        text: "A nova senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMessage({
        type: "error",
        text: "A nova senha e a confirmação não coincidem.",
      });
      return;
    }

    setLoading(true);

    try {
      const token = tokenManager.get();

      if (!token) {
        setMessage({
          type: "error",
          text: "Sessão expirada. Faça login novamente.",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Senha alterada com sucesso!",
        });
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        setMessage({
          type: "error",
          text: data.message || data.error || "Erro ao alterar senha.",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMessage({
        type: "error",
        text: "Erro de conexão com o servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[var(--page-bg)] px-8 py-8 lg:py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Configurações"
          subTitle="Gerencie suas preferências e segurança da conta"
        />
      </div>

      <div className="mt-8 max-w-2xl">
        <Card className="p-6 bg-[var(--card-bg)] border-[var(--card-border)]">
          <h2 className="text-xl font-semibold mb-6 text-[var(--card-text)]">
            Alterar Senha
          </h2>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="senhaAtual"
                  type={showSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--filter-placeholder)] hover:text-[var(--filter-text)] transition-colors"
                  tabIndex={-1}
                >
                  {showSenhaAtual ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="novaSenha"
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--filter-placeholder)] hover:text-[var(--filter-text)] transition-colors"
                  tabIndex={-1}
                >
                  {showNovaSenha ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-[var(--filter-placeholder)]">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--filter-placeholder)] hover:text-[var(--filter-text)] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmarSenha ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
