'''"use client";

import Link from "next/link";
import { ShieldCheck, CalendarHeart, Award, MessageSquareHeart, Handshake, Search, ArrowRight } from "lucide-react";

// Componente para o Accordion do FAQ
const FaqItem = ({ q, a }: { q: string, a: string }) => (
  <details className="border-b-4 border-black py-6 group">
    <summary className="font-black text-xl md:text-2xl uppercase flex justify-between items-center cursor-pointer hover:text-purple-600">
      {q}
      <span className="text-purple-600 text-4xl transform group-open:-rotate-90 transition-transform duration-300">→</span>
    </summary>
    <p className="font-bold text-gray-700 mt-4 text-lg leading-relaxed">{a}</p>
  </details>
);

export default function ComoFuncionaRebuildPage() {

  const beneficios = [
    { icon: ShieldCheck, t: "SEGURO PET TOTAL", d: "Cobertura veterinária de até R$5.000 para acidentes e emergências durante a estadia. Sem custo adicional." },
    { icon: MessageSquareHeart, t: "SUPORTE HUMANO 24H", d: "Nossa equipe de especialistas está a uma mensagem de distância para qualquer eventualidade, a qualquer hora." },
    { icon: CalendarHeart, t: "FOTOS E VÍDEOS DIÁRIOS", d: "Mate a saudade e acompanhe a felicidade do seu pet com atualizações constantes enviadas pelo anfitrião." }
  ];

  const timeline = [
    { n: "01", t: "Busca Avançada", d: "Use nossos filtros inteligentes para encontrar o anfitrião ideal perto de você." },
    { n: "02", t: "Análise de Perfis", d: "Verifique fotos reais do local, leia avaliações e a bio detalhada do cuidador." },
    { n: "03", t: "Visita Prévia (Opcional)", d: "Agende um encontro para garantir o encaixe perfeito entre seu pet e o novo ambiente." },
    { n: "04", t: "Reserva 100% Segura", d: "Pague online com total segurança. O anfitrião só recebe 24h após o início da hospedagem." },
    { n: "05", t: "Aproveite a Viagem", d: "Relaxe sabendo que seu pet está em um lar seguro, recebendo carinho e atenção." },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* HERO */}
      <section className="py-24 px-6 border-b-8 border-black text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">NÃO É SÓ HOSPEDAGEM. <br/><span className="text-purple-600">É UM LAR TEMPORÁRIO.</span></h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto text-gray-800 leading-snug">
            No PetHub, unimos tecnologia e um amor genuíno por animais para criar a experiência de hospedagem mais segura e confiável do Brasil. 
          </p>
        </div>
      </section>

      {/* BENEFÍCIOS CARD */}
      <section className="py-24 px-6 bg-yellow-400 border-b-8 border-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {beneficios.map((b, i) => (
            <div key={i} className="bg-white border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center space-y-4">
              <b.icon className="w-20 h-20 text-purple-600" strokeWidth={2.5}/>
              <h3 className="text-2xl font-black uppercase">{b.t}</h3>
              <p className="font-bold text-gray-700 text-lg">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO ESCOLHEMOS OS ANFITRIÕES */}
       <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:pr-12">
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Como Escolhemos <br/>os <span className="text-purple-600 italic">Heróis</span> do seu Pet</h2>
                <p className="text-xl font-bold text-gray-700 mb-8 leading-relaxed">Apenas 15% dos candidatos se tornam anfitriões PetHub. Nossa equipe realiza uma curadoria manual que inclui:</p>
                <ul className="space-y-4 font-black text-lg">
                    <li className="flex items-center gap-4"><Award className="w-8 h-8 text-green-500 flex-shrink-0" /> Verificação de Documentos e Endereço</li>
                    <li className="flex items-center gap-4"><Award className="w-8 h-8 text-green-500 flex-shrink-0" /> Entrevista em vídeo com nossos especialistas</li>
                    <li className="flex items-center gap-4"><Award className="w-8 h-8 text-green-500 flex-shrink-0" /> Análise de fotos e da estrutura do local</li>
                    <li className="flex items-center gap-4"><Award className="w-8 h-8 text-green-500 flex-shrink-0" /> Teste de conhecimentos sobre segurança pet</li>
                </ul>
            </div>
             <div>
                <div className='bg-gray-200 border-6 border-black aspect-video flex items-center justify-center font-black text-2xl p-8 text-center shadow-[12px_12px_0px_#000]'>FOTO REAL DE UM ANFITRIÃO FELIZ COM UM PET</div>
            </div>
        </div>
      </section>

      {/* LINHA DO TEMPO */}
      <section className="py-24 px-6 bg-gray-100 border-y-8 border-black">
        <div className="max-w-4xl mx-auto">
           <h2 className="text-center text-5xl font-black uppercase tracking-tighter mb-20">SUA JORNADA DE CONFIANÇA <br/>PASSO A PASSO</h2>
            <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black/20" aria-hidden="true"></div>
                {timeline.map((item, index) => (
                    <div key={item.n} className="mb-12 flex items-center w-full">
                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'} ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                           <div className={`p-6 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]`}>
                                <h4 className="text-2xl font-black uppercase">{item.t}</h4>
                                <p className="font-medium text-gray-600">{item.d}</p>
                           </div>
                        </div>
                         <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-purple-600 border-6 border-black rounded-full flex items-center justify-center text-white font-black text-2xl">{item.n}</div>
                        <div className="w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
      </section>

       {/* SEGURANÇA */}
       <section className="py-24 px-6 bg-purple-600 text-white border-b-8 border-black">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="order-2 lg:order-1">
                    <div className='bg-white text-black border-6 border-black aspect-square flex items-center justify-center font-black text-2xl p-8 text-center shadow-[12px_12px_0px_#000]'>FOTO: PET BRINCANDO SEGURO DENTRO DE CASA</div>
                </div>
                <div className="lg:pl-12 order-1 lg:order-2">
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Segurança em 3 Camadas: <br/>Nossa <span className="text-yellow-400 italic">Obsessão</span></h2>
                    <div className="space-y-6">
                        <div className="bg-purple-700/50 p-6 border-4 border-white">
                            <h4 className="font-black text-2xl uppercase text-yellow-400">1. PAGAMENTO PROTEGIDO</h4>
                            <p className="font-bold text-lg">Seu pagamento fica retido conosco e o cuidador só recebe após a hospedagem ser concluída com sucesso. Tranquilidade do início ao fim.</p>
                        </div>
                        <div className="bg-purple-700/50 p-6 border-4 border-white">
                            <h4 className="font-black text-2xl uppercase text-yellow-400">2. SEGURO VETERINÁRIO INCLUSO</h4>
                            <p className="font-bold text-lg">Qualquer emergência ou acidente durante a estadia está coberto pelo nosso seguro. Cuidamos de tudo para você.</p>
                        </div>
                        <div className="bg-purple-700/50 p-6 border-4 border-white">
                            <h4 className="font-black text-2xl uppercase text-yellow-400">3. SUPORTE DE EMERGÊNCIA</h4>
                            <p className="font-bold text-lg">Nossa equipe de suporte está disponível 24h por dia, 7 dias por semana, para intervir em qualquer situação inesperada.</p>
                        </div>
                    </div>
                </div>
            </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-5xl font-black uppercase tracking-tighter mb-16">DÚVIDAS FREQUENTES</h2>
          <div className="space-y-4">
            <FaqItem q="Como funciona o pagamento?" a="Você paga o valor total da reserva no momento da confirmação, via Cartão de Crédito ou Pix. O valor fica retido com o PetHub e nós repassamos ao cuidador 24 horas após o início da hospedagem, garantindo total segurança para ambos os lados." />
            <FaqItem q="E se meu pet não se adaptar?" a="É por isso que recomendamos fortemente a Visita Prévia. Caso a adaptação não ocorra nos primeiros dias, nosso suporte 24h ajudará a encontrar uma solução, que pode incluir a realocação para outro anfitrião ou o cancelamento da reserva com reembolso proporcional." />
            <FaqItem q="O que o Seguro PetHub Cobre?" a="O seguro cobre despesas veterinárias emergenciais decorrentes de acidentes que ocorram durante a estadia. Isso inclui consultas de emergência, exames, medicamentos e procedimentos necessários até o limite de R$5.000. Não cobre doenças preexistentes." />
            <FaqItem q="Posso cancelar uma reserva?" a="Sim. O cancelamento é gratuito até 7 dias antes do check-in. Após esse período, aplicam-se taxas de cancelamento. Recomendamos ler nossa política completa para entender todos os detalhes." />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-gray-100 border-t-8 border-black">
        <div className="max-w-3xl mx-auto text-center">
           <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-10">
            Pronto para encontrar o lar perfeito?
          </h2>
          <Link href="/search" className="inline-block bg-purple-600 text-white font-black text-3xl py-6 px-12 border-6 border-black shadow-[10px_10px_0px_#000] hover:bg-purple-700 active:shadow-none active:translate-y-2 active:translate-x-2 transition-all uppercase">
              <Search className="inline-block w-10 h-10 mr-4" /> BUSCAR ANFITRIÃO AGORA
            </Link>
        </div>
      </section>
    </div>
  );
}
'''