"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { 
  MapPin, Star, ShieldCheck, Camera, Wind, Home, 
  Calendar, CheckCircle2, MessageSquare, Heart 
} from "lucide-react";

export default function HostProfilePage() {
  const { id } = useParams();
  const [host, setHost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para o cálculo de reserva
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    const fetchHost = async () => {
      const docRef = doc(db, "hosts", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setHost(docSnap.data());
      setLoading(false);
    };
    fetchHost();
  }, [id]);

  // Lógica simples de cálculo de diárias
  useEffect(() => {
    if (checkIn && checkOut && host?.price) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * parseFloat(host.price));
      }
    }
  }, [checkIn, checkOut, host]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-2xl">Carregando Perfil...</div>;
  if (!host) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-2xl">Anfitrião não encontrado.</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-200">
      
      {/* 1. HEADER DE IMPACTO */}
      <header className="bg-white border-b-[6px] border-black pt-10 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-2">{host.name}</h1>
              <div className="flex items-center gap-4 text-sm font-bold uppercase">
                <span className="flex items-center gap-1 text-purple-600"><Star fill="currentColor" size={16}/> 5.0 (12 Reviews)</span>
                <span className="flex items-center gap-1 text-gray-500"><MapPin size={16}/> {host.neighborhood || "Bairro"}, {host.city}</span>
              </div>
            </div>
            <div className="flex gap-2">
               <span className="bg-green-400 border-2 border-black px-3 py-1 font-black text-[10px] uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Identidade Verificada</span>
               <span className="bg-purple-600 text-white border-2 border-black px-3 py-1 font-black text-[10px] uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Super Anfitrião</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUNA ESQUERDA - CONTEÚDO RICO */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 2. GALERIA (PLACEHOLDERS INTELIGENTES) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
            <div className="bg-gray-100 border-4 border-black h-full flex items-center justify-center relative overflow-hidden group">
               {host.photoUrl ? <img src={host.photoUrl} className="w-full h-full object-cover" /> : <Home size={64} className="text-gray-300"/>}
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
            </div>
            <div className="grid grid-rows-2 gap-4 h-full">
               <div className="bg-purple-50 border-4 border-black flex items-center justify-center"><Camera className="text-purple-200" size={32}/></div>
               <div className="bg-yellow-50 border-4 border-black flex items-center justify-center"><Heart className="text-yellow-200" size={32}/></div>
            </div>
          </section>

          {/* 3. BIO E SOBRE */}
          <section className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic border-l-8 border-purple-600 pl-4">Sobre o Anfitrião</h2>
            <p className="font-bold text-gray-600 leading-relaxed text-lg">
              {host.bio || "Olá! Sou apaixonado por animais e meu espaço foi todo pensado para receber seu melhor amigo com segurança e muito carinho. Tenho experiência com pets idosos e filhotes."}
            </p>
          </section>

          {/* 4. O QUE O ESPAÇO OFERECE */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase italic border-l-8 border-yellow-400 pl-4">O que oferece</h2>
            <div className="grid grid-cols-2 gap-4">
              {host.facilities && host.facilities.length > 0 ? (
                host.facilities.map((f: string) => (
                  <div key={f} className="flex items-center gap-3 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <span className="font-black uppercase text-xs">{f}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 font-bold italic">Facilidades padrão: Água fresca, Carinho e Passeios.</p>
              )}
            </div>
          </section>

          {/* 5. LOCALIZAÇÃO (Visual Mock) */}
          <section className="space-y-4">
             <h2 className="text-3xl font-black uppercase italic border-l-8 border-black pl-4">Localização</h2>
             <div className="w-full h-64 bg-blue-50 border-4 border-black flex items-center justify-center relative overflow-hidden">
                <MapPin size={48} className="text-red-500 mb-2 animate-bounce" />
                <p className="absolute bottom-4 left-4 bg-white border-2 border-black px-2 py-1 font-black text-[10px] uppercase">Zona Aproximada</p>
             </div>
             <p className="font-bold text-xs uppercase text-gray-500">O endereço exato será liberado após a confirmação da reserva.</p>
          </section>

        </div>

        {/* COLUNA DIREITA - CARD DE RESERVA STICKY */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 border-[6px] border-black bg-yellow-400 p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
               <div>
                  <span className="font-black text-xs uppercase">Diária a partir de</span>
                  <h3 className="text-5xl font-black">R${host.price}</h3>
               </div>
               <span className="font-black text-xs uppercase bg-black text-yellow-400 px-2 py-1">Melhor Preço</span>
            </div>

            <div className="space-y-4 mb-6">
               <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border-4 border-black p-2">
                     <label className="block text-[9px] font-black uppercase">Check-in</label>
                     <input type="date" className="w-full outline-none font-bold text-xs bg-transparent" onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div className="bg-white border-4 border-black p-2">
                     <label className="block text-[9px] font-black uppercase">Check-out</label>
                     <input type="date" className="w-full outline-none font-bold text-xs bg-transparent" onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
               </div>
               
               {nights > 0 && (
                 <div className="bg-white/50 border-2 border-black border-dashed p-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span>R${host.price} x {nights} noites</span>
                       <span>R${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                       <span>Taxa PetHub (10%)</span>
                       <span>R${(totalPrice * 0.10).toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-black pt-2 flex justify-between font-black text-lg">
                       <span>TOTAL</span>
                       <span>R${(totalPrice * 1.10).toFixed(2)}</span>
                    </div>
                 </div>
               )}
            </div>

            <button className="w-full bg-black text-white py-4 font-black uppercase text-xl border-4 border-black hover:bg-purple-600 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]">
               Reservar Agora
            </button>
            <p className="text-[10px] font-black text-center mt-4 uppercase opacity-60">Você não será cobrado agora</p>
          </div>
        </div>

      </main>
    </div>
  );
}