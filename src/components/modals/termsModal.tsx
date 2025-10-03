"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-3xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#111] pb-4 border-b border-[#333]">
            <Dialog.Title className="text-xl font-semibold text-white">
              Termos e Condições de Uso
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="text-white hover:text-gray-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6 text-gray-300 text-sm">
            <p className="text-gray-400 text-xs">
              Última atualização: Outubro de 2025
            </p>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                1. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed">
                Ao criar uma conta e utilizar o Nexus, você concorda em cumprir
                estes Termos. Se não concorda, não deve utilizar a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                2. Descrição do Serviço
              </h2>
              <p className="leading-relaxed">
                O Nexus é uma plataforma de gestão financeira pessoal para
                controle de despesas, receitas, cartões, categorias e metas. O
                serviço é fornecido "como está" e pode ser modificado a qualquer
                momento.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                3. Conta de Usuário
              </h2>
              <p className="leading-relaxed mb-2">
                Ao criar uma conta, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Fornecer informações verdadeiras e precisas</li>
                <li>Manter suas credenciais seguras e confidenciais</li>
                <li>Ser responsável por atividades em sua conta</li>
                <li>Ter pelo menos 18 anos de idade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                4. Privacidade e Proteção de Dados
              </h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Dados armazenados de forma segura e criptografada</li>
                <li>Não compartilhamos informações com terceiros</li>
                <li>Você pode exportar ou excluir dados a qualquer momento</li>
                <li>Processamento em conformidade com a LGPD</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                5. Uso Aceitável
              </h2>
              <p className="leading-relaxed mb-2">Você concorda em NÃO:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Usar para atividades ilegais ou fraudulentas</li>
                <li>Tentar hackear ou fazer engenharia reversa</li>
                <li>Sobrecarregar servidores com requisições excessivas</li>
                <li>Criar múltiplas contas para contornar limitações</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                6. Limitação de Responsabilidade
              </h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Não somos responsáveis por decisões financeiras baseadas na
                  plataforma
                </li>
                <li>Não garantimos disponibilidade ininterrupta</li>
                <li>
                  Recomendamos backup regular de informações importantes
                </li>
                <li>A plataforma não substitui aconselhamento profissional</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                7. Propriedade Intelectual
              </h2>
              <p className="leading-relaxed">
                Todo conteúdo, design e código são propriedade exclusiva e
                protegidos por direitos autorais. Você recebe licença limitada e
                não transferível para uso pessoal.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                8. Modificações dos Termos
              </h2>
              <p className="leading-relaxed">
                Podemos modificar estes termos a qualquer momento. Alterações
                significativas serão notificadas. Uso continuado após mudanças
                constitui aceitação.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white mb-2">
                9. Lei Aplicável
              </h2>
              <p className="leading-relaxed">
                Estes termos são regidos pelas leis do Brasil. Disputas serão
                resolvidas no foro da comarca de sua residência.
              </p>
            </section>

            <div className="pt-4 border-t border-[#333] text-center">
              <p className="text-xs text-gray-400">
                Ao criar uma conta, você confirma que leu, compreendeu e concorda
                com estes Termos e Condições.
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
