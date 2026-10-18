"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { scrollToTarget } from "@/components/smooth-scroll";
import { openQualify } from "@/components/qualify";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL só no cliente
const HeroBeams = dynamic(() => import("@/components/hero-beams"), { ssr: false });

const headline = [["Venda", "mais"], ["com", "tecnologia"], ["de", "IA", "da", "FAVX"]];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-beams", { opacity: 0, duration: 2.4, ease: "power2.out" }, 0)
        .from(".hero-word", { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.09 }, 0.35)
        .from(".hero-sub", { y: 24, opacity: 0, filter: "blur(8px)", duration: 1.1 }, 0.9)
        .from(".hero-cta > *", { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 1.05)
        .from(".hero-bottom > *", { y: 30, opacity: 0, duration: 1.1, stagger: 0.1 }, 1.2);

      // O fundo permanece ancorado à hero durante o scroll.
      const out = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-copy", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: out });
    },
    { scope: root }
  );

  return (
    <section
      id="topo"
      ref={root}
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-favx-ink"
    >
      {/* Fundo: feixes WebGL + fallback em CSS */}
      <div className="hero-beams absolute inset-0 -z-10 origin-top-right">
        <div
          aria-hidden
          className="hero-color-glow absolute inset-0"
        />
        <HeroBeams />
      </div>
      {/* Escurece o lado esquerdo para leitura do título */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,3,8,0.85)_0%,rgba(3,3,8,0.35)_45%,transparent_70%),linear-gradient(0deg,rgba(3,3,8,1)_0%,transparent_35%)]"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pb-8 pt-[calc(9rem+var(--promo-banner-height))] md:px-12 md:pt-[calc(11rem+var(--promo-banner-height))] lg:px-[5.5rem]">
        <div className="hero-copy flex flex-1 flex-col justify-center">
          <h1 className="text-[clamp(2.7rem,6.6vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em]">
            {headline.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em]">
                {line.map((word, wi) => (
                  <span key={word} className="inline-block">
                    <span className={`hero-word inline-block ${word === "FAVX" ? "hero-color-word" : ""}`}>
                      {word}
                    </span>
                    {wi < line.length - 1 && " "}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-7 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            Controle, construa e venda mais com a tecnologia{" "}
            <span className="font-medium text-white">FAVX</span>.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={openQualify}>
              Quero saber mais
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToTarget("#produto")}>
              Conheça a FAVX
              <ArrowUpRight />
            </Button>
          </div>
        </div>

        <div className="hero-bottom mt-16">
          <div>
            <p className="flex items-center gap-4 text-2xl font-medium">
              Controle
              <span className="size-1.5 rounded-full bg-favx-blue-light" />
              Tecnologia
            </p>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              Soluções com IA sob medida para o seu negócio — rápidas, eficientes e prontas para o
              futuro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
