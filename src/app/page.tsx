import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import { Star, ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION COM FOTO DE FUNDO */}
      <section className="relative bg-yellow-400 pb-32 pt-10">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 z-10">
               <div className="inline-block bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2 transform">
                  🐶 O #1 do Brasil
               </div>
               <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter">
                  Quem ama <br/> <span className="text-white text-stroke-3">Cuida.</span>
               </h1>
               <p className="text-xl font-bold max-w-md">
                  Hospedagem, Creche e Passeios com anfitriões que vão tratar seu pet como filho.
               </p>
            </div>

            {/* Imagem de Capa (Cachorro Feliz) */}
            <div className="relative h-[400px] md:h-[500px]">
               <img 
                 src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2670&auto=format&fit=crop" 
                 alt="Cachorro feliz"
                 className="w-full h-full object-cover rounded-[40px] border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(255,255,255,0.5)]"
               />
               
               {/* Badge Flutuante */}
               <div className="absolute -bottom-6 -left-6 bg-white border-4 border-black p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
                  <div className="bg-green-100 p-2 rounded-full border-2 border-black">
                     <ShieldCheck className="text-green-600" size={24} />
                  </div>
                  <div>
                     <p className="font-black text-xs uppercase">Garantia Veterinária</p>
                     <p className="text-[10px] font-bold">Inclusa em todas as reservas</p>
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* 2. COMPONENTE DE BUSCA (SOBREPOSTO) */}
      <div className="px-4">
         <HeroSearch />
      </div>

      {/* 3. PROVA SOCIAL (LOGOS/NUMEROS) */}
      <section className="py-20 text-center">
         <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Confiança de milhares de tutores</p>
         <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
             {/* Mock Logos */}
             <span className="text-2xl font-black">EXAME</span>
             <span className="text-2xl font-black">VEJA</span>
             <span className="text-2xl font-black">FORBES</span>
             <span className="text-2xl font-black">UOL</span>
         </div>
      </section>

    </main>
  );
}