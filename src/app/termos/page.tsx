import type { Metadata } from "next";
import Link from "next/link";

import { ContactCard, LegalPage, company } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Termos de Uso — FAVX",
  description: "Condições que regem o uso do site da FAVX.",
};

export default function Termos() {
  return (
    <LegalPage
      title="Termos de Uso"
      other={{ href: "/privacidade", label: "Política de Privacidade →" }}
      lead={
        <>
          Estes termos regem o uso do site {company.site}, mantido por{" "}
          <strong className="font-medium text-foreground">{company.legalName}</strong>, CNPJ {company.cnpj},
          com sede em {company.address}. Ao navegar pelo site, você concorda com as condições abaixo.
        </>
      }
    >
      <h2>1. O que a FAVX faz</h2>
      <p>
        A FAVX fornece soluções de Inteligência Artificial, CRM e automação comercial para empresas, incluindo
        atendimento automatizado em canais de mensagem, qualificação de leads e apoio à operação de vendas.
      </p>
      <p>
        Este site é um canal institucional e comercial: apresenta os serviços e permite solicitar contato. A
        contratação em si é formalizada em documento próprio entre as partes.
      </p>

      <h2>2. Uso do site</h2>
      <p>Você concorda em usar o site de forma lícita e a não:</p>
      <ul>
        <li>tentar obter acesso não autorizado a qualquer parte do site ou a sistemas relacionados;</li>
        <li>interferir no funcionamento normal do site;</li>
        <li>copiar, reproduzir ou redistribuir o conteúdo para fins comerciais sem autorização escrita;</li>
        <li>fornecer dados falsos ou de terceiros sem autorização no formulário de contato.</li>
      </ul>

      <h2>3. Período de teste</h2>
      <p>
        A oferta de teste divulgada no site está sujeita a análise de perfil e à disponibilidade, e suas
        condições específicas — prazo, escopo e recursos incluídos — são confirmadas no atendimento antes do
        início. O preenchimento do formulário é uma <strong>solicitação</strong>, não uma contratação
        automática.
      </p>

      <h2>4. Planos e valores</h2>
      <p>
        Os valores apresentados no site são referenciais e podem variar conforme o escopo da implantação, o
        volume de atendimento e as integrações necessárias. A proposta comercial válida é a enviada formalmente
        pela FAVX.
      </p>

      <h2>5. Propriedade intelectual</h2>
      <p>
        A marca FAVX, o logotipo, os textos, o design, o código e os demais materiais deste site pertencem a{" "}
        {company.legalName} ou foram licenciados para seu uso. Nada nestes termos transfere qualquer direito
        sobre eles.
      </p>
      <p>Nomes e marcas de terceiros eventualmente citados pertencem aos seus respectivos titulares.</p>

      <h2>6. Depoimentos e resultados</h2>
      <p>
        Casos e depoimentos apresentados no site refletem a experiência de clientes específicos, em seus
        próprios contextos de mercado, equipe e operação. Não constituem promessa ou garantia de resultado para
        outros contratantes.
      </p>

      <h2>7. Disponibilidade e limitação de responsabilidade</h2>
      <p>
        Empregamos esforços para manter o site disponível e as informações corretas, mas ele é oferecido
        &ldquo;no estado em que se encontra&rdquo;. Podemos alterar, suspender ou descontinuar qualquer parte
        do site a qualquer momento.
      </p>
      <p>
        Na máxima extensão permitida pela legislação brasileira, a FAVX não responde por danos indiretos ou
        lucros cessantes decorrentes do uso do site. Nada aqui afasta os direitos assegurados ao consumidor
        pelo Código de Defesa do Consumidor.
      </p>

      <h2>8. Links externos</h2>
      <p>
        O site contém links para plataformas de terceiros, como WhatsApp e Instagram. Não controlamos esses
        serviços e não respondemos por seus conteúdos ou políticas.
      </p>

      <h2>9. Privacidade</h2>
      <p>
        O tratamento de dados pessoais está descrito na nossa <Link href="/privacidade">Política de
        Privacidade</Link>, que integra estes termos.
      </p>

      <h2>10. Alterações</h2>
      <p>
        Podemos revisar estes termos a qualquer momento. A versão vigente é sempre a publicada nesta página,
        com a data de atualização indicada no topo.
      </p>

      <h2>11. Lei aplicável e foro</h2>
      <p>
        Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Manaus/AM para
        dirimir controvérsias, ressalvado o direito do consumidor de acionar o foro de seu domicílio.
      </p>

      <h2>12. Contato</h2>
      <ContactCard>
        <p>
          <strong>{company.legalName}</strong>
        </p>
        <p className="mt-2">CNPJ {company.cnpj}</p>
        <p className="mt-2">{company.address}</p>
        <p className="mt-2">
          Telefone / WhatsApp: <strong>{company.phone}</strong>
        </p>
      </ContactCard>
    </LegalPage>
  );
}
