"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";

import { FavxMark } from "@/components/favx-logo";
import { scrollToTarget } from "@/components/smooth-scroll";
import { openQualify } from "@/components/qualify";
import { cn } from "@/lib/utils";

export const navLinks = [
  { label: "Clientes", href: "#clientes" },
  { label: "Produto", href: "#produto" },
  { label: "Recursos", href: "#recursos" },
  { label: "Preços", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  scrollToTarget(href);
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hasHidden, setHasHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    // Some ao rolar para baixo e volta ao rolar para cima
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 120) {
      setHidden(true);
      setHasHidden(true);
    }
    else if (y < prev) setHidden(false);
  });

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={hidden && !open ? "hidden" : "visible"}
      variants={{
        // Atraso só na entrada da página; ao voltar do scroll, reaparece na hora
        visible: (returning: boolean) => ({
          y: 0,
          opacity: 1,
          transition: { duration: returning ? 0.5 : 0.9, delay: returning ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] },
        }),
        hidden: { y: "-110%", opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      }}
      custom={hasHidden}
      className="fixed inset-x-0 top-[var(--promo-banner-height)] z-50 px-4 pt-4 md:px-8 md:pt-5 lg:px-12"
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <a
            href="#topo"
            onClick={(e) => go(e, "#topo")}
            aria-label="FAVX — início"
            className={cn(
              "grid size-14 place-items-center rounded-full border border-white/5 bg-white/[0.06] backdrop-blur-xl transition-colors",
              scrolled && "border-white/10 bg-[#05061a]/90"
            )}
          >
            <FavxMark className="h-5 w-auto" />
          </a>

          <ul
            className={cn(
              "hidden h-14 items-center rounded-full border border-white/5 bg-white/[0.06] px-8 backdrop-blur-xl transition-colors md:flex",
              scrolled && "border-white/10 bg-[#05061a]/90"
            )}
          >
            {navLinks.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && <li aria-hidden className="mx-5 size-1.5 rounded-full bg-white/25 lg:mx-7" />}
                <li>
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className="text-[15px] text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={openQualify}
          className={cn(
            "hidden h-14 items-center rounded-full border border-white/5 bg-white/[0.06] px-8 text-sm uppercase tracking-wide text-white/90 backdrop-blur-xl transition-all hover:border-favx-blue/60 hover:text-white md:flex",
            scrolled && "border-white/10 bg-[#05061a]/90"
          )}
        >
          Fale conosco
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className={cn(
            "grid size-14 place-items-center rounded-full border border-white/5 bg-white/[0.06] text-white backdrop-blur-xl transition-colors md:hidden",
            (scrolled || open) && "border-white/10 bg-[#05061a]/90"
          )}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="glass mt-3 flex flex-col gap-1 rounded-3xl bg-black/70 p-3 md:hidden"
          >
            {[...navLinks, { label: "Fale conosco", href: "#contato" }].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    go(e, link.href);
                    setOpen(false);
                  }}
                  className="block rounded-2xl px-4 py-3 text-lg text-white/90 hover:bg-white/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
