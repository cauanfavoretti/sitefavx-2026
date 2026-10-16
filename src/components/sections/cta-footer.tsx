"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FavxMark } from "@/components/favx-logo";
import { navLinks } from "@/components/navbar";
import { scrollToTarget } from "@/components/smooth-scroll";
import { openQualify } from "@/components/qualify";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CtaFooter() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-glow", {
        scale: 0.6,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
      });
      gsap.from(".footer-word", {
        yPercent: 60,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".footer-word", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative overflow-hidden">
      <section id="contato" className="relative px-5 py-24 md:px-12 md:py-32 lg:px-[5.5rem]">
        <div className="theme-dark relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-[2.5rem] bg-[#060a24] px-6 py-24 text-center md:py-32">
          <div
            aria-hidden
            className="cta-glow absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(47,107,255,0.55),rgba(255,60,0,0.3)_45%,transparent_75%)]"
          />
          <h2 className="mx-auto max-w-4xl text-[clamp(2.6rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em]">
            Pronto para crescer com o <span className="text-favx-orange">futuro</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-foreground/70">
            Agende uma demonstração gratuita e veja a tecnologia FAVX aplicada ao seu negócio.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={openQualify}>
              Quero saber mais
            </Button>
            <Button size="lg" variant="outline" onClick={openQualify}>
              Falar no WhatsApp
              <ArrowUpRight />
            </Button>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-8 md:px-12 lg:px-[5.5rem]">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col justify-between gap-10 border-t border-black/10 pt-12 md:flex-row">
            <div className="flex items-center gap-3">
              <FavxMark className="h-6 w-auto" />
              <span className="text-lg font-medium">FAVX</span>
            </div>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(l.href);
                    }}
                    className="text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p
            aria-hidden
            className="footer-word pointer-events-none mt-16 select-none text-favx-blue/25 text-center text-[26vw] font-semibold leading-[0.8] tracking-[-0.06em]"
          >
            FAVX
          </p>
          <div className="relative z-10 mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-6">
            <p>© {new Date().getFullYear()} FAVX. Todos os direitos reservados.</p>
            <span aria-hidden className="hidden size-1 rounded-full bg-slate-300 sm:block" />
            <Link href="/privacidade" className="transition-colors hover:text-slate-900">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="transition-colors hover:text-slate-900">
              Termos de Uso
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
