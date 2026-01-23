"use client";

import Link from "next/link";
import { 
  ShieldCheck, Search, MessageSquare, CreditCard, HeartPulse, 
  MapPin, CheckCircle2, AlertTriangle, Star, Camera, PhoneCall, ArrowRight
} from "lucide-react";

export default function ComoFuncionaElite() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-200">
      
      {/* SEÇÃO 01: HERO - A FILOSOFIA */}
      <section className="pt-20 pb-16 px-6 border-b-[8px] border-black">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 mb-6">
            <span className="bg-purple-600 text-white border-2 border-black px-3 py-1 font-black uppercase text-[10px]">Segurança em Primeiro Lugar</span>
            <span className="bg-white border-2 border-black px-3 py-1 font-black uppercase text-[10px] italic">Transparência Total</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
            ENTENDA O <span className="text-purple-600 text-6xl md:text-8xl">PETHUB.</span>
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-600 max-w-3xl leading-relaxed italic">
            Criamos um ecossistema onde a confiança não é uma opção, mas a base de tudo. 
            Do processo de seleção rigoroso ao suporte em tempo real, cada detalhe foi 
            pensado para que você viaje com paz de espírito.
          </p>
        </div>
      </section>

      {/* SEÇÃO 02: O CRIVO - SEGURANÇA DETALHADA */}
      <section className="py-24 px-6 bg-gray-50 border-b-[8px] border-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-4xl font-black uppercase italic leading-none">Como selecionamos <br/> nossos anfitriões?</h2>
            <div className="p-6 border-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black uppercase text-sm italic">"Apenas 15% dos candidatos são aprovados para hospedar pelo PetHub."</p>
            </div>
            <p className="font-bold text-gray-500 leading-relaxed">
              Nosso processo é manual e rigoroso. Não basta ter um espaço, é preciso ter alma de cuidador e infraestrutura adequada.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <ShieldCheck />, t: "Verificação de Identidade", d: "Validamos documentos oficiais e antecedentes de cada anfitrião." },
              { icon: <MapPin />, t: "Inspeção de Residência", d: "Fotos e vídeos do local são auditados para garantir rotas de fuga zero." },
              { icon: <Star />, t: "Prova de Experiência", d: "Entrevistas técnicas sobre comportamento animal e primeiros socorros." },
              { icon: <CheckCircle2 />, t: "Feedback da Comunidade", d: "Avaliações reais e auditadas que não podem ser apagadas." }
            ].map((item, i) => (
              <div key={i} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                <div className="text-purple-600 mb-4">{item.icon}</div>
                <h4 className="font-black uppercase text-sm mb-2">{item.t}</h4>
                <p className="text-[11px] font-bold text-gray-500 leading-tight">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 03: O CICLO DA HOSPEDAGEM (PASSO A PASSO) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black uppercase text-center mb-16 italic border-b-4 border-black w-fit mx-auto pb-2">O Ciclo PetHub</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { n: "01", t: "Busca Inteligente", d: "Use filtros de localização e porte do pet." },
              { n: "02", t: "O Encontro", d: "Converse pelo chat e agende uma visita prévia." },
              { n: "03", t: "Reserva Segura", d: "Pague pela plataforma e ative o seguro pet." },
              { n: "04", t: "Relatório Diário", d: "Receba fotos e vídeos durante toda a estadia." }
            ].map((step, i) => (
              <div key={i} className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(168,85,247,1)]">
                <span className="text-5xl font-black text-purple-600 opacity-20 leading-none">{step.n}</span>
                <h4 className="font-black uppercase text-lg mt-2 mb-2 italic">{step.t}</h4>
                <p className="text-[11px] font-bold text-gray-400 uppercase leading-snug">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 04: GARANTIAS E SEGURO */}
      <section className="py-24 px-6 bg-black text-white border-y-[8px] border-black">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black uppercase italic leading-none text-purple-400">Proteção Veterinária 24h</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <HeartPulse className="shrink-0" size={32} />
                <p className="font-bold text-gray-300">Cobertura de despesas veterinárias emergenciais durante a hospedagem para imprevistos de saúde.</p>
              </div>
              <div className="flex gap-4">
                <PhoneCall className="shrink-0" size={32} />
                <p className="font-bold text-gray-300">Suporte PetHub disponível para auxiliar anfitriões em qualquer situação atípica.</p>
              </div>
              <div className="flex gap-4">
                <CreditCard className="shrink-0" size={32} />
                <p className="font-bold text-gray-300">Garantia de Reembolso caso a experiência não seja como o combinado.</p>
              </div>
            </div>
          </div>
          <div className="border-[6px] border-white p-10 bg-gray-900 shadow-[15px_15px_0px_0px_rgba(147,51,234,1)]">
             <AlertTriangle className="text-yellow-400 mb-6" size={48} />
             <h3 className="text-2xl font-black uppercase italic mb-4">Pagamento Blindado</h3>
             <p className="font-bold text-sm text-gray-400 leading-relaxed mb-6 italic">
                O valor da sua reserva fica retido com o PetHub. O anfitrião só recebe o pagamento 
                após o pet retornar para você e confirmarmos que tudo correu bem.
             </p>
             <div className="font-black text-[10px] uppercase border-2 border-purple-500 p-2 text-center text-purple-400">
                100% SEGURO CONTRA FRAUDES
             </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 05: FAQ - TIRANDO AS ÚLTIMAS DÚVIDAS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-black uppercase text-center italic leading-none mb-10">Dúvidas Frequentes</h2>
          {[
            { q: "Posso visitar o anfitrião antes?", a: "Sim! Encorajamos o pré-encontro para que o pet se familiarize com o ambiente." },
            { q: "O que acontece se o anfitrião cancelar?", a: "Nossa equipe trabalha imediatamente para realocar seu pet com outro cuidador de elite ou devolvemos seu dinheiro integralmente." },
            { q: "Como são definidos os preços?", a: "Cada anfitrião define seu valor baseado em sua experiência e infraestrutura disponível." }
          ].map((faq, i) => (
            <div key={i} className="border-b-4 border-black pb-6 group cursor-pointer hover:bg-gray-50 transition-all p-4">
              <h4 className="text-xl font-black uppercase italic flex justify-between items-center">
                {faq.q} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </h4>
              <p className="mt-4 font-bold text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="py-32 px-6 text-center bg-purple-600 text-white border-t-[8px] border-black">
        <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-none mb-10">TUDO PRONTO?</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto">
          <Link href="/search" className="flex-1 bg-black text-white p-6 border-4 border-black font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            BUSCAR ANFITRIÃO
          </Link>
          <Link href="/quero-cuidar" className="flex-1 bg-white text-black p-6 border-4 border-black font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            QUERO HOSPEDAR
          </Link>
        </div>
      </footer>
    </div>
  );
}