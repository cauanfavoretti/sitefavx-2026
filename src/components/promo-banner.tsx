"use client";

import { CampaignCountdown, useCampaignCountdown } from "@/components/campaign-countdown";
import { ArrowUpRight } from "lucide-react";
import { openQualify } from "@/components/qualify";

export function PromoBanner() {
  const remaining = useCampaignCountdown();
  if (remaining === 0) return null;

  return (
    <aside aria-label="Oferta por tempo limitado" className="promo-banner fixed inset-x-0 top-0 z-[60] flex h-20 items-center justify-center border-b border-white/15 bg-favx-blue px-3 text-white md:h-12">
      <button type="button" onClick={openQualify} className="flex w-full max-w-[1600px] flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-lg py-2 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:gap-x-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] md:text-xs">Tempo limitado</span>
        <CampaignCountdown remaining={remaining} />
        <span className="flex w-full items-center justify-center gap-1.5 text-xs font-medium sm:text-sm md:w-auto">
          Teste o plano FAVX Hub por <strong className="font-semibold">7 dias grátis</strong>
          <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </span>
      </button>
    </aside>
  );
}
