import type { Metadata } from "next";

import { ContactCard, LegalPage, company } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Política de Privacidade — FAVX",
  description:
    "Como a FAVX trata os dados pessoais coletados no site, em conformidade com a LGPD (Lei nº 13.709/2018).",
};

export default function Privacidade() {
  return (
    <LegalPage
      title="Política de Privacidade"
      other={{ href: "/termos", label: "Termos de Uso →" }}
      lead={
        <>
          Esta política explica como <strong className="font-medium text-foreground">{company.legalName}</strong>,
          inscrita no CNPJ sob o nº {company.cnpj} (&ldquo;FAVX&rdquo;, &ldquo;nós&rdquo;), trata os dados pessoais
          coletados no site {company.site}, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de
          Dados — LGPD).
        </>
      }
    >
      <h2>1. Quais dados coletamos</h2>
      <p>
        Coletamos apenas os dados que você informa voluntariamente no formulário de qualificação do site:
      </p>
      <ul>
        <li>Nome</li>
        <li>As respostas que você seleciona ao longo do diagnóstico</li>
        <li>O número de WhatsApp a partir do qual você nos envia a mensagem</li>
      </ul>
      <p>
        Este site <strong>não utiliza cookies</strong>, não instala pixels de rastreamento, não executa
        ferramentas de analytics e não cria perfis de navegação. Nenhum dado é gravado no seu navegador.
      </p>

      <h2>2. Como esses dados são enviados</h2>
      <p>
        O formulário <strong>não envia os dados para um servidor nosso</strong>. Ao concluir o diagnóstico, o
        site monta uma mensagem com o que você preencheu e abre uma conversa no WhatsApp com esse texto já
        digitado. Você continua no controle: a mensagem só é enviada se você tocar em enviar dentro do
        WhatsApp.
      </p>
      <p>
        Na prática, seus dados chegam até nós como uma mensagem comum de WhatsApp, e passam pela
        infraestrutura do WhatsApp (Meta Platforms), sujeita à política de privacidade da própria plataforma.
      </p>

      <h2>3. Para que usamos</h2>
      <ul>
        <li>Responder ao seu contato e apresentar a proposta comercial adequada;</li>
        <li>Conduzir o período de teste, quando aplicável;</li>
        <li>Manter o histórico do atendimento.</li>
      </ul>
      <p>
        A base legal é o procedimento preliminar a um contrato a seu pedido (art. 7º, V, da LGPD) e o legítimo
        interesse em responder a quem nos procura (art. 7º, IX).
      </p>
      <p>Não vendemos, alugamos nem cedemos seus dados a terceiros para fins publicitários.</p>

      <h2>4. Com quem compartilhamos</h2>
      <p>
        Apenas com quem é necessário para o atendimento acontecer: a plataforma de mensagens (WhatsApp / Meta
        Platforms) e as ferramentas internas de CRM que usamos para registrar o contato. Todos limitados à
        finalidade descrita acima.
      </p>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>
        Mantemos os dados de contato enquanto durar a relação comercial e por até 5 anos após o último
        contato, prazo que atende a obrigações legais e à defesa em eventual processo. Depois disso, são
        eliminados.
      </p>

      <h2>6. Seus direitos</h2>
      <p>A LGPD garante a você o direito de solicitar, a qualquer momento e sem custo:</p>
      <ul>
        <li>confirmação de que tratamos dados seus e acesso a eles;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>portabilidade a outro fornecedor;</li>
        <li>informação sobre com quem compartilhamos seus dados;</li>
        <li>revogação do consentimento e eliminação dos dados.</li>
      </ul>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas para proteger os dados contra acesso não autorizado, perda
        ou divulgação indevida, incluindo controle de acesso às contas onde o atendimento é registrado. O site
        é servido integralmente sobre HTTPS.
      </p>

      <h2>8. Como falar conosco</h2>
      <p>
        Para exercer qualquer um dos direitos acima, ou para tirar dúvidas sobre esta política, fale com o
        nosso encarregado de dados:
      </p>
      <ContactCard>
        <p>
          Telefone / WhatsApp: <strong>{company.phone}</strong>
        </p>
        <p className="mt-2">Endereço: {company.address}</p>
        <p className="mt-4 text-sm text-slate-500">Respondemos em até 15 dias.</p>
      </ContactCard>

      <h2>9. Alterações</h2>
      <p>
        Podemos atualizar esta política. Quando isso acontecer, mudamos a data de &ldquo;última
        atualização&rdquo; no topo desta página. Recomendamos revisitá-la periodicamente.
      </p>
    </LegalPage>
  );
}
