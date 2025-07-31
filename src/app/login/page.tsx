"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ necessário para enviar/receber o cookie
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao fazer login");
      }

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
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
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00D4AA" />
            <line x1="20%" y1="0" x2="90%" y2="100%" stroke="#3B82F6" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg sm:max-w-md md:max-w-[60%] lg:max-w-[40%] xl:max-w-[25%] bg-[#111827] rounded-2xl shadow-lg px-6 sm:px-8 md:px-10 pb-8">
        <div className="text-center">
          <div className="mx-auto mt-6 mb-6 w-[100px]">
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

          <h1 className="text-xl font-semibold text-white">Entrar na conta</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-2 flex flex-col 3xl:gap-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
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
                placeholder="Sua senha"
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

          <Button type="submit" className="h-12 max-w-full">
            Entrar
          </Button>

          <p className="text-sm text-center text-[#9CA3AF] mt-4">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-[#3B82F6] hover:underline font-medium"
            >
              Crie agora
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
