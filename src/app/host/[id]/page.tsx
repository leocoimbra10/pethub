"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Star, CheckCircle2, Home, Camera, Heart 
} from "lucide-react";

// DADOS FICTÍCIOS PARA TESTE VISUAL (CASO NÃO TENHA NO BANCO)
const MOCK_HOST = {
  name: "Lar da Tia Juju",
  bio: "Aqui seu pet dorme no sofá! Sou veterinária aposentada, tenho um quintal gramado de 200m² totalmente seguro e monitorado. Aceito cães de todos os portes e garanto 3 passeios diários.",
  price: "135",
  city: "São Paulo",
  neighborhood: "Vila Madalena",
  photoUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop", // Foto principal (Cachorros)
  gallery: [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop", // Foto 2 (Cachorro no sofá)
    "https://images.unsplash.com/photo-1596230529625-7ee541366115?q=80&w=2670&auto=format&fit=crop"  // Foto 3 (Quintal/Ambiente)
  ],
  facilities: ["Quintal Gramado", "Veterinária", "Câmeras 24h", "Dorme Dentro de Casa", "Passeios Inclusos"]
};

export default function HostProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [host, setHost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados de Reserva
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const docRef = doc(db, "hosts", id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHost(docSnap.data());
        } else {
          // SE NÃO ACHAR NO BANCO, USA O MOCK PARA VISUALIZAÇÃO
          console.log("Host não encontrado no banco, usando MOCK.");
          setHost(MOCK_HOST);
        }
      } catch (error) {
        console.error("Erro ao buscar host:", error);
        setHost(MOCK_HOST); // Fallback de segurança
      } finally {
        setLoading(false);
      }
    };
    fetchHost();
  }, [id]);

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

  const handleReservation = () => {
    if (!checkIn || !checkOut) {
      alert("⚠️ Por favor, selecione as datas de entrada e saída.");
      return;
    }
    // Na vida real, passariamos os dados via query params ou context
    router.push("/checkout");
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-black uppercase">
       <div className="w-16 h-16 border-[6px] border-black border-t-purple-600 animate-spin mb-4"></div>
       <p>Carregando Perfil...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-200">
      
      {/* 1. HEADER */}
      <header className="bg-white border-b-[6px] border-black pt-10 pb-8 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-none mb-2">{host.name}</h1>
              <div className="flex items-center gap-4 text-sm font-bold uppercase">
                <span className="flex items-center gap-1 text-purple-600"><Star fill="currentColor" size={16}/> 5.0 (28 Reviews)</span>
                <span className="flex items-center gap-1 text-gray-500"><MapPin size={16}/> {host.neighborhood || "Bairro"}, {host.city}</span>
              </div>
            </div>
            <div className="flex gap-2">
               <span className="bg-green-400 border-2 border-black px-3 py-1 font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">Verificado</span>
               <span className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]">Super Host</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6">
        
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 2. GALERIA VISUAL (AGORA COM FOTOS REAIS) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
            <div className="border-4 border-black h-full relative group overflow-hidden bg-gray-100">
               <img src={host.photoUrl} alt="Principal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="grid grid-rows-2 gap-4 h-full">
               <div className="border-4 border-black relative overflow-hidden bg-gray-100">
                 {host.gallery?.[0] ? <img src={host.gallery[0]} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Camera /></div>}
               </div>
               <div className="border-4 border-black relative overflow-hidden bg-gray-100">
                 {host.gallery?.[1] ? <img src={host.gallery[1]} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Heart /></div>}
               </div>
            </div>
          </section>

          {/* 3. SOBRE */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic border-l-8 border-purple-600 pl-4">A Experiência</h2>
            <p className="font-bold text-gray-600 leading-relaxed text-lg text-justify">
              {host.bio}
            </p>
          </section>

          {/* 4. FACILIDADES */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic border-l-8 border-yellow-400 pl-4">Infraestrutura</h2>
            <div className="grid grid-cols-2 gap-4">
              {host.facilities?.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 border-2 border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="font-black uppercase text-xs">{f}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* COLUNA DIREITA - CARD FLUTUANTE */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-28 border-[6px] border-black bg-yellow-400 p-6 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
               <div>
                  <span className="font-black text-[10px] uppercase block mb-1">Investimento Diário</span>
                  <h3 className="text-5xl font-black leading-none">R${host.price}</h3>
               </div>
            </div>

            <div className="space-y-4 mb-6">
               <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border-4 border-black p-3">
                     <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Check-in</label>
                     <input type="date" className="w-full outline-none font-bold text-sm bg-transparent uppercase" onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div className="bg-white border-4 border-black p-3">
                     <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Check-out</label>
                     <input type="date" className="w-full outline-none font-bold text-sm bg-transparent uppercase" onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
               </div>
               
               {nights > 0 ? (
                 <div className="bg-white/80 border-2 border-black border-dashed p-4 space-y-2 animate-in fade-in">
                    <div className="flex justify-between text-xs font-bold">
                       <span>{nights} noites x R${host.price}</span>
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
               ) : (
                 <div className="text-center py-4 opacity-50 font-black text-xs uppercase">
                   Selecione as datas para calcular
                 </div>
               )}
            </div>

            <button 
              onClick={handleReservation}
              className="w-full bg-black text-white py-4 font-black uppercase text-xl border-4 border-black hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)]"
            >
               Reservar Agora
            </button>
            <p className="text-[9px] font-black text-center mt-3 uppercase opacity-60">Garantia de reembolso integral até 24h antes</p>
          </div>
        </div>

      </main>
    </div>
  );
}