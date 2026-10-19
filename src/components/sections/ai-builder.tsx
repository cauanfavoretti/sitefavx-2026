"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  Bot,
  Check,
  ChevronRight,
  Sparkles,
  Wand2,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { scrollToTarget } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import { SPARKLE_ORANGE, SparkleField } from "@/components/sparkle-field";

const BuilderFlow = dynamic(() => import("@/components/sections/builder-flow").then((m) => m.BuilderFlow), { ssr: false });

type Mode = "simple" | "advanced";

// Quanto tempo cada cena fica no ar antes de alternar (ms)
const DURATION: Record<Mode, number> = { simple: 10000, advanced: 9000 };

const modes: { id: Mode; icon: LucideIcon; title: string; text: string }[] = [
  {
    id: "simple",
    icon: Wand2,
    title: "Modo simples",
    text: "Descreva em um prompt o que sua IA precisa fazer. A FAVX monta o modelo, conecta o WhatsApp e deixa tudo pronto para atender.",
  },
  {
    id: "advanced",
    icon: Workflow,
    title: "Modo avançado",
    text: "Monte fluxos com nodes e triggers intuitivos: gatilhos, agentes de IA, condições, agenda e integrações — é só arrastar e conectar.",
  },
];

export function AiBuilder() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.35 });
  const visible = useInView(root, { amount: 0 });
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode>("simple");
  // Muda a cada troca de cena para reiniciar animações e barra de progresso
  const [cycle, setCycle] = useState(0);

  if (inView && !started) setStarted(true);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setMode((m) => (m === "simple" ? "advanced" : "simple"));
      setCycle((c) => c + 1);
    }, DURATION[mode]);
    return () => clearTimeout(t);
  }, [mode, cycle, inView]);

  function select(m: Mode) {
    setMode(m);
    setCycle((c) => c + 1);
  }

  return (
    <section id="produto" ref={root} className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-5 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-[5.5rem]">
        {/* Texto */}
        <div>
          <h2 className="text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Desenvolva sua IA de modo prático,{" "}
            <span className="text-favx-orange">sem saber programar</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Comece simples, com um prompt, ou vá mais fundo montando fluxos visuais com nodes e
            triggers. Os dois caminhos são intuitivos, fáceis de montar e estão{" "}
            <span className="font-medium text-foreground">inclusos no Plano FAVX hub</span>.
          </p>

          <ul className="mt-10 flex flex-col gap-3">
            {modes.map((m) => {
              const active = m.id === mode;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => select(m.id)}
                    aria-pressed={active}
                    className={cn(
                      "relative w-full overflow-hidden rounded-3xl border p-5 text-left transition-colors duration-500",
                      active
                        ? "border-favx-blue/30 bg-favx-blue/[0.05]"
                        : "border-black/[0.06] bg-transparent hover:bg-black/[0.02]"
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-2xl border transition-colors duration-500",
                          active
                            ? "border-favx-blue/50 bg-gradient-to-br from-favx-blue/40 to-favx-orange/40 text-white"
                            : "border-black/10 text-slate-400"
                        )}
                      >
                        <m.icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className={cn("text-xl font-medium transition-colors", !active && "text-slate-500")}>
                        {m.title}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-3 pl-[3.75rem] leading-relaxed text-muted-foreground">{m.text}</span>
                      </span>
                    </span>
                    {active && inView && (
                      <motion.span
                        key={cycle}
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-favx-blue to-favx-orange"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: DURATION[mode] / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-favx-orange/30 bg-favx-orange/10 px-4 py-2 text-sm text-favx-orange">
              <Sparkles className="size-4" />
              Tudo incluso no Plano FAVX hub
            </span>
            <a
              href="#precos"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#precos");
              }}
              className="group inline-flex items-center gap-1 text-favx-blue transition-colors hover:text-slate-900"
            >
              Ver planos
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Visual: cartão em gradiente com a "tela" do FAVX Hub */}
        <div className="relative h-[620px] w-full overflow-hidden rounded-[2.5rem] bg-black sm:aspect-square sm:h-auto">
          <SparkleField gradient={SPARKLE_ORANGE} active={visible} />
          <Halftone />
          <div className="theme-light liquid-glass absolute inset-x-[5%] bottom-[7%] top-[7%] flex flex-col overflow-hidden rounded-[1.75rem]">
            <ScreenBar mode={mode} onSelect={select} />
            <div className="relative flex-1 bg-[radial-gradient(rgba(47,107,255,0.14)_1px,transparent_1.2px)] bg-[size:18px_18px]">
              {started && visible && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${mode}-${cycle}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {mode === "simple" ? <SimpleScene /> : <BuilderFlow />}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pontos em meio-tom que ondulam no rodapé do cartão (referência do layout). */
function Halftone() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(rgba(190,225,255,0.55)_1px,transparent_1.7px)] bg-[size:9px_9px] [mask-image:radial-gradient(ellipse_90%_45%_at_50%_100%,black_20%,transparent_75%)]"
        animate={{ backgroundPosition: ["0px 0px", "0px -18px"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(124,199,255,0.7),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -left-20 -top-20 size-80 rounded-full bg-favx-orange-light/30 blur-[100px]"
      />
    </>
  );
}

function ScreenBar({ mode, onSelect }: { mode: Mode; onSelect: (m: Mode) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-3 sm:px-5">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-slate-900/10" />
        <span className="size-2.5 rounded-full bg-slate-900/10" />
        <span className="size-2.5 rounded-full bg-slate-900/10" />
        <span className="ml-3 hidden text-xs text-slate-500 sm:inline">FAVX Hub</span>
      </div>
      <div className="liquid-glass-soft flex rounded-full p-1 text-xs">
        {(["simple", "advanced"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSelect(m)}
            className={cn(
              "relative rounded-full px-3 py-1.5 transition-colors",
              mode === m ? "text-white" : "text-slate-500 hover:text-slate-800"
            )}
          >
            {mode === m && (
              <motion.span
                layoutId="builder-tab"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-favx-blue to-favx-orange"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{m === "simple" ? "Simples" : "Avançado"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Simples */

const PROMPT =
  "Crie uma atendente para meu bar de eventos que responda orçamentos no WhatsApp, monte o briefing da festa e agende visitas.";

const buildSteps = ["Configurando o agente", "Conectando o WhatsApp", "Treinando com seus dados"];

type SimplePhase = "typing" | "building" | "done";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function SimpleScene() {
  const [chars, setChars] = useState(() => (prefersReducedMotion() ? PROMPT.length : 0));
  const [phase, setPhase] = useState<SimplePhase>("typing");
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let typing: ReturnType<typeof setInterval> | undefined;

    const startBuild = (delay: number) => {
      timers.push(setTimeout(() => setPhase("building"), delay));
      buildSteps.forEach((_, i) => timers.push(setTimeout(() => setStep(i + 1), delay + 650 * (i + 1))));
      timers.push(setTimeout(() => setPhase("done"), delay + 650 * (buildSteps.length + 1)));
    };

    if (prefersReducedMotion()) {
      startBuild(300);
    } else {
      typing = setInterval(() => {
        setChars((c) => {
          if (c >= PROMPT.length) {
            clearInterval(typing);
            return c;
          }
          return c + 1;
        });
      }, 26);
      startBuild(PROMPT.length * 26 + 700);
    }

    return () => {
      clearInterval(typing);
      timers.forEach(clearTimeout);
    };
  }, []);

  const typingDone = chars >= PROMPT.length;

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4 sm:p-8">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Wand2 className="size-4 text-favx-orange" />
        Descreva sua IA
      </div>

      <div className="liquid-glass-soft rounded-2xl p-4 sm:p-5">
        <p className="min-h-[7rem] text-[15px] leading-relaxed text-slate-800 sm:min-h-[4.5rem] sm:text-base">
          {PROMPT.slice(0, chars)}
          {!typingDone && (
            <motion.span
              className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-favx-orange"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          )}
        </p>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {["WhatsApp", "Tom amigável", "Agenda"].map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={typingDone ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[11px] text-slate-600"
              >
                {c}
              </motion.span>
            ))}
          </div>
          <motion.span
            animate={phase === "building" ? { scale: [1, 0.92, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-500",
              typingDone
                ? "bg-gradient-to-r from-favx-blue to-favx-orange text-white shadow-[0_0_24px_-4px_rgba(255,60,0,0.9)]"
                : "bg-slate-900/[0.06] text-slate-400"
            )}
          >
            <Sparkles className="size-3.5" />
            Criar IA
          </motion.span>
        </div>
      </div>

      <div className="min-h-[9.5rem]">
        <AnimatePresence mode="wait">
          {phase === "building" && (
            <motion.ul
              key="building"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2.5"
            >
              {buildSteps.map((s, i) => {
                const done = step > i;
                const current = step === i;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full border transition-colors",
                        done ? "border-favx-blue bg-favx-blue/15" : "border-slate-300"
                      )}
                    >
                      {done ? (
                        <Check className="size-3 text-favx-blue" strokeWidth={3} />
                      ) : current ? (
                        <motion.span
                          className="size-2 rounded-full bg-favx-orange"
                          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      ) : null}
                    </span>
                    <span className={done || current ? "text-slate-700" : "text-slate-400"}>{s}</span>
                  </li>
                );
              })}
            </motion.ul>
          )}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="flex items-center gap-4 rounded-2xl border border-white/80 bg-gradient-to-r from-favx-blue/15 to-favx-orange/20 p-4 shadow-[0_16px_40px_-24px_rgba(47,107,255,0.9)]"
            >
              <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-favx-blue to-favx-orange">
                <Bot className="size-6 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-white bg-favx-blue">
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
              </span>
              <div>
                <p className="font-medium">Sua IA está pronta</p>
                <p className="text-sm text-slate-500">Atendente de eventos · online no WhatsApp</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
