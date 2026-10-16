"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { openQualify } from "@/components/qualify";

// Prazo único da campanha: cinco dias a partir de 16/10/2026.
const CAMPAIGN_END = Date.parse("2026-10-21T20:04:57Z");
const subscribe = (update: () => void) => {
  const timer = window.setInterval(update, 1000);
  return () => window.clearInterval(timer);
};
const getRemaining = () => Math.max(0, Math.ceil((CAMPAIGN_END - Date.now()) / 1000));
const getServerRemaining = () => null;

export function PromoBanner() {
  const remaining = useSyncExternalStore(subscribe, getRemaining, getServerRemaining);
  if (remaining === 0) return null;

  const units = remaining === null ? null : [
    Math.floor(remaining / 86400),
    Math.floor((remaining % 86400) / 3600),
    Math.floor((remaining % 3600) / 60),
    remaining % 60,
  ];

  return (
    <aside aria-label="Oferta por tempo limitado" className="promo-banner fixed inset-x-0 top-0 z-[60] flex h-20 items-center justify-center border-b border-white/15 bg-favx-blue px-3 text-white md:h-12">
      <button type="button" onClick={openQualify} className="flex w-full max-w-[1600px] flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-lg py-2 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:gap-x-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] md:text-xs">Tempo limitado</span>
        <span role="timer" aria-label="Tempo restante da oferta" className="flex items-center gap-1 font-mono text-xs tabular-nums md:text-sm">
          {["d", "h", "m", "s"].map((label, index) => (
            <span key={label} className="rounded bg-black/20 px-1.5 py-1">
              {units ? String(units[index]).padStart(2, "0") : "--"}<span className="ml-0.5 text-[10px] text-white/70">{label}</span>
            </span>
          ))}
        </span>
        <span className="flex w-full items-center justify-center gap-1.5 text-xs font-medium sm:text-sm md:w-auto">
          Teste o plano FAVX Hub por <strong className="font-semibold">7 dias grátis</strong>
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </span>
      </button>
    </aside>
  );
}
