"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import { NexusChat } from "@/components/sections/nexus-ai";
import { Button } from "@/components/ui/button";
import { scrollToTarget } from "@/components/smooth-scroll";
import { openQualify } from "@/components/qualify";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Aurora interativa somente no cliente
const HeroAurora = dynamic(() => import("@/components/hero-aurora"), { ssr: false });

const headline = [["Venda", "mais"], ["com", "tecnologia"], ["de", "IA", "da", "FAVX"]];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-aurora", { opacity: 0, duration: 2.4, ease: "power2.out" }, 0)
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
      {/* Fundo: aurora azul e laranja com transições de forma */}
      <div className="hero-aurora pointer-events-none absolute inset-0 -z-10">
        <div
          aria-hidden
          className="hero-color-glow absolute inset-0"
        />
        <HeroAurora />
      </div>
      {/* Escurece o lado esquerdo para leitura do título */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_25%_45%,rgba(3,3,8,0.45),transparent_65%),linear-gradient(90deg,rgba(3,3,8,0.25)_0%,transparent_70%),linear-gradient(0deg,rgba(3,3,8,0.7)_0%,transparent_20%)]"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pb-8 pt-[calc(9rem+var(--promo-banner-height))] md:px-12 md:pt-[calc(11rem+var(--promo-banner-height))] lg:px-[5.5rem]">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-10 xl:gap-16">
          <div className="hero-copy flex min-w-0 flex-col items-center justify-center text-center md:items-start md:text-left">
            <h1 className="text-[clamp(3.1rem,5.8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em]">
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
              Construímos tecnologia de IA para seu negócio vender mais
            </p>

            <div className="hero-cta mt-10 grid w-full grid-cols-2 items-center gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-4">
              <Button size="lg" className="h-12 min-w-0 px-2 text-[10px] min-[375px]:text-[11px] sm:h-14 sm:px-9 sm:text-[15px]" onClick={openQualify}>
                Quero saber mais
              </Button>
              <Button size="lg" variant="outline" className="h-12 min-w-0 gap-1 px-2 text-[10px] min-[375px]:text-[11px] [&_svg]:size-3 sm:h-14 sm:gap-2 sm:px-9 sm:text-[15px] sm:[&_svg]:size-4" onClick={() => scrollToTarget("#produto")}>
                Conheça a FAVX
                <ArrowUpRight />
              </Button>
            </div>
          </div>

          <NexusChat />
        </div>

        <div className="hero-bottom mt-12">
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
