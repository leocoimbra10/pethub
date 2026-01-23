"use client";

import Link from "next/link";

export default function ComoFuncionaPage() {
  const passosPai = [
    { n: "01", t: "BUSCA INTELIGENTE", d: "Filtre por Estado, Cidade e Bairro. Encontre anfitriões verificados a poucos metros de você." },
    { n: "02", t: "CHECK-UP DE PERFIL", d: "Analise fotos reais, bio detalhada e avaliações de quem já usou. Transparência total." },
    { n: "03", t: "RESERVA SEGURA", d: "Combine detalhes pelo chat e pague com segurança. Seu pet fica protegido e você tranquilo." }
  ];

  const diferenciais = [
    { t: "CUIDADORES ELITE", d: "Apenas 15% dos candidatos passam no nosso rigoroso processo de seleção." },
    { t: "SUPORTE 24H", d: "Nossa equipe está de prontidão para qualquer imprevisto durante a hospedagem." },
    { t: "FOTOS E VÍDEOS", d: "Receba atualizações diárias do seu pet para matar a saudade e garantir o bem-estar." }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* HERO SECTION */}
      <section className="pt-20 pb-16 px-6 border-b-[12px] border-black">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <h1 className="text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter mb-8">
            CONFIANÇA <br /><span className="text-purple-600">NÃO SE PEDE,</span> <br />SE CONSTRÓI.
          </h1>
          <p className="max-w-2xl text-xl font-black uppercase border-4 border-black p-4 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            O PetHub é a plataforma mais segura para hospedar o seu melhor amigo. Saiba como fazemos isso.
          </p>
        </div>
      </section>

      {/* PROCESSO PASSO A PASSO */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black uppercase mb-16 italic underline decoration-purple-600 decoration-8 underline-offset-8">
            COMO FUNCIONA PARA VOCÊ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {passosPai.map((p) => (
              <div key={p.n} className="border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-all">
                <span className="text-7xl font-black text-purple-600 opacity-20 block leading-none mb-4">{p.n}</span>
                <h3 className="text-2xl font-black mb-4 uppercase">{p.t}</h3>
                <p className="font-bold text-gray-600 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER DIFERENCIAIS */}
      <section className="py-20 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {diferenciais.map((d) => (
            <div key={d.t} className="space-y-4">
              <h4 className="text-2xl font-black text-purple-400 uppercase italic">/ {d.t}</h4>
              <p className="font-bold text-gray-400">{d.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto border-[6px] border-black p-12 shadow-[20px_20px_0px_0px_rgba(147,51,234,1)] bg-white">
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mb-10">
            PRONTO PARA DAR O MELHOR AO SEU PET?
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/search" className="bg-black text-white font-black text-2xl py-6 px-12 border-4 border-black hover:bg-purple-600 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
              BUSCAR AGORA
            </Link>
            <Link href="/quero-cuidar" className="bg-white text-black font-black text-2xl py-6 px-12 border-4 border-black hover:bg-yellow-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              SER ANFITRIÃO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}