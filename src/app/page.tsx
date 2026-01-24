"use client";

import Link from "next/link";
import { Search, ShieldCheck, Heart, Star, Zap, DollarSign, ArrowRight, PawPrint } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-yellow-300">
      
      {/* HERO SECTION CINEMATOGRÁFICO */}
      <section 
        className="relative pt-32 pb-32 px-6 border-b-[10px] border-black flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2824&auto=format&fit=crop")' }}
      >
        {/* Overlay escuro para leitura */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter text-white drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]">
            VIAJE SEM <br /><span className="text-yellow-400">CULPA.</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-black uppercase italic border-4 border-black p-4 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2">
            Seu pet merece um lar, não uma gaiola. Encontre cuidadores de elite perto de você.
          </p>
          
          <div className="flex justify-center">
            <Link href="/search" className="bg-white text-black px-12 py-6 font-black text-3xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3">
              <Search size={32} /> Buscar Cuidador
            </Link>
          </div>
        </div>
      </section>

      {/* PARCEIROS QUE APOIAM (Mantido) */}
      <section className="bg-black py-10 px-6 overflow-hidden border-b-[10px] border-black">
        <p className="text-white text-center font-black uppercase text-xs mb-6 tracking-widest opacity-50">Parceiros que apoiam o bem-estar animal</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale contrast-125">
          <span className="text-white font-black text-3xl tracking-tighter">DOG CHOW</span>
          <span className="text-white font-black text-3xl tracking-tighter">PETZ</span>
          <span className="text-white font-black text-3xl tracking-tighter">COBASI</span>
          <span className="text-white font-black text-3xl tracking-tighter">ROYAL CANIN</span>
        </div>
      </section>

      {/* ESTATÍSTICAS (Mantido) */}
      <section className="py-20 px-6 border-b-[10px] border-black bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_rgba(34,197,94,1)] group hover:-translate-y-2 transition-all">
            <h2 className="text-7xl font-black">+1.2k</h2>
            <p className="font-black uppercase italic text-xl mt-2">Pets Felizes</p>
          </div>
          <div className="border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_rgba(147,51,234,1)] group hover:-translate-y-2 transition-all">
            <h2 className="text-7xl font-black">100%</h2>
            <p className="font-black uppercase italic text-xl mt-2">Seguro Incluso</p>
          </div>
          <div className="border-[6px] border-black p-8 shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] group hover:-translate-y-2 transition-all">
            <h2 className="text-7xl font-black">4.9/5</h2>
            <p className="font-black uppercase italic text-xl mt-2">Avaliação Média</p>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL (Mantido) */}
      <section className="py-24 px-6 bg-purple-50 border-b-[10px] border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic mb-16 leading-none tracking-tighter text-center md:text-left">
            O QUE DIZEM <br />OS PAIS DE PETS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Carla & Paçoca", text: "O PetHub salvou minhas férias! Encontrei uma anfitriã maravilhosa que mandava fotos todo dia. O Paçoca nem queria voltar pra casa!" },
              { name: "Ricardo & Thor", text: "Profissionalismo puro. O processo de reserva é seguro e a paz de espírito de saber que o Thor estava em um lar de verdade não tem preço." },
              { name: "Ana & Luna", text: "Minha gata é super tímida, mas a cuidadora teve uma paciência incrível. O suporte 24h da plataforma também me deixou muito segura." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-black p-2">
                  <Star className="text-black" fill="currentColor" size={24} />
                </div>
                <p className="font-bold text-lg italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 border-t-4 border-black pt-4">
                  <div className="w-14 h-14 bg-gray-200 border-4 border-black rounded-full flex items-center justify-center font-black">
                    <PawPrint size={20} opacity={0.2} />
                  </div>
                  <span className="font-black uppercase text-lg">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MONETIZAÇÃO DUPLA (Mantido) */}
      <section className="py-24 px-6 border-b-[10px] border-black bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="border-[8px] border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(34,197,94,1)] group hover:-translate-y-1 transition-all">
            <Heart size={64} className="text-green-500 mb-8" />
            <h3 className="text-5xl font-black uppercase mb-6 leading-none italic">Preciso de um<br />cuidador</h3>
            <p className="font-bold text-gray-600 mb-10 text-xl">Viaje tranquilo sabendo que seu pet está sendo mimado em um lar verificado, com rotina e amor.</p>
            <Link href="/search" className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 font-black uppercase text-xl border-4 border-black hover:bg-green-500 hover:text-black transition-all">
              Buscar Agora <ArrowRight size={24} />
            </Link>
          </div>
          <div className="border-[8px] border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(147,51,234,1)] group hover:-translate-y-1 transition-all">
            <DollarSign size={64} className="text-purple-600 mb-8" />
            <h3 className="text-5xl font-black uppercase mb-6 leading-none italic">Quero ser um<br />anfitrião</h3>
            <p className="font-bold text-gray-600 mb-10 text-xl">Ama animais e tem um espaço seguro? Transforme sua paixão em uma fonte de renda extra.</p>
            <Link href="/quero-cuidar" className="inline-flex items-center gap-3 bg-purple-600 text-white px-10 py-5 font-black uppercase text-xl border-4 border-black hover:bg-black transition-all">
              Começar a Ganhar <Zap size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER CTA (Mantido) */}
      <footer className="py-32 px-6 bg-black text-white text-center">
        <h2 className="text-7xl md:text-[10rem] font-black uppercase italic leading-[0.8] mb-16 tracking-tighter">
          SEU PET <br /><span className="text-yellow-400">AGRADECE.</span>
        </h2>
        <Link href="/login" className="bg-yellow-400 text-black border-[6px] border-white px-20 py-10 font-black text-4xl uppercase shadow-[15px_15px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
          CRIAR CONTA GRÁTIS
        </Link>
      </footer>
    </div>
  );
}