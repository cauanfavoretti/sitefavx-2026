import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FavxMark } from "@/components/favx-logo";
import { cn } from "@/lib/utils";

/** Dados da empresa, iguais nos dois documentos */
export const company = {
  legalName: "68.654.577 CAUAN RIBEIRO FAVORETTI",
  cnpj: "68.654.577/0001-50",
  address: "R. dos Rubis, 4 — Nossa Senhora das Graças, Manaus/AM — CEP 69.053-750",
  phone: "(92) 9437-6254",
  site: "favxtecnologia.com",
  updatedAt: "9 de setembro de 2026",
};

/* Tipografia do documento: o conteúdo é escrito em HTML simples e estilizado aqui */
const prose = cn(
  "[&>h2]:mt-14 [&>h2]:scroll-mt-28 [&>h2]:text-[1.4rem] [&>h2]:font-medium [&>h2]:tracking-tight [&>h2]:text-foreground",
  "[&>p]:mt-4 [&>p]:leading-relaxed [&>p]:text-slate-600",
  "[&>h2+p]:mt-4",
  "[&>ul]:mt-5 [&>ul]:space-y-2.5",
  "[&_li]:relative [&_li]:pl-6 [&_li]:leading-relaxed [&_li]:text-slate-600",
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.62em] [&_li]:before:size-1.5",
  "[&_li]:before:rounded-full [&_li]:before:bg-gradient-to-r [&_li]:before:from-favx-blue [&_li]:before:to-favx-orange [&_li]:before:content-['']",
  "[&_strong]:font-medium [&_strong]:text-foreground",
  "[&_a]:text-favx-blue [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-favx-orange"
);

export function LegalPage({
  title,
  lead,
  other,
  children,
}: {
  title: string;
  lead: React.ReactNode;
  /** Link para o documento irmão */
  other: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Topo escuro, no mesmo tom da hero */}
      <header className="grain relative isolate overflow-hidden bg-favx-ink px-5 pb-20 pt-10 md:px-12 md:pb-24 lg:px-[5.5rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_75%_0%,rgba(47,107,255,0.35),transparent_70%),radial-gradient(45%_60%_at_20%_10%,rgba(255,60,0,0.28),transparent_70%)]"
        />
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm text-white/85 backdrop-blur-xl transition-colors hover:border-favx-blue/60 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Voltar ao site
            </Link>
            <Link href="/" aria-label="FAVX — início" className="flex items-center gap-2">
              <FavxMark className="h-5 w-auto" />
              <span className="font-medium text-white">FAVX</span>
            </Link>
          </div>

          <h1 className="mt-14 text-[clamp(2.4rem,7vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
            {title}
          </h1>
          <p className="mt-5 text-sm uppercase tracking-wide text-white/45">
            Última atualização: {company.updatedAt}
          </p>
        </div>
      </header>

      {/* Folha clara subindo sobre o topo, como na home */}
      <main className="theme-light relative z-10 -mt-10 rounded-t-[2.5rem] px-5 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20 lg:px-[5.5rem]">
        <article className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-slate-600">{lead}</p>
          <div className={prose}>{children}</div>

          {/* Rodapé do documento */}
          <div className="mt-16 flex flex-col gap-4 border-t border-black/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {company.legalName}.</p>
            <Link
              href={other.href}
              className="text-favx-blue transition-colors hover:text-favx-orange"
            >
              {other.label}
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

/** Bloco destacado com os dados de contato */
export function ContactCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-favx-blue/15 bg-gradient-to-br from-favx-blue/[0.07] to-favx-orange/[0.07] p-6 leading-relaxed text-slate-600 [&_strong]:font-medium [&_strong]:text-foreground">
      {children}
    </div>
  );
}
