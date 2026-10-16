"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  AtSign,
  CalendarCheck,
  ChevronRight,
  CircleDollarSign,
  FileText,
  FileStack,
  Hash,
  ListFilter,
  Paperclip,
  PenLine,
  Plus,
  RefreshCw,
  SendHorizonal,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import { scrollToTarget } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import { SPARKLE_BLUE, SparkleField } from "@/components/sparkle-field";

/* ---------------------------------------------------------------- Roteiros */

type SysKind = "crm" | "proposal" | "calendar" | "sale";

type Step =
  | { from: "client" | "ai"; text: string }
  | { sys: SysKind; text: string; stage?: number; value?: string };

type Scenario = {
  id: string;
  label: string;
  business: string;
  client: string;
  clientFull: string;
  steps: Step[];
};

const STAGES = ["Lead", "Qualificado", "Proposta", "Negociação", "Fechado"];

// Empresas e clientes fictícios — cada roteiro termina com a venda fechada
const SCENARIOS: Scenario[] = [
  {
    id: "eventos",
    label: "Eventos",
    business: "Aurora Drinks",
    client: "Marina",
    clientFull: "Marina Duarte",
    steps: [
      { from: "client", text: "Oi! Quanto fica o bar para um casamento de 120 pessoas?" },
      { from: "ai", text: "Olá, Marina! Parabéns pelo casamento 💙 Para 120 convidados, indico o pacote Premium: 5h de open bar, 8 drinks autorais e 3 bartenders." },
      { sys: "crm", text: "Lead qualificado · Casamento, 120 convidados", stage: 1 },
      { from: "ai", text: "O investimento fica R$ 5.400. Qual é a data do evento?" },
      { sys: "proposal", text: "Proposta enviada · Pacote Premium", stage: 2, value: "R$ 5.400" },
      { from: "client", text: "Dia 14/11. Achei um pouco acima do que eu pensava 😅" },
      { from: "ai", text: "Entendo! Fechando até sexta, consigo 10% de desconto e incluo a degustação para o casal. Fica R$ 4.860." },
      { sys: "crm", text: "Negociação · desconto de 10% aplicado", stage: 3, value: "R$ 4.860" },
      { from: "client", text: "Fechado! Como faço para reservar?" },
      { from: "ai", text: "Perfeito! Enviei o link do sinal e reservei a degustação para sábado, às 15h 🥂" },
      { sys: "calendar", text: "Degustação agendada · Sáb, 15h" },
      { sys: "sale", text: "Venda fechada · R$ 4.860", stage: 4 },
    ],
  },
  {
    id: "clinica",
    label: "Clínica",
    business: "Clínica Lumière",
    client: "Paula",
    clientFull: "Paula Andrade",
    steps: [
      { from: "client", text: "Olá, vocês fazem limpeza de pele?" },
      { from: "ai", text: "Oi, Paula! Fazemos sim ✨ A limpeza profunda leva 1h e sai por R$ 180. Você já fez alguma vez?" },
      { sys: "crm", text: "Lead qualificado · Estética facial", stage: 1 },
      { from: "client", text: "Já, mas faz tempo. Tem horário essa semana?" },
      { from: "ai", text: "Tenho quinta às 10h ou sexta às 16h. E o pacote com 3 sessões sai por R$ 450 — você economiza R$ 90." },
      { sys: "proposal", text: "Proposta enviada · Pacote 3 sessões", stage: 2, value: "R$ 450" },
      { from: "client", text: "Gostei do pacote! Pode ser sexta às 16h." },
      { sys: "calendar", text: "Consulta agendada · Sex, 16h", stage: 3 },
      { from: "ai", text: "Agendado! 💙 Te enviei o link de pagamento. No Pix você ganha 5% de desconto." },
      { from: "client", text: "Paguei agora!" },
      { sys: "sale", text: "Venda fechada · R$ 427,50", stage: 4, value: "R$ 427,50" },
      { from: "ai", text: "Pagamento confirmado, Paula! Te mando um lembrete na quinta. Até sexta 😊" },
    ],
  },
  {
    id: "varejo",
    label: "Varejo",
    business: "Casa Nobre Móveis",
    client: "Rafael",
    clientFull: "Rafael Lima",
    steps: [
      { from: "client", text: "Esse sofá retrátil de 3 lugares ainda tem em cinza?" },
      { from: "ai", text: "Oi, Rafael! Tem sim, 2 unidades em estoque. Ele custa R$ 3.290 em até 10x sem juros." },
      { sys: "crm", text: "Estoque consultado · 2 unidades", stage: 1 },
      { from: "client", text: "E o frete para o Centro?" },
      { from: "ai", text: "Para o Centro o frete é grátis e entregamos em até 3 dias úteis 🚚" },
      { sys: "proposal", text: "Proposta enviada · Sofá retrátil cinza", stage: 2, value: "R$ 3.290" },
      { from: "client", text: "Se eu pagar à vista tem desconto?" },
      { from: "ai", text: "À vista no Pix sai por R$ 2.990. Posso reservar o seu agora?" },
      { sys: "crm", text: "Negociação · condição à vista", stage: 3, value: "R$ 2.990" },
      { from: "client", text: "Pode sim!" },
      { sys: "sale", text: "Venda fechada · R$ 2.990", stage: 4 },
      { sys: "calendar", text: "Entrega agendada · Qua, manhã" },
      { from: "ai", text: "Pedido confirmado! 🎉 A entrega fica para quarta de manhã." },
    ],
  },
  {
    id: "educacao",
    label: "Educação",
    business: "Instituto Vértice",
    client: "Lucas",
    clientFull: "Lucas Moreira",
    steps: [
      { from: "client", text: "Quero saber do curso de inglês para adultos." },
      { from: "ai", text: "Oi, Lucas! Qual é o seu objetivo: trabalho, viagem ou certificação?" },
      { from: "client", text: "Trabalho. Tenho entrevista numa multinacional em março." },
      { sys: "crm", text: "Lead qualificado · Inglês para negócios", stage: 1 },
      { from: "ai", text: "Então o ideal é o Business Intensive: 2 aulas por semana e simulações de entrevista. São 12x de R$ 289." },
      { sys: "proposal", text: "Proposta enviada · Business Intensive", stage: 2, value: "12x R$ 289" },
      { from: "client", text: "Posso fazer uma aula teste antes?" },
      { from: "ai", text: "Claro! Reservei uma aula experimental na terça, às 19h. Matriculando até lá, a 1ª mensalidade sai pela metade." },
      { sys: "calendar", text: "Aula experimental · Ter, 19h", stage: 3 },
      { from: "client", text: "Show, já quero garantir a matrícula!" },
      { sys: "sale", text: "Matrícula fechada · 12x R$ 289", stage: 4 },
      { from: "ai", text: "Matrícula confirmada, Lucas! 🎓 Te vejo na terça." },
    ],
  },
];

const SYS_META: Record<SysKind, { icon: LucideIcon; className: string }> = {
  crm: { icon: RefreshCw, className: "border-favx-blue/20 bg-favx-blue/10 text-favx-blue" },
  proposal: { icon: FileText, className: "border-sky-300/50 bg-sky-50 text-sky-600" },
  calendar: { icon: CalendarCheck, className: "border-slate-200 bg-slate-50 text-slate-500" },
  sale: { icon: CircleDollarSign, className: "border-transparent bg-favx-blue text-white" },
};

const features: { icon: LucideIcon; text: string }[] = [
  { icon: Users, text: "Estratégia desenhada por especialistas em vendas" },
  { icon: Target, text: "Atende, qualifica e negocia no WhatsApp" },
  { icon: RefreshCw, text: "Atualiza o funil e o sistema sozinho" },
  { icon: CalendarCheck, text: "Agenda visitas, consultas e entregas" },
  { icon: CircleDollarSign, text: "Envia propostas e links de pagamento" },
];

/* ------------------------------------------------------------------ Seção */

export function NexusAi() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.3 });
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  if (inView && !started) setStarted(true);

  const scenario = SCENARIOS[index];

  function select(i: number) {
    setIndex(i);
    setCycle((c) => c + 1);
  }

  return (
    <section id="nexus" ref={root} className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-5 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-[5.5rem]">
        {/* Texto */}
        <div>
          <h2 className="text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            O comercial inteligente que <span className="text-favx-blue">fecha vendas</span> por você
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            O Nexus AI é o modelo de IA nativo da FAVX para o seu comercial, adaptado ao seu negócio.
            Grandes estrategistas de vendas desenham e coordenam cada etapa da abordagem, e o Nexus
            executa no WhatsApp — gerando mais vendas e mais organização, 24 horas por dia.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.text} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-favx-blue/30 bg-favx-blue/15">
                  <f.icon className="size-3.5 text-favx-blue" />
                </span>
                <span className="leading-snug">{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="mb-3 text-sm text-muted-foreground">Veja o Nexus em diferentes modelos comerciais</p>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={i === index}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-sm transition-colors",
                    i === index
                      ? "border-transparent text-white"
                      : "border-black/10 text-slate-600 hover:border-black/25 hover:text-slate-900"
                  )}
                >
                  {i === index && (
                    <motion.span
                      layoutId="nexus-chip"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-favx-blue to-[#1b2a8a]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contato");
            }}
            className="group mt-10 inline-flex items-center gap-1 text-favx-blue transition-colors hover:text-slate-900"
          >
            Quero o Nexus no meu comercial
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Visual: a conversa como ela aparece no aplicativo */}
        <div className="theme-dark relative h-[680px] w-full overflow-hidden rounded-[2.5rem] bg-black sm:aspect-square sm:h-auto">
          <SparkleField gradient={SPARKLE_BLUE} />
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="theme-light flex h-full w-full overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]">
              <Sidebar index={index} onSelect={select} />
              <div className="flex min-w-0 flex-1 flex-col">
                {started ? (
                  <ChatDemo
                    key={`${scenario.id}-${cycle}`}
                    scenario={scenario}
                    onDone={() => {
                      setIndex((i) => (i + 1) % SCENARIOS.length);
                      setCycle((c) => c + 1);
                    }}
                  />
                ) : (
                  <ChatHeader scenario={scenario} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- Chat */

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type Shown = Step & { key: number; time: string };

/** Horários fictícios da conversa, a partir das 09:03. */
function clockAt(i: number) {
  const total = 9 * 60 + 3 + i * 2;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Avatar redondo com as iniciais — o cliente e a IA. */
function Avatar({ name, nexus, className }: { name?: string; nexus?: boolean; className?: string }) {
  if (nexus) {
    return (
      <span className={cn("relative grid size-8 shrink-0 place-items-center rounded-full bg-[conic-gradient(from_180deg,#1b2a8a,#2f6bff,#7cc7ff,#1b2a8a)]", className)}>
        <span className="size-2.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(47,107,255,0.5)]" />
      </span>
    );
  }
  const initials = (name ?? "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-favx-blue/10 text-[11px] font-semibold text-favx-blue", className)}>
      {initials}
    </span>
  );
}

const sidebarLinks = [
  { icon: Hash, label: "Canais" },
  { icon: FileStack, label: "Rascunhos" },
  { icon: AtSign, label: "Menções" },
  { icon: Paperclip, label: "Arquivos" },
];

/** Barra lateral do aplicativo: cada conversa é um modelo comercial. */
function Sidebar({ index, onSelect }: { index: number; onSelect: (i: number) => void }) {
  return (
    <aside className="hidden w-[196px] shrink-0 flex-col border-r border-black/5 bg-[#f6f8fd] p-3 lg:flex">
      <span className="mb-4 flex items-center gap-2 rounded-xl bg-favx-blue px-3 py-2.5 text-[13px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(47,107,255,0.9)]">
        <PenLine className="size-3.5" />
        Nova conversa
      </span>

      <ul className="space-y-0.5">
        {sidebarLinks.map((l) => (
          <li key={l.label} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-slate-500">
            <l.icon className="size-3.5" />
            {l.label}
          </li>
        ))}
      </ul>

      <p className="mb-2 mt-5 px-2.5 text-[11px] uppercase tracking-wide text-slate-400">Conversas</p>
      <ul className="min-h-0 flex-1 space-y-0.5 overflow-hidden">
        {SCENARIOS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={i === index}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] transition-colors",
                i === index ? "bg-favx-blue/10 font-medium text-favx-blue" : "text-slate-600 hover:bg-black/[0.04]"
              )}
            >
              <Avatar name={s.clientFull} className="size-7" />
              <span className="min-w-0 flex-1 truncate">{s.clientFull}</span>
              {i === index && <span className="size-1.5 shrink-0 rounded-full bg-favx-blue" />}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ChatHeader({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex items-center gap-3 border-b border-black/[0.07] px-4 py-3.5 sm:px-5">
      <Avatar name={scenario.clientFull} className="lg:hidden" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">Conversa com {scenario.clientFull}</p>
        <p className="truncate text-[11px] text-slate-400">
          Nexus AI · {scenario.business}
          <span className="hidden sm:inline"> · </span>
          <span className="hidden text-favx-blue sm:inline">online no WhatsApp</span>
        </p>
      </div>
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-black/10 text-slate-400">
        <ListFilter className="size-4" />
      </span>
    </div>
  );
}

function ChatDemo({ scenario, onDone }: { scenario: Scenario; onDone: () => void }) {
  const [shown, setShown] = useState<Shown[]>([]);
  const [typing, setTyping] = useState<"client" | "ai" | null>(null);
  const [stage, setStage] = useState(0);
  const [value, setValue] = useState<string | null>(null);
  const done = useRef(onDone);

  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (step: Step) => {
      if ("sys" in step) {
        if (step.stage !== undefined) setStage(step.stage);
        if (step.value) setValue(step.value);
      }
    };

    (async () => {
      let key = 0;
      for (const step of scenario.steps) {
        if (cancelled) return;
        if (!reduce) {
          if ("from" in step) {
            await wait(step.from === "client" ? 500 : 300);
            if (cancelled) return;
            setTyping(step.from);
            await wait(650 + Math.min(step.text.length * 14, 1300));
            if (cancelled) return;
            setTyping(null);
          } else {
            await wait(350);
          }
        }
        if (cancelled) return;
        const k = key++;
        setShown((s) => [...s.slice(-8), { ...step, key: k, time: clockAt(k) }]);
        apply(step);
        if (!reduce && "sys" in step) await wait(650);
      }
      await wait(reduce ? 12000 : 4200);
      if (!cancelled) done.current();
    })();

    return () => {
      cancelled = true;
    };
  }, [scenario]);

  const closed = stage === STAGES.length - 1;

  return (
    <>
      <ChatHeader scenario={scenario} />

      {/* Etapa do funil atualizada em tempo real */}
      <div className="border-b border-black/[0.07] px-5 py-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Funil · <span className={cn("transition-colors", closed ? "text-favx-blue" : "text-slate-700")}>{STAGES[stage]}</span>
          </span>
          <AnimatePresence mode="popLayout">
            {value && (
              <motion.span
                key={value}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={cn("font-medium tabular-nums", closed ? "text-favx-blue" : "text-slate-500")}
              >
                {value}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {STAGES.map((s, i) => (
            <span key={s} className="h-1 overflow-hidden rounded-full bg-slate-200">
              <motion.span
                className={cn("block h-full rounded-full", closed ? "bg-gradient-to-r from-favx-blue to-[#1b2a8a]" : "bg-gradient-to-r from-favx-cyan to-favx-blue")}
                initial={false}
                animate={{ width: i <= stage ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Mensagens */}
      <div className="relative flex flex-1 flex-col justify-end gap-3 overflow-hidden px-4 py-4 [mask-image:linear-gradient(to_bottom,transparent,black_16%)] sm:px-5">
        <div className="flex justify-center">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">Hoje</span>
        </div>

        <AnimatePresence initial={false}>
          {shown.map((m) => (
            <motion.div
              key={m.key}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={cn("flex", "sys" in m ? "justify-center" : m.from === "ai" ? "justify-end" : "gap-2.5")}
            >
              {"sys" in m ? (
                <SysPill kind={m.sys} text={m.text} />
              ) : m.from === "client" ? (
                <>
                  <Avatar name={scenario.clientFull} />
                  <span className="min-w-0">
                    <Bubble from="client" text={m.text} />
                    <span className="mt-1 block text-[11px] text-slate-400">
                      <span className="text-slate-600">{scenario.client}</span> {m.time}
                    </span>
                  </span>
                </>
              ) : (
                <span className="flex min-w-0 flex-col items-end">
                  <Bubble from="ai" text={m.text} />
                  <span className="mt-1 text-[11px] text-slate-400">
                    <span className="text-slate-600">Nexus AI</span> {m.time}
                  </span>
                </span>
              )}
            </motion.div>
          ))}

          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              className={cn("flex items-center gap-2.5", typing === "ai" && "justify-end")}
            >
              {typing === "client" && <Avatar name={scenario.clientFull} />}
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-slate-400"
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
              {typing === "ai" && <Avatar nexus />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barra de envio */}
      <div className="px-4 pb-4 sm:px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-2 pl-4">
          <span className="min-w-0 flex-1 truncate text-sm text-slate-400">
            {typing === "ai" ? "Nexus está digitando…" : `Mensagem para ${scenario.client}`}
          </span>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-slate-500">
            <Plus className="size-4" />
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-favx-blue px-3.5 py-2 text-[13px] font-medium text-white">
            Enviar
            <SendHorizonal className="size-3.5" />
          </span>
        </div>
      </div>
    </>
  );
}

function Bubble({ from, text }: { from: "client" | "ai"; text: string }) {
  return (
    <p
      className={cn(
        "max-w-[min(20rem,82%)] px-4 py-2.5 text-[13.5px] leading-snug",
        from === "ai"
          ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-favx-blue to-[#1b2a8a] text-white"
          : "rounded-2xl rounded-tl-sm bg-slate-100 text-slate-800"
      )}
    >
      {text}
    </p>
  );
}

function SysPill({ kind, text }: { kind: SysKind; text: string }) {
  const meta = SYS_META[kind];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]", meta.className)}>
      <meta.icon className="size-3" />
      {text}
    </span>
  );
}
