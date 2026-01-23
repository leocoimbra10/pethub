"use client";

import Link from "next/link";
import { ShieldCheck, CalendarHeart, Award, MessageSquareHeart, Handshake, Search, ArrowRight } from "lucide-react";

export default function ComoFuncionaPage() {
  const diferenciais = [
    { icon: <ShieldCheck size={40} />, t: "CUIDADORES ELITE", d: "Apenas 15% dos candidatos passam no nosso rigoroso processo de seleção com verificação de antecedentes." },
    { icon: <MessageSquareHeart size={40} />, t: "SUPORTE 24H", d: "Nossa equipe está de prontidão para qualquer imprevisto. Você e seu pet nunca estão sozinhos." },
    { icon: <CalendarHeart size={40} />, t: "FOTOS DIÁRIAS", d: "Receba atualizações em tempo real. Veja como seu melhor amigo está se divertindo e matando a saudade." }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-300">
      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-6 border-b-[12px] border-black bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-10">
            PAZ DE <br /><span className="text-purple-600">ESPÍRITO.</span>
          </h1>
          <div className="max-w-2xl border-4 border-black p-6 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black uppercase italic">
              O PetHub não é apenas uma plataforma. É a garantia de que seu pet terá um lar amoroso enquanto você estiver fora.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESSO PASSO A PASSO */}
      <section className="py-24 px-6 border-b-[8px] border-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black uppercase mb-20 italic">O Caminho do Herói 🐾</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="relative p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(147,51,234,1)]">
              <span className="absolute -top-10 -left-4 text-9xl font-black text-gray-100 -z-10">01</span>
              <Search className="mb-4" size={48} />
              <h3 className="text-2xl font-black uppercase mb-4">Escolha a dedo</h3>
              <p className="font-bold text-gray-600">Filtre por localização e encontre o anfitrião que mais combina com a rotina do seu pet.</p>
            </div>
            <div className="relative p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(147,51,234,1)]">
              <span className="absolute -top-10 -left-4 text-9xl font-black text-gray-100 -z-10">02</span>
              <Handshake className="mb-4" size={48} />
              <h3 className="text-2xl font-black uppercase mb-4">Dê o Match</h3>
              <p className="font-bold text-gray-600">Converse pelo chat, tire dúvidas e agende uma visita antes de confirmar a reserva.</p>
            </div>
            <div className="relative p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(147,51,234,1)]">
              <span className="absolute -top-10 -left-4 text-9xl font-black text-gray-100 -z-10">03</span>
              <Award className="mb-4" size={48} />
              <h3 className="text-2xl font-black uppercase mb-4">Pagamento Protegido</h3>
              <p className="font-bold text-gray-600">O valor fica seguro conosco e só é liberado para o cuidador após o fim da hospedagem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {diferenciais.map((d, i) => (
            <div key={i} className="space-y-6">
              <div className="text-purple-400">{d.icon}</div>
              <h4 className="text-3xl font-black uppercase italic">{d.t}</h4>
              <p className="text-gray-400 font-bold text-lg">{d.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SIMPLIFICADO */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black uppercase mb-12 border-b-4 border-black pb-2 w-fit">Perguntas Frequentes</h2>
          <div className="space-y-8">
            <details className="group border-4 border-black p-6 cursor-pointer open:bg-purple-50 transition-all">
              <summary className="font-black uppercase text-xl list-none flex justify-between items-center">
                E se houver uma emergência médica? <ArrowRight className="group-open:rotate-90 transition-all" />
              </summary>
              <p className="mt-4 font-bold text-gray-600">Temos um protocolo de emergência onde o pet é levado ao veterinário mais próximo e nossa equipe de suporte acompanha todo o processo em tempo real.</p>
            </details>
            <details className="group border-4 border-black p-6 cursor-pointer open:bg-purple-50 transition-all">
              <summary className="font-black uppercase text-xl list-none flex justify-between items-center">
                Como os anfitriões são verificados? <ArrowRight className="group-open:rotate-90 transition-all" />
              </summary>
              <p className="mt-4 font-bold text-gray-600">Validamos documentos oficiais, comprovantes de residência e realizamos uma entrevista detalhada para entender a experiência real com animais.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 px-6 bg-white flex justify-center">
        <div className="max-w-5xl w-full text-center border-[8px] border-black p-16 shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] bg-purple-600">
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase leading-none mb-12">
            O MELHOR PRO SEU AMIGO ESTÁ AQUI.
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/search" className="bg-white text-black font-black text-2xl py-6 px-16 border-4 border-black hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase">
              Buscar cuidador
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}