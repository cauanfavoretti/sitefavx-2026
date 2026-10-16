"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// Prazo único da campanha: cinco dias a partir de 16/10/2026.
const CAMPAIGN_END = Date.parse("2026-10-21T20:04:57Z");
const subscribe = (update: () => void) => {
  const timer = window.setInterval(update, 1000);
  return () => window.clearInterval(timer);
};
const getRemaining = () => Math.max(0, Math.ceil((CAMPAIGN_END - Date.now()) / 1000));
const getServerRemaining = () => null;

export function useCampaignCountdown() {
  return useSyncExternalStore(subscribe, getRemaining, getServerRemaining);
}

export function CampaignCountdown({ remaining, red = false }: { remaining: number | null; red?: boolean }) {
  const units = remaining === null ? null : [
    Math.floor(remaining / 86400),
    Math.floor((remaining % 86400) / 3600),
    Math.floor((remaining % 3600) / 60),
    remaining % 60,
  ];
  return (
    <span role="timer" aria-label="Tempo restante da oferta" className={cn("flex items-center gap-1 font-mono text-xs tabular-nums md:text-sm", red && "gap-2 text-red-400") }>
      {["d", "h", "m", "s"].map((label, index) => (
        <span key={label} className={cn("rounded bg-black/20 px-1.5 py-1", red && "rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xl font-semibold md:text-2xl")}>
          {units ? String(units[index]).padStart(2, "0") : "--"}<span className={cn("ml-0.5 text-[10px] text-white/70", red && "text-red-300/80")}>{label}</span>
        </span>
      ))}
    </span>
  );
}

export function PricingCountdown() {
  const remaining = useCampaignCountdown();
  if (remaining === 0) return null;
  return (
    <div className="mb-6 space-y-2">
      <p className="text-xs font-medium text-red-400">A oferta termina em</p>
      <CampaignCountdown remaining={remaining} red />
    </div>
  );
}
