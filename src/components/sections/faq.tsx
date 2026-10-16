import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "O que é a FAVX?",
    a: "A FAVX é uma plataforma de tecnologia com inteligência artificial que ajuda empresas a controlar a operação, construir soluções sob medida e vender mais.",
  },
  {
    q: "Preciso de uma equipe técnica para usar?",
    a: "Não. A plataforma foi pensada para gestores e equipes de negócio, com automações visuais e assistentes de IA prontos para usar. Para projetos avançados, nosso time apoia a implantação.",
  },
  {
    q: "A FAVX se integra com os sistemas que já uso?",
    a: "Sim. Oferecemos integrações com ERPs, CRMs, plataformas de e-commerce e meios de pagamento, além de uma API aberta para conexões personalizadas.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Seus dados são criptografados, com controle de acesso por usuário e processos alinhados à LGPD.",
  },
  {
    q: "Como funciona a demonstração gratuita?",
    a: "Você agenda uma conversa com nosso time, apresentamos a plataforma aplicada ao seu negócio e montamos juntos um plano de implantação.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:px-[5.5rem]">
        <div>
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.04em]">
            Perguntas frequentes
          </h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-black/10">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
