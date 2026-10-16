import { Navbar } from "@/components/navbar";
import { QualifyDialog } from "@/components/qualify";
import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { NexusAi } from "@/components/sections/nexus-ai";
import { AiBuilder } from "@/components/sections/ai-builder";
import { Features } from "@/components/sections/features";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { CtaFooter } from "@/components/sections/cta-footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Clients />
        {/* Daqui para baixo a página é clara, como uma folha que sobe sobre a parte escura */}
        <div className="theme-light relative z-10 -mt-10 rounded-t-[2.5rem]">
          <NexusAi />
          <AiBuilder />
          <Features />
          <Pricing />
          <Faq />
        </div>
      </main>
      <div className="theme-light">
        <CtaFooter />
      </div>
      <QualifyDialog />
    </>
  );
}
