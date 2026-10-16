"use client";

import { motion } from "motion/react";
import {
  BadgeCheck,
  BarChart3,
  Bot,
  Gauge,
  KanbanSquare,
  Lock,
  Plug,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
  /** Visual de apoio dentro do card */
  visual?: "chat" | "dashboard" | "funnel" | "meta";
  big?: boolean;
  /** Card largo de fechamento: ícone e texto lado a lado */
  strip?: boolean;
};

const features: Feature[] = [
  {
    icon: Bot,
    title: "IA que trabalha por você",
    text: "Assistentes treinados com os dados do seu negócio respondem clientes, geram relatórios e sugerem ações.",
    className: "md:col-span-2 md:row-span-2",
    visual: "chat",
    big: true,
  },
  {
    icon: BarChart3,
    title: "Dashboards que mostram tudo",
    text: "Faturamento, origem de cada lead, o que acontece em cada etapa do funil e o motivo da perda. Você escolhe os indicadores, monta os painéis do seu jeito e acompanha em tempo real.",
    className: "md:col-span-2 md:row-span-2",
    visual: "dashboard",
    big: true,
  },
  {
    icon: KanbanSquare,
    title: "Funis de vendas que organizam a operação",
    text: "Cada oportunidade em sua etapa, com responsável, valor e próximo passo. Arraste o card e o time inteiro enxerga a mesma operação.",
    className: "md:col-span-2",
    visual: "funnel",
  },
  {
    icon: BadgeCheck,
    title: "API Oficial da Meta",
    text: "Atenda pelo WhatsApp Business Platform, com número verificado, modelos de mensagem aprovados e tudo dentro das regras da Meta.",
    className: "md:col-span-2",
    visual: "meta",
  },
  { icon: Workflow, title: "Automação de processos", text: "Elimine tarefas repetitivas com fluxos visuais." },
  { icon: Plug, title: "Integrações", text: "Conecte ERP, CRM, e-commerce e meios de pagamento." },
  { icon: Gauge, title: "Alta performance", text: "Infraestrutura escalável e rápida, pronta para crescer." },
  { icon: Lock, title: "Segurança e LGPD", text: "Criptografia, controle de acesso e conformidade." },
  {
    icon: TrendingUp,
    title: "Previsão de vendas",
    text: "Modelos preditivos antecipam demanda e oportunidades de receita.",
    className: "md:col-span-4 md:flex-row md:items-center md:gap-8",
    strip: true,
  },
];

export function Features() {
  return (
    <section id="recursos" className="relative isolate overflow-hidden py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-favx-orange/15 blur-[140px]"
      />
      <div className="mx-auto max-w-[1600px] px-5 md:px-12 lg:px-[5.5rem]">
        <h2 className="mb-16 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.04em]">
          Tecnologia que acelera cada etapa do seu negócio
        </h2>

        <div className="grid auto-rows-[minmax(220px,auto)] gap-5 md:grid-cols-4">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: Math.min(i, 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-[#f4f6fc] p-7",
                f.className
              )}
            >
              <div
                aria-hidden
                className="absolute -right-20 -top-20 size-56 rounded-full bg-favx-blue/0 blur-3xl transition-colors duration-500 group-hover:bg-favx-blue/15"
              />
              <span className="grid size-12 place-items-center rounded-2xl border border-black/5 bg-gradient-to-br from-favx-blue/15 to-favx-orange/15">
                <f.icon className="size-5 text-favx-blue" strokeWidth={1.75} />
              </span>
              <div className={cn("relative", f.strip ? "mt-6 md:mt-0" : "mt-10")}>
                <h3 className={cn("font-medium tracking-tight", f.big ? "text-3xl md:text-4xl" : "text-xl")}>
                  {f.title}
                </h3>
                <p className={cn("mt-3 leading-relaxed text-muted-foreground", f.big && "max-w-md text-lg")}>
                  {f.text}
                </p>
              </div>
              {f.visual === "chat" && <ChatPreview />}
              {f.visual === "dashboard" && <DashboardPreview />}
              {f.visual === "funnel" && <FunnelPreview />}
              {f.visual === "meta" && <MetaPreview />}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
    <div className="relative mt-10 space-y-3 rounded-2xl border border-black/5 bg-white p-5 text-sm shadow-sm">
      <p className="w-fit max-w-[80%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-slate-700">
        Quais produtos tiveram maior margem esta semana?
      </p>
      <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-favx-blue to-favx-orange px-4 py-2.5 text-white">
        Os 3 principais responderam por 62% do lucro. Quer que eu crie uma campanha para eles?
      </p>
    </div>
  );
}

/* --------------------------------------------------------- Painel de exemplo */

const revenue = [42, 58, 47, 72, 66, 88, 79];
const sources = [
  { label: "Instagram", value: 38 },
  { label: "Indicação", value: 27 },
  { label: "Google", value: 21 },
  { label: "Site", value: 14 },
];
const lossReasons = [
  { label: "Preço", value: 41 },
  { label: "Sem retorno", value: 33 },
  { label: "Prazo", value: 26 },
];

function DashboardPreview() {
  return (
    <div className="relative mt-10 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Faturamento no mês</p>
          <p className="text-2xl font-medium tracking-tight">R$ 184,2 mil</p>
        </div>
        <span className="rounded-full bg-favx-blue/10 px-2.5 py-1 text-xs font-medium text-favx-blue">+18,4%</span>
      </div>

      {/* Faturamento por semana */}
      <div className="mt-4 flex h-16 items-end gap-1.5">
        {revenue.map((v, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-favx-blue/30 to-favx-blue"
            initial={{ height: 0 }}
            whileInView={{ height: `${v}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Origem do lead */}
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Origem do lead</p>
          <ul className="space-y-1.5">
            {sources.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-[11px]">
                <span className="w-16 shrink-0 text-slate-600">{s.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.span
                    className="block h-full rounded-full bg-gradient-to-r from-favx-blue to-favx-orange"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.value * 2.4}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-7 text-right tabular-nums text-slate-500">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Motivo da perda */}
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Motivo da perda</p>
          <ul className="space-y-1.5">
            {lossReasons.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-[11px]">
                <span className="w-16 shrink-0 text-slate-600">{s.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.span
                    className="block h-full rounded-full bg-favx-orange/70"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.value * 2.4}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-7 text-right tabular-nums text-slate-500">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-slate-400">Dados de exemplo · painéis 100% personalizáveis</p>
    </div>
  );
}

/* ----------------------------------------------------------------- Funil */

const stages = [
  { label: "Novo lead", count: 128, width: "100%" },
  { label: "Contato", count: 86, width: "78%" },
  { label: "Proposta", count: 41, width: "54%" },
  { label: "Negociação", count: 23, width: "36%" },
  { label: "Ganho", count: 14, width: "22%" },
];

function FunnelPreview() {
  return (
    <div className="relative mt-8 space-y-1.5 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      {stages.map((s, i) => (
        <motion.div
          key={s.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <span
            className="flex h-7 items-center rounded-lg bg-gradient-to-r from-favx-blue to-favx-orange px-2.5 text-[11px] font-medium text-white"
            style={{ width: s.width }}
          >
            {s.label}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-slate-500">{s.count}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- API da Meta */

function MetaPreview() {
  return (
    <div className="relative mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-favx-blue/10 px-3 py-1.5 text-[11px] font-medium text-favx-blue">
        <BadgeCheck className="size-3.5" />
        Número verificado
      </span>
      {["Modelos aprovados", "Disparos em escala", "Multiatendimento"].map((t) => (
        <span key={t} className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] text-slate-600">
          {t}
        </span>
      ))}
    </div>
  );
}
