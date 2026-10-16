"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Database,
  LayoutGrid,
  MessageSquareText,
  NotebookPen,
  Shapes,
  Table2,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ store */
/** Qualquer botão da página abre o formulário sem precisar de provider. */

let isOpen = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openQualify() {
  isOpen = true;
  emit();
}

function setOpen(v: boolean) {
  isOpen = v;
  emit();
}

function useQualifyOpen() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => isOpen,
    () => false
  );
}

/* ---------------------------------------------------------------- conteúdo */

/**
 * Destino do formulário: código do país (55) + DDD + número, sem símbolos.
 * Em breve passa para o (92) 9437-6254 — o mesmo dos documentos legais: "559294376254".
 */
const WHATSAPP = "5592994486005";

type Option = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Como a resposta entra na frase enviada no WhatsApp */
  phrase: string;
  /** Resposta da FAVX para essa escolha */
  reply: string;
};

type Step = {
  eyebrow: string;
  question: string;
  options: Option[];
};

const steps: Step[] = [
  {
    eyebrow: "Sobre o seu negócio",
    question: "Qual a maior dificuldade do seu negócio hoje?",
    options: [
      {
        id: "leads",
        label: "Atender muitos leads",
        icon: Users,
        phrase: "atender o volume de leads",
        reply:
          "A IA da FAVX responde todos os leads em segundos, 24 horas por dia, qualifica cada conversa e entrega para o seu time só quem já está pronto para comprar. Nenhum contato fica sem resposta.",
      },
      {
        id: "vendas",
        label: "Vender mais",
        icon: TrendingUp,
        phrase: "vender mais",
        reply:
          "O Nexus AI conversa, contorna objeções, envia proposta e conduz o cliente até o fechamento dentro do WhatsApp — e os funis mostram exatamente onde a venda está travando.",
      },
      {
        id: "organizar",
        label: "Organizar dados",
        icon: Database,
        phrase: "organizar os dados da operação",
        reply:
          "O FAVX Hub centraliza conversas, propostas, histórico e o próximo passo de cada cliente em um só lugar — atualizado automaticamente pela IA, sem ninguém preencher nada na mão.",
      },
      {
        id: "metricas",
        label: "Metrificar dados",
        icon: BarChart3,
        phrase: "metrificar os dados do negócio",
        reply:
          "Dashboards de faturamento, origem do lead, cada etapa do funil e motivo da perda — em tempo real e 100% personalizáveis do seu jeito.",
      },
    ],
  },
  {
    eyebrow: "Sobre a sua operação",
    question: "Como você organiza sua operação comercial hoje?",
    options: [
      {
        id: "crm",
        label: "CRM",
        icon: LayoutGrid,
        phrase: "com um CRM",
        reply:
          "O FAVX Hub funciona como o seu CRM — e vai além: organiza toda a sua operação com IA, funis e automações no mesmo lugar, sem precisar juntar várias ferramentas.",
      },
      {
        id: "planilhas",
        label: "Planilhas",
        icon: Table2,
        phrase: "com planilhas",
        reply:
          "Planilha não avisa quando um lead esfria. No Hub, cada oportunidade tem etapa, responsável e próximo passo — e a IA atualiza tudo sozinha conforme a conversa acontece.",
      },
      {
        id: "anotacoes",
        label: "Anotações",
        icon: NotebookPen,
        phrase: "com anotações",
        reply:
          "Anotação perdida vira venda perdida. O Hub registra cada conversa automaticamente e a IA cuida do follow-up no tempo certo, sem depender da sua memória.",
      },
      {
        id: "outro",
        label: "Outro",
        icon: Shapes,
        phrase: "de outra forma",
        reply:
          "Seja qual for a ferramenta que você usa hoje, o FAVX Hub centraliza a operação e integra com o que já existe — com a IA cuidando do atendimento e do follow-up.",
      },
    ],
  },
];

function buildMessage(picked: Option[], name: string) {
  const [pain, tool] = picked;
  const intro = name.trim() ? `Meu nome é ${name.trim()}. ` : "";
  return (
    `Olá, FAVX! ${intro}` +
    `Minha maior dificuldade hoje é ${pain.phrase} e organizo minha operação comercial ${tool.phrase}. ` +
    `Quero saber mais sobre o FAVX Hub.`
  );
}

/* ----------------------------------------------------------------- diálogo */

export function QualifyDialog() {
  const open = useQualifyOpen();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Option[]>([]);
  const [name, setName] = useState("");

  const step = steps[index];
  const current = picked[index];
  const done = index >= steps.length;

  function reset() {
    setIndex(0);
    setPicked([]);
    setName("");
  }

  function choose(option: Option) {
    setPicked((prev) => {
      const next = [...prev];
      next[index] = option;
      return next;
    });
  }

  function send() {
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(buildMessage(picked, name))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
    setTimeout(reset, 400);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setTimeout(reset, 400);
      }}
    >
      <DialogContent>
        {/* Progresso */}
        <div className="flex gap-1.5 pr-10" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-favx-blue to-favx-orange"
                initial={false}
                animate={{ width: index > i || done ? "100%" : index === i ? "50%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-favx-blue">{step.eyebrow}</p>
              <DialogTitle className="mt-2 text-2xl font-medium leading-tight tracking-tight md:text-[1.7rem]">
                {step.question}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Escolha a opção que mais combina com o seu negócio para receber uma resposta da FAVX.
              </DialogDescription>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {step.options.map((o) => {
                  const active = current?.id === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => choose(o)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                        active
                          ? "border-favx-blue/60 bg-favx-blue/[0.07]"
                          : "border-black/[0.08] bg-[#f6f8fd] hover:border-favx-blue/40 hover:bg-favx-blue/[0.04]"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                          active
                            ? "bg-gradient-to-br from-favx-blue to-favx-orange text-white"
                            : "border border-black/5 bg-white text-favx-blue"
                        )}
                      >
                        {active ? <Check className="size-4" strokeWidth={3} /> : <o.icon className="size-4" />}
                      </span>
                      <span className="text-[15px] font-medium leading-snug">{o.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence initial={false}>
                {current && (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex gap-3 rounded-2xl border border-favx-blue/15 bg-gradient-to-br from-favx-blue/[0.07] to-favx-orange/[0.07] p-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-favx-blue shadow-sm">
                        <MessageSquareText className="size-4" />
                      </span>
                      <p className="text-sm leading-relaxed text-slate-600">{current.reply}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-4">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => setIndex((i) => i - 1)}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    Voltar
                  </button>
                ) : (
                  <span className="text-sm text-slate-400">
                    Passo {index + 1} de {steps.length}
                  </span>
                )}
                <Button disabled={!current} onClick={() => setIndex((i) => i + 1)}>
                  {index === steps.length - 1 ? "Ver resumo" : "Continuar"}
                  <ArrowRight />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-favx-blue">Quase lá</p>
              <DialogTitle className="mt-2 text-2xl font-medium leading-tight tracking-tight md:text-[1.7rem]">
                Vamos montar isso com você
              </DialogTitle>
              <DialogDescription className="mt-3 text-slate-600">
                Enviamos este resumo no WhatsApp e um especialista continua a conversa a partir dele.
              </DialogDescription>

              <label className="mt-6 block">
                <span className="text-sm font-medium text-slate-600">Seu nome</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#f6f8fd] px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-slate-400 focus:border-favx-blue/60 focus:bg-white"
                />
              </label>

              <div className="mt-4 rounded-2xl border border-black/[0.06] bg-[#f6f8fd] p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Mensagem</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {buildMessage(picked, name)}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIndex(steps.length - 1)}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Voltar
                </button>
                <Button variant="glow" onClick={send}>
                  Enviar no WhatsApp
                  <ArrowRight />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
