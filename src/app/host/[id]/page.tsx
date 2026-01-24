"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Star, CheckCircle2, Minus, Plus, Sparkles, Tag, AlertCircle 
} from "lucide-react";

// DADOS MOCK ATUALIZADOS COM REGRAS DE NEGÓCIO
const MOCK_HOST = {
  name: "Lar da Tia Juju (DEMO)",
  bio: "ESTE É UM PERFIL DE EXEMPLO. Aqui nós amamos matilhas grandes, mas temos um limite de segurança e adoramos dar desconto para irmãos!",
  price: "80", 
  city: "São Paulo",
  neighborhood: "Vila Madalena",
  photoUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596230529625-7ee541366115?q=80&w=2670&auto=format&fit=crop"
  ],
  facilities: ["Quintal Gramado", "Veterinária", "Câmeras 24h"],
  
  // 🔥 NOVAS REGRAS DO ANFITRIÃO
  maxPets: 3,                 // Só aceita até 3 animais
  acceptsMultiPetDiscount: true // Aceita dar desconto? (Mude para false para testar)
};

export default function HostProfileRulesEngine() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [host, setHost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  
  const [dogs, setDogs] = useState(1);
  const [cats, setCats] = useState(0);
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [breakdown, setBreakdown] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchHost = async () => {
      try {
        const docRef = doc(db, "hosts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Merge com valores default caso o host antigo não tenha esses campos
          setHost({ maxPets: 2, acceptsMultiPetDiscount: false, id: docSnap.id, ...docSnap.data() });
        } else {
          // Lógica de fallback (Mock)
          const q = query(collection(db, "hosts"), where("ownerId", "==", id));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
             const foundDoc = querySnapshot.docs[0];
             setHost({ maxPets: 2, acceptsMultiPetDiscount: false, id: foundDoc.id, ...foundDoc.data() });
          } else {
             setHost(MOCK_HOST);
          }
        }
      } catch (error) {
        setHost(MOCK_HOST);
      } finally {
        setLoading(false);
      }
    };
    fetchHost();
  }, [id]);

  // 🔥 LÓGICA DE PREÇO E CAPACIDADE
  useEffect(() => {
    if (checkIn && checkOut && host?.price) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 0) {
        setNights(diffDays);
        
        const basePrice = parseFloat(host.price);
        const totalPets = dogs + cats;
        let dailyTotal = 0;
        let discountApplied = false;

        // VERIFICA SE O HOST ACEITA O DESCONTO
        if (host.acceptsMultiPetDiscount) {
            // Regra: 1º Cheio, Resto 50%
            const extraPets = Math.max(0, totalPets - 1);
            dailyTotal = basePrice + (extraPets * (basePrice * 0.5));
            discountApplied = extraPets > 0;
        } else {
            // Regra: Todo mundo paga cheio
            dailyTotal = basePrice * totalPets;
        }
        
        const subtotal = dailyTotal * diffDays;
        const fee = subtotal * 0.10; 
        
        setTotalPrice(subtotal + fee);
        
        setBreakdown({
          basePrice,
          totalPets,
          discountApplied,
          extraPets: Math.max(0, totalPets - 1),
          extraPetPrice: basePrice * 0.5,
          subtotal,
          fee
        });
      }
    }
  }, [checkIn, checkOut, host, dogs, cats]);

  const handleReservation = () => {
    if (!checkIn || !checkOut) {
      alert("⚠️ Selecione as datas.");
      return;
    }
    router.push("/checkout");
  };

  // Helpers de Capacidade
  const totalSelected = dogs + cats;
  const isFull = host ? totalSelected >= host.maxPets : false;

  const incrementDogs = () => !isFull && setDogs(dogs + 1);
  const incrementCats = () => !isFull && setCats(cats + 1);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-200">
      
      {/* HEADER SIMPLIFICADO */}
      <header className="bg-white border-b-[6px] border-black pt-10 pb-8 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto">
           <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-none mb-2">{host.name}</h1>
           <p className="font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={16}/> {host.neighborhood}, {host.city}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6">
        
        {/* ESQUERDA (Info) */}
        <div className="lg:col-span-2 space-y-12">
           <div className="border-4 border-black h-96 bg-gray-100">
              <img src={host.photoUrl} className="w-full h-full object-cover" />
           </div>
           <div>
              <h2 className="text-2xl font-black uppercase italic border-l-8 border-purple-600 pl-4 mb-4">Sobre</h2>
              <p className="text-lg font-bold text-gray-600 text-justify">{host.bio}</p>
           </div>
        </div>

        {/* DIREITA - CARD INTELIGENTE COM REGRAS */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-28 border-[6px] border-black bg-white p-6 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
               <div>
                  <span className="font-black text-[10px] uppercase block mb-1">A partir de</span>
                  <h3 className="text-5xl font-black leading-none">R${host.price}<span className="text-lg text-gray-400">/noite</span></h3>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 border-4 border-black p-2">
                    <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Check-in</label>
                    <input type="date" className="w-full outline-none font-bold text-xs bg-transparent uppercase" onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="bg-gray-50 border-4 border-black p-2">
                    <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Check-out</label>
                    <input type="date" className="w-full outline-none font-bold text-xs bg-transparent uppercase" onChange={(e) => setCheckOut(e.target.value)} />
                </div>
            </div>

            {/* CONTADORES COM LIMITE LÓGICO */}
            <div className="space-y-3 mb-6 relative">
               <div className="flex justify-between items-center border-b-2 border-black pb-1">
                 <p className="font-black text-xs uppercase">Quem vai se hospedar?</p>
                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 ${isFull ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                    {isFull ? 'Lotação Máxima' : `Máx: ${host.maxPets}`}
                 </span>
               </div>
               
               {/* Contador Cães */}
               <div className="flex justify-between items-center">
                  <span className="font-bold text-sm uppercase">Cães</span>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setDogs(Math.max(0, dogs - 1))} className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"><Minus size={14}/></button>
                     <span className="font-black text-lg w-4 text-center">{dogs}</span>
                     <button 
                        onClick={incrementDogs} 
                        disabled={isFull}
                        className={`w-8 h-8 border-2 border-black flex items-center justify-center transition-all ${isFull ? 'opacity-20 cursor-not-allowed bg-gray-300' : 'hover:bg-black hover:text-white'}`}
                     >
                        <Plus size={14}/>
                     </button>
                  </div>
               </div>

               {/* Contador Gatos */}
               <div className="flex justify-between items-center">
                  <span className="font-bold text-sm uppercase">Gatos</span>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setCats(Math.max(0, cats - 1))} className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"><Minus size={14}/></button>
                     <span className="font-black text-lg w-4 text-center">{cats}</span>
                     <button 
                        onClick={incrementCats} 
                        disabled={isFull}
                        className={`w-8 h-8 border-2 border-black flex items-center justify-center transition-all ${isFull ? 'opacity-20 cursor-not-allowed bg-gray-300' : 'hover:bg-black hover:text-white'}`}
                     >
                        <Plus size={14}/>
                     </button>
                  </div>
               </div>
            </div>

            {/* RESUMO FINANCEIRO DINÂMICO */}
            {nights > 0 && breakdown ? (
                <div className="bg-yellow-400 border-4 border-black p-4 space-y-3 animate-in zoom-in-95">
                    
                    {/* Badge SÓ APARECE se tiver desconto ATIVO e APLICÁVEL */}
                    {host.acceptsMultiPetDiscount && breakdown.discountApplied && (
                        <div className="bg-black text-white p-2 font-black text-[10px] uppercase text-center flex items-center justify-center gap-2 mb-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                           <Sparkles size={12} className="text-yellow-400"/> Desconto Matilha Ativado!
                        </div>
                    )}

                    <div className="space-y-1 text-xs font-bold border-b-2 border-black pb-2 border-dashed">
                       {/* Linha 1: Preço Base */}
                       <div className="flex justify-between">
                          <span>
                            {host.acceptsMultiPetDiscount ? `1º Pet` : `${breakdown.totalPets} Pets`} x {nights} noites
                          </span>
                          <span>
                            {host.acceptsMultiPetDiscount 
                                ? `R$ ${(breakdown.basePrice * nights).toFixed(2)}`
                                : `R$ ${(breakdown.basePrice * breakdown.totalPets * nights).toFixed(2)}`
                            }
                          </span>
                       </div>

                       {/* Linha 2: Desconto (Condicional) */}
                       {host.acceptsMultiPetDiscount && breakdown.extraPets > 0 && (
                          <div className="flex justify-between text-purple-800">
                             <span className="flex items-center gap-1"><Tag size={10}/> {breakdown.extraPets} Pet(s) Extra (50% OFF)</span>
                             <span>R$ {(breakdown.extraPetPrice * breakdown.extraPets * nights).toFixed(2)}</span>
                          </div>
                       )}
                    </div>
                    
                    <div className="flex justify-between text-xs font-bold opacity-60">
                       <span>Taxa de Serviço</span>
                       <span>R$ {breakdown.fee.toFixed(2)}</span>
                    </div>

                    <div className="border-t-4 border-black pt-2 flex justify-between font-black text-2xl">
                       <span>TOTAL</span>
                       <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 bg-gray-100 border-4 border-black font-black text-[10px] uppercase opacity-50">
                   Selecione datas para calcular
                </div>
            )}

            <button onClick={handleReservation} className="w-full bg-black text-white py-4 font-black uppercase text-xl border-4 border-black hover:bg-purple-600 transition-all shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] mt-6">
               Reservar Agora
            </button>
            <p className="text-[9px] font-black text-center mt-3 uppercase opacity-60">
                Lotação máx deste local: {host.maxPets} animais
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}