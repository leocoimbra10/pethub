"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, Loader2, Plus, X, CheckCircle2, 
  Settings, Sparkles, MapPin, Dog, Cat, Bird, ShieldAlert, Scale,
  Clock, Moon, Footprints, Syringe, Ambulance, Pill, Zap, DollarSign
} from "lucide-react";
import Link from "next/link";

export default function EditarHostUltimatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);
  
  // Inputs temporários para listas
  const [customExotic, setCustomExotic] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  const [formData, setFormData] = useState({
    // 1. Identidade
    name: "",
    bio: "",
    city: "São Paulo",
    neighborhood: "",
    photoUrl: "",
    
    // 2. Regras & Preço
    price: "",
    maxDogs: 2,
    maxCats: 0,
    extraPetDiscount: 40,
    acceptedSizes: ["Pequeno", "Médio"] as string[],
    acceptedExotics: [] as string[],
    facilities: [] as string[],

    // 3. Logística & Rotina (NOVO)
    checkInStart: "08:00",
    checkInEnd: "20:00",
    checkOutMax: "12:00",
    instantBooking: false,
    sleepingArrangement: "Caminha Própria",
    walkRoutine: "1x ao dia (20min)",
    
    // 4. Saúde & Comportamento (NOVO)
    requiredVaccines: ["V10/V8", "Antirrábica"] as string[],
    medicalSkills: [] as string[],
    emergencyTransport: false,
    acceptedBehaviors: [] as string[], // "Late Muito", "Ansiedade"
    onlyNeutered: false,
    supervision24h: true,

    // 5. Upsell / Serviços Extras (NOVO)
    services: [] as { name: string, price: number }[]
  });

  // --- LISTAS DE OPÇÕES ---
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Brasília", "Salvador", "Florianópolis"];
  const petSizes = ["Pequeno (até 10kg)", "Médio (10-25kg)", "Grande (25-45kg)", "Gigante (+45kg)"];
  const vaccineOptions = ["V10/V8", "Antirrábica", "Giárdia", "Tosse dos Canis", "Leishmaniose"];
  const skillOptions = ["Medicamento Oral", "Injetável (Insulina)", "Curativos", "Banho Terapêutico"];
  const sleepingOptions = ["Na minha cama", "No sofá", "Caminha Própria", "Quarto exclusivo", "Canil externo"];
  const walkOptions = ["Nenhum (Só Quintal)", "1x ao dia (20min)", "2x ao dia (30min+)", "Trilhas/Parques"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "hosts"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setHostId(docData.id);
          const data = docData.data();
          setFormData(prev => ({
            ...prev,
            ...data as any,
            // Fallbacks de segurança para campos novos
            checkInStart: data.checkInStart || "08:00",
            services: data.services || [],
            requiredVaccines: data.requiredVaccines || ["V10/V8", "Antirrábica"],
            medicalSkills: data.medicalSkills || [],
            acceptedBehaviors: data.acceptedBehaviors || []
          }));
        } else {
          router.push("/quero-cuidar");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // --- HANDLERS GENÉRICOS ---
  const toggleList = (key: keyof typeof formData, item: string) => {
    setFormData(prev => {
      const list = prev[key] as string[];
      return {
        ...prev,
        [key]: list.includes(item) ? list.filter(i => i !== item) : [...list, item]
      };
    });
  };

  const addExotic = (e: React.MouseEvent) => {
    e.preventDefault();
    if (customExotic && !formData.acceptedExotics.includes(customExotic)) {
      setFormData(prev => ({ ...prev, acceptedExotics: [...prev.acceptedExotics, customExotic] }));
      setCustomExotic("");
    }
  };

  const addService = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newServiceName && newServicePrice) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, { name: newServiceName, price: Number(newServicePrice) }]
      }));
      setNewServiceName("");
      setNewServicePrice("");
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostId) return;
    setSaving(true);
    try {
      const docRef = doc(db, "hosts", hostId);
      await updateDoc(docRef, {
        ...formData,
        price: String(formData.price),
        maxDogs: Number(formData.maxDogs),
        maxCats: Number(formData.maxCats),
        extraPetDiscount: Number(formData.extraPetDiscount),
        // Compatibilidade
        maxPets: Number(formData.maxDogs) + Number(formData.maxCats),
        acceptsMultiPetDiscount: Number(formData.extraPetDiscount) > 0
      });
      alert("✅ Perfil Profissional Atualizado!");
      router.push("/painel-host");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white"><Loader2 className="animate-spin mr-2"/> CARREGANDO SISTEMA...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-purple-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
            <Link href="/painel-host" className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
            <ArrowLeft size={16} /> Voltar ao Painel
            </Link>
            <span className="bg-purple-600 text-white px-3 py-1 text-[10px] font-black uppercase">Editor Ultimate</span>
        </div>

        <header className="border-b-[8px] border-black pb-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              Configuração <span className="text-purple-600">Total.</span>
            </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* =======================
              BLOCO 1: IDENTIDADE
             ======================= */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2">Identidade</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do Espaço</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={12}/> Cidade</label>
                <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 cursor-pointer">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
               <label className="font-black uppercase text-xs">Bio (Venda seu peixe)</label>
               <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border-4 border-black font-bold h-24 resize-none outline-none bg-gray-50" />
            </div>
          </section>

          {/* =======================
              BLOCO 2: REGRAS & CAPACIDADE
             ======================= */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
             <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase rotate-1">Regras & Capacidade</div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px]">Diária Base (R$)</label>
                   <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 border-4 border-black font-black text-xl bg-white text-center" />
                </div>
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px]">Máx. Cães</label>
                   <select value={formData.maxDogs} onChange={e => setFormData({...formData, maxDogs: Number(e.target.value)})} className="w-full p-3 border-4 border-black font-black text-xl bg-white cursor-pointer text-center">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px]">Máx. Gatos</label>
                   <select value={formData.maxCats} onChange={e => setFormData({...formData, maxCats: Number(e.target.value)})} className="w-full p-3 border-4 border-black font-black text-xl bg-white cursor-pointer text-center">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px] text-purple-800">Desconto Extra</label>
                   <div className="flex items-center border-4 border-black bg-purple-100 h-[56px]">
                      <input required type="number" min="0" max="100" value={formData.extraPetDiscount} onChange={e => setFormData({...formData, extraPetDiscount: Number(e.target.value)})} className="w-full h-full p-3 font-black text-xl bg-transparent text-purple-800 text-center outline-none" />
                      <span className="pr-3 font-bold text-[10px] uppercase opacity-50">%OFF</span>
                   </div>
                </div>
             </div>

             <div className="mt-6 border-t-4 border-black border-dashed pt-4">
                <label className="font-black uppercase text-xs flex items-center gap-2 mb-2"><Scale size={14}/> Portes Aceitos</label>
                <div className="flex flex-wrap gap-2">
                   {petSizes.map(size => {
                      const s = size.split(' ')[0];
                      return (
                        <button key={size} type="button" onClick={() => toggleList('acceptedSizes', s)} className={`px-3 py-2 border-4 border-black font-black text-[10px] uppercase transition-all ${formData.acceptedSizes.includes(s) ? 'bg-black text-white' : 'bg-white hover:bg-white/50'}`}>
                            {formData.acceptedSizes.includes(s) && <CheckCircle2 size={12} className="inline mr-1 text-green-500"/>} {size}
                        </button>
                      )
                   })}
                </div>
             </div>

             {/* Exóticos */}
             <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-black uppercase text-xs flex items-center gap-1"><Bird size={14}/> Exóticos:</span>
                {formData.acceptedExotics.map(exo => (
                   <span key={exo} className="px-2 py-1 bg-purple-600 text-white border-2 border-black font-bold text-[10px] uppercase flex items-center gap-1">
                      {exo} <button type="button" onClick={() => setFormData(prev => ({...prev, acceptedExotics: prev.acceptedExotics.filter(i => i !== exo)}))}><X size={10}/></button>
                   </span>
                ))}
                <div className="flex gap-1 h-8">
                   <input placeholder="Ex: Hamster" value={customExotic} onChange={e => setCustomExotic(e.target.value)} className="w-24 px-2 border-2 border-black font-bold text-[10px] uppercase bg-white outline-none" />
                   <button onClick={addExotic} className="bg-black text-white px-2 border-2 border-black hover:bg-green-500"><Plus size={14}/></button>
                </div>
             </div>
          </section>

          {/* =======================
              BLOCO 3: LOGÍSTICA (NOVO)
             ======================= */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-blue-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2 flex items-center gap-2"><Clock size={12}/> Logística & Rotina</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
               <div className="space-y-1">
                  <label className="font-black uppercase text-[10px]">Check-in Início</label>
                  <input type="time" value={formData.checkInStart} onChange={e => setFormData({...formData, checkInStart: e.target.value})} className="w-full p-2 border-4 border-black font-bold bg-white" />
               </div>
               <div className="space-y-1">
                  <label className="font-black uppercase text-[10px]">Check-in Fim</label>
                  <input type="time" value={formData.checkInEnd} onChange={e => setFormData({...formData, checkInEnd: e.target.value})} className="w-full p-2 border-4 border-black font-bold bg-white" />
               </div>
               <div className="space-y-1">
                  <label className="font-black uppercase text-[10px] text-red-600">Checkout Máx.</label>
                  <input type="time" value={formData.checkOutMax} onChange={e => setFormData({...formData, checkOutMax: e.target.value})} className="w-full p-2 border-4 border-black font-bold bg-white text-red-600" />
               </div>
               <div className="space-y-1">
                  <label className="font-black uppercase text-[10px]">Reserva Flash?</label>
                  <div onClick={() => setFormData({...formData, instantBooking: !formData.instantBooking})} className={`h-[46px] border-4 border-black flex items-center justify-center cursor-pointer gap-2 ${formData.instantBooking ? 'bg-green-500 text-black' : 'bg-white text-gray-400'}`}>
                     <Zap size={16} fill={formData.instantBooking ? "black" : "none"} />
                     <span className="font-black text-xs uppercase">{formData.instantBooking ? "ATIVA" : "OFF"}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t-4 border-black border-dashed">
               <div className="space-y-2">
                  <label className="font-black uppercase text-xs flex items-center gap-1"><Moon size={14}/> Onde o pet dorme?</label>
                  <select value={formData.sleepingArrangement} onChange={e => setFormData({...formData, sleepingArrangement: e.target.value})} className="w-full p-3 border-4 border-black font-bold bg-white cursor-pointer">
                     {sleepingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="font-black uppercase text-xs flex items-center gap-1"><Footprints size={14}/> Passeios</label>
                  <select value={formData.walkRoutine} onChange={e => setFormData({...formData, walkRoutine: e.target.value})} className="w-full p-3 border-4 border-black font-bold bg-white cursor-pointer">
                     {walkOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
               </div>
            </div>
          </section>

          {/* =======================
              BLOCO 4: SAÚDE (NOVO)
             ======================= */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-green-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase rotate-1 flex items-center gap-2"><Syringe size={12}/> Saúde & Veterinária</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
               <div>
                  <label className="font-black uppercase text-xs mb-2 block text-red-600">Vacinas Obrigatórias</label>
                  <div className="flex flex-col gap-2">
                     {vaccineOptions.map(vac => (
                        <label key={vac} className="flex items-center gap-2 cursor-pointer group">
                           <div className={`w-5 h-5 border-4 border-black flex items-center justify-center ${formData.requiredVaccines.includes(vac) ? 'bg-black' : 'bg-white'}`}>
                              {formData.requiredVaccines.includes(vac) && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                           </div>
                           <input type="checkbox" className="hidden" checked={formData.requiredVaccines.includes(vac)} onChange={() => toggleList('requiredVaccines', vac)} />
                           <span className="font-bold text-xs uppercase group-hover:underline">{vac}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="font-black uppercase text-xs mb-2 block text-blue-600 flex items-center gap-1"><Pill size={14}/> Suas Habilidades Médicas</label>
                  <div className="flex flex-wrap gap-2">
                     {skillOptions.map(skill => (
                        <button key={skill} type="button" onClick={() => toggleList('medicalSkills', skill)} className={`px-3 py-2 border-2 border-black font-black text-[10px] uppercase transition-all ${formData.medicalSkills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'}`}>
                           {skill}
                        </button>
                     ))}
                  </div>
                  
                  <div onClick={() => setFormData({...formData, emergencyTransport: !formData.emergencyTransport})} className={`mt-4 cursor-pointer px-4 py-3 border-4 border-black flex items-center gap-3 ${formData.emergencyTransport ? 'bg-red-500 text-white' : 'bg-white'}`}>
                      <Ambulance size={20} />
                      <div>
                         <span className="font-black text-[10px] uppercase block">Transporte de Emergência 24h</span>
                         <span className="text-[9px] font-bold opacity-80 block">Tenho carro disponível para emergências.</span>
                      </div>
                   </div>
               </div>
            </div>
          </section>

          {/* =======================
              BLOCO 5: UPSELL / SERVIÇOS (NOVO)
             ======================= */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-purple-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2 flex items-center gap-2"><DollarSign size={12}/> Serviços Extras (Renda+)</div>
            
            <p className="text-xs font-bold text-gray-500 mt-2 mb-4">Adicione serviços que o cliente pode contratar à parte.</p>

            <div className="space-y-3">
               {formData.services.length > 0 ? (
                  formData.services.map((serv, idx) => (
                     <div key={idx} className="flex items-center justify-between bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                        <span className="font-black uppercase text-sm">{serv.name}</span>
                        <div className="flex items-center gap-4">
                           <span className="font-black text-green-600">R$ {serv.price}</span>
                           <button type="button" onClick={() => removeService(idx)} className="text-red-500 hover:bg-red-100 p-1 rounded"><X size={16}/></button>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="text-center py-6 border-4 border-dashed border-gray-300 font-bold text-xs text-gray-400 uppercase">Nenhum serviço extra cadastrado.</div>
               )}

               {/* Add Service Form */}
               <div className="flex gap-2 items-end pt-2">
                  <div className="flex-1 space-y-1">
                     <label className="font-black uppercase text-[10px]">Nome do Serviço</label>
                     <input placeholder="Ex: Banho Premium" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="w-full p-2 border-4 border-black font-bold text-xs outline-none bg-white uppercase" />
                  </div>
                  <div className="w-24 space-y-1">
                     <label className="font-black uppercase text-[10px]">Preço</label>
                     <input type="number" placeholder="40" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="w-full p-2 border-4 border-black font-bold text-xs outline-none bg-white text-center" />
                  </div>
                  <button onClick={addService} className="h-[42px] px-4 bg-green-500 text-black border-4 border-black font-black hover:translate-y-1 transition-all"><Plus strokeWidth={4}/></button>
               </div>
            </div>
          </section>

          {/* BOTÃO FINAL */}
          <div className="sticky bottom-4 z-50">
             <button disabled={saving} type="submit" className="w-full bg-black text-white border-[6px] border-white ring-4 ring-black p-6 font-black uppercase text-2xl shadow-[15px_15px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-none hover:bg-green-500 hover:text-black transition-all flex items-center justify-center gap-3">
                {saving ? <Loader2 className="animate-spin" /> : <Save size={32} />} 
                {saving ? "PROCESSANDO..." : "SALVAR PERFIL SUPREMO"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}
