"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { openQualify } from "@/components/qualify";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  desc: string;
  features: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Plano FAVX hub",
    desc: "A operação inteira dentro do FAVX Hub, com o Nexus AI vendendo por você e uso sem limites.",
    features: [
      "FAVX Hub",
      "Workflows personalizáveis (construção de IA)",
      "Nexus AI (IA nativa da FAVX)",
      "Funis de vendas",
      "Dashboards",
      "WhatsApp integrado",
      "Uso ilimitado de tokens",
      "Acesso antecipado a atualizações",
    ],
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-12 lg:px-[5.5rem]">
        <div className="mb-16 text-center">
          <h2 className="mx-auto max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.04em]">
            Planos que crescem com você
          </h2>
        </div>

        <div className="mx-auto grid max-w-xl gap-5">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[2rem] p-8 md:p-10",
                plan.featured
                  ? "theme-dark border border-favx-blue/50 bg-[#07081a] bg-[radial-gradient(120%_80%_at_50%_0%,rgba(47,107,255,0.35),rgba(255,60,0,0.18)_40%,#07081a_75%)] shadow-[0_0_80px_-30px_rgba(79,123,255,0.8)]"
                  : "border border-black/[0.08] bg-white shadow-[0_24px_60px_-34px_rgba(10,11,26,0.35)]"
              )}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-black">
                  Mais completo
                </span>
              )}
              <h3 className="text-xl font-medium">{plan.name}</h3>
              <p className="mt-2 max-w-xs text-muted-foreground">{plan.desc}</p>

              <div className="mt-10">
                <p className="text-4xl font-medium tracking-tight md:text-5xl">
                  Teste 7 dias grátis
                </p>
              </div>

              <ul className="mt-10 flex-1 space-y-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-foreground/85">
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                        plan.featured ? "bg-favx-blue/25" : "bg-favx-blue/10"
                      )}
                    >
                      <Check
                        className={cn("size-3", plan.featured ? "text-favx-cyan" : "text-favx-blue")}
                        strokeWidth={3}
                      />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 w-full"
                variant={plan.featured ? "default" : "outlineDark"}
                size="lg"
                onClick={openQualify}
              >
                Quero o {plan.name}
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
