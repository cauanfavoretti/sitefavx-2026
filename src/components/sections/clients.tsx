"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Client = {
  name: string;
  full: string;
  /** Sem logo, a marca entra como texto. */
  logo?: string;
  logoWidth?: number;
  /** Cada marca tem proporção própria, então a altura é ajustada uma a uma. */
  logoClass?: string;
};

const clients: Client[] = [
  { name: "DSX", full: "DSX — Digital Summit Experience", logo: "/clients/logos/logo-dsx.png", logoWidth: 82, logoClass: "h-9 md:h-12" },
  { name: "Arts Drinks", full: "Arts Drinks", logo: "/clients/logos/logo-arts-drinks.png", logoWidth: 58, logoClass: "h-14 md:h-[4.5rem]" },
  { name: "EASY", full: "EASY", logo: "/clients/logos/logo-easy.png", logoWidth: 95, logoClass: "h-11 md:h-14" },
];


export function Clients() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // O arco escuro gira e cresce conforme a seção atravessa a tela
      gsap.fromTo(
        ".clients-arc",
        { rotate: -18, scale: 0.9, xPercent: -6 },
        {
          rotate: 12,
          scale: 1.08,
          xPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      gsap.to(".clients-orb", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      const intro = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: ".clients-head", start: "top 80%" },
      });
      intro
        .from(".clients-line", { yPercent: 110, duration: 1.3, stagger: 0.1 })
        .from(".clients-sub", { y: 24, opacity: 0, filter: "blur(8px)", duration: 1.1 }, 0.3);

      gsap.from(".clients-carousel", {
        y: 70,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".clients-carousel", start: "top 90%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="clientes" ref={root} className="relative isolate overflow-hidden py-32 md:py-44">
      {/* Fundo inspirado na referência: campo de cor suave + grande arco escuro */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_0%_100%,rgba(255,60,0,0.45),transparent_70%),radial-gradient(55%_55%_at_100%_0%,rgba(47,107,255,0.4),transparent_70%),linear-gradient(180deg,#0a0a1c,#0c0a22)]" />
        <div className="clients-arc absolute left-[18%] top-[-35%] aspect-square w-[150vw] max-w-none rounded-full bg-[radial-gradient(closest-side,#05050d_78%,#0b0b22_92%,transparent_100%)] shadow-[0_0_160px_40px_rgba(79,90,255,0.18)] md:w-[120vw]" />
        <div className="clients-orb absolute right-[8%] top-[20%] size-[380px] rounded-full bg-favx-blue/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[5%] size-[420px] rounded-full bg-favx-orange/30 blur-[140px]" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="mx-auto max-w-[1600px] px-5 md:px-12 lg:px-[5.5rem]">
        <div className="clients-head mx-auto max-w-6xl text-center">
          <h2 className="text-[clamp(2.2rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="clients-line block">Empresas que constroem o agora</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="clients-line block">
                e crescem com a <span className="text-favx-blue">FAVX</span>
              </span>
            </span>
          </h2>
          <p className="clients-sub mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            Empresas que usam a FAVX para vender mais, organizar leads e escalar a operação comercial
            — com inteligência artificial trabalhando 24 horas por dia.
          </p>
        </div>

      </div>

      {/* Barra carrossel com as logos dos clientes */}
      <div className="clients-carousel group/bar relative mt-16 overflow-hidden border-y border-white/10 py-10 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16 group-hover/bar:[animation-play-state:paused] md:gap-24">
          {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
            <div key={`${c.name}-${i}`} className="flex shrink-0 items-center gap-16 md:gap-24" aria-hidden={i >= clients.length}>
              {c.logo ? (
                <Image
                  src={c.logo}
                  alt={c.full}
                  width={c.logoWidth}
                  height={40}
                  // preto e branco: as marcas viram silhuetas claras e uniformes
                  className={cn(
                    "w-auto opacity-60 brightness-0 grayscale invert transition-opacity duration-500 hover:opacity-100",
                    c.logoClass
                  )}
                />
              ) : (
                <span className="whitespace-nowrap text-2xl font-semibold tracking-[-0.02em] text-white/70 transition-colors duration-500 hover:text-white md:text-3xl">
                  {c.full}
                </span>
              )}
              <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-r from-favx-blue to-favx-orange" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
