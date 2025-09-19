"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/auth";

export default function Signup() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await register({ nome, email, senha });

      if (response.success) {
        toast.success("Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        toast.error(response.message || "Erro ao registrar");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#0E1116] px-4 overflow-hidden">
      {/* Linhas de fundo */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g strokeWidth="2">
            <line x1="0" y1="30%" x2="100%" y2="60%" stroke="#00D4AA" />
            <line x1="0" y1="70%" x2="100%" y2="50%" stroke="#00D4D4" />
            <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#3B82F6" />
            <line
              x1="40%"
              y1="0"
              x2="60%"
              y2="100%"
              stroke="rgba(255,255,255,0.05)"
            />
            <line x1="80%" y1="0" x2="70%" y2="100%" stroke="#3B82F6" />
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="rgba(255,255,255,0.05)"
            />
            <line
              x1="0"
              y1="30%"
              x2="100%"
              y2="10%"
              stroke="rgba(255,255,255,0.05)"
            />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="Nexus Logo"
            width={180}
            height={60}
            className="mx-auto"
          />
          <h2 className="mt-8 text-3xl font-bold text-white">Crie sua conta</h2>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Comece a controlar suas finanças hoje
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="nome">Nome completo</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="pl-10 max-w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-10 max-w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="senha">Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                id="senha"
                type={showSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha (mín. 6 caracteres)"
                className="pl-10 pr-10 max-w-full"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
              >
                {showSenha ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                id="confirmarSenha"
                type={showConfirmar ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua senha"
                className="pl-10 pr-10 max-w-full"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
              >
                {showConfirmar ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="h-12 max-w-full">
            Criar Conta
          </Button>

          <p className="text-md text-center text-[#9CA3AF] mt-4">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#3B82F6] hover:underline font-medium text-lg"
            >
              Entre aqui
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
