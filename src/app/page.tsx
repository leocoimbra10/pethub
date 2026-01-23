"use client";

import Link from "next/link";
import { Search, ShieldCheck, Heart, Star, Zap, DollarSign, ArrowRight, PawPrint } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-300">
      
      {/* HERO SECTION */}
      <section className="pt-24 pb-20 px-6 border-b-[10px] border-black text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-7xl md:text-9xl font-black uppercase leading-[0.8] tracking-tighter">
              VIAJE SEM <br /><span className="text-purple-600">CULPA.</span>
            </h1>
            <p className="text-xl font-black uppercase italic border-4 border-black p-4 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl">
              A maior rede de cuidadores verificados do Brasil. Seu pet em um lar, não em uma gaiola.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/search" className="bg-black text-white px-10 py-6 font-black text-2xl uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(147,51,234,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Achar um Cuidador
              </Link>
            </div>
          </div>
          <div className="hidden lg:block border-[10px] border-black bg-purple-100 p-4 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
             <div className="aspect-square bg-gray-200 border-4 border-black flex items-center justify-center font-black text-4xl italic">FOTO HERO PET</div>
          </div>
        </div>
      </section>

      {/* PATROCINADORES / PARCEIROS */}
      <section className="bg-black py-10 px-6 overflow-hidden">
        <p className="text-white text-center font-black uppercase text-xs mb-6 tracking-widest opacity-50">Parceiros que apoiam o bem-estar animal</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale contrast-125">
          <span className="text-white font-black text-3xl">DOG CHOW</span>
          <span className="text-white font-black text-3xl">PETZ</span>
          <span className="text-white font-black text-3xl">COBASI</span>
          <span className="text-white font-black text-3xl">ROYAL CANIN</span>
        </div>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="py-20 px-6 border-b-[10px] border-black bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]">
            <h2 className="text-6xl font-black">+1.2k</h2>
            <p className="font-black uppercase italic">Pets Hospedados</p>
          </div>
          <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(147,51,234,1)]">
            <h2 className="text-6xl font-black">100%</h2>
            <p className="font-black uppercase italic">Pagamento Seguro</p>
          </div>
          <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
            <h2 className="text-6xl font-black">24h</h2>
            <p className="font-black uppercase italic">Suporte de Elite</p>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL (DEPOIMENTOS) */}
      <section className="py-24 px-6 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-16 leading-none tracking-tighter">O QUE DIZEM <br />OS PAIS DE PETS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
                <Star className="text-yellow-400 mb-4" fill="currentColor" />
                <p className="font-bold text-lg italic mb-6">"O PetHub mudou minha forma de viajar. O Totó ficou super bem cuidado e recebi fotos o tempo todo!"</p>
                <div className="flex items-center gap-4 border-t-4 border-black pt-4">
                  <div className="w-12 h-12 bg-gray-200 border-2 border-black rounded-full"></div>
                  <span className="font-black uppercase text-sm">Mariana & Luna</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MONETIZAÇÃO DUPLA */}
      <section className="py-24 px-6 border-y-[10px] border-black bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="border-[8px] border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(34,197,94,1)]">
            <Heart size={48} className="text-green-500 mb-6" />
            <h3 className="text-4xl font-black uppercase mb-4 leading-none italic">Encontre o <br />lar perfeito</h3>
            <p className="font-bold text-gray-600 mb-8">Viaje tranquilo sabendo que seu pet está sendo mimado por um especialista verificado.</p>
            <Link href="/search" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-black uppercase hover:bg-green-500 hover:text-black transition-all">
              Buscar Cuidadores <ArrowRight />
            </Link>
          </div>
          <div className="border-[8px] border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(147,51,234,1)]">
            <DollarSign size={48} className="text-purple-600 mb-6" />
            <h3 className="text-4xl font-black uppercase mb-4 leading-none italic">Ganhe dinheiro <br />com carinho</h3>
            <p className="font-bold text-gray-600 mb-8">Tem um espaço seguro e ama animais? Transforme sua casa em um refúgio e seja pago por isso.</p>
            <Link href="/quero-cuidar" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 font-black uppercase hover:bg-black transition-all">
              Seja um Anfitrião <Zap />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="py-32 px-6 bg-black text-white text-center">
        <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] mb-12">PRONTO PARA <br />COMECAR?</h2>
        <Link href="/login" className="bg-yellow-400 text-black border-4 border-black px-16 py-8 font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
          CRIAR MINHA CONTA
        </Link>
      </footer>
    </div>
  );
}