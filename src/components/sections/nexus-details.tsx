"use client";

import { ArrowUpRight, CalendarCheck, MessageCircle, RefreshCw, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openQualify } from "@/components/qualify";

const steps = [
  {
    icon: MessageCircle,
    title: "Atende e entende o cliente",
    description: "Responde no WhatsApp, identifica o que cada pessoa procura e mantém o atendimento ativo, 24 horas por dia.",
  },
  {
    icon: Target,
    title: "Qualifica e conduz a negociação",
    description: "Faz as perguntas certas, apresenta soluções, contorna objeções e envia propostas e links de pagamento.",
  },
  {
    icon: CalendarCheck,
    title: "Organiza o próximo passo",
    description: "Agenda visitas, consultas e entregas e cuida do follow-up para dar continuidade a cada oportunidade.",
  },
  {
    icon: RefreshCw,
    title: "Mantém o comercial atualizado",
    description: "Registra o histórico das conversas e atualiza o funil automaticamente, com cada lead em sua etapa.",
  },
];

export function NexusDetails() {
  return (
    <section id="nexus-ai" aria-labelledby="nexus-title" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-[1600px] items-start gap-14 px-5 md:px-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-[5.5rem]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-favx-blue/20 bg-favx-blue/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-favx-blue">
            <Sparkles className="size-3.5" />
            Nexus AI
          </span>
          <h2 id="nexus-title" className="mt-6 text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Do primeiro contato <span className="text-favx-blue">ao fechamento.</span>
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
            O Nexus AI é a inteligência artificial nativa da FAVX para o seu comercial,
            adaptada ao seu negócio. Atende, qualifica e negocia no WhatsApp,
            conectando cada conversa à sua operação de vendas.
          </p>
          <div className="mt-8 border-l-2 border-favx-orange pl-5">
            <p className="font-medium">Tecnologia com estratégia comercial.</p>
            <p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">
              Especialistas em vendas desenham e coordenam a abordagem. O Nexus executa
              cada etapa, enquanto sua equipe acompanha as oportunidades no FAVX Hub.
            </p>
          </div>
          <Button variant="dark" size="lg" className="mt-9" onClick={openQualify}>
            Conhecer o Nexus AI
            <ArrowUpRight />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">Incluso no Plano FAVX hub.</p>
        </div>

        <div className="rounded-[2rem] border border-favx-blue/10 bg-[#f6f8fd] p-6 sm:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Como o Nexus trabalha por você
          </p>
          <ol className="mt-5 divide-y divide-slate-200/80">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-6 first:pt-3 last:pb-0 sm:gap-5">
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-2xl border border-favx-blue/15 bg-white text-favx-blue">
                  <step.icon className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="mb-1 text-[11px] font-medium tabular-nums tracking-wider text-favx-blue/70">0{index + 1}</p>
                  <h3 className="text-lg font-medium leading-snug tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
