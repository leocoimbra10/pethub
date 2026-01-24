"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, Loader2, Plus, X, CheckCircle2, 
  Settings, Sparkles, MapPin, Dog, Cat, Bird, ShieldAlert, Scale,
  Clock, Moon, Footprints, Syringe, Ambulance, Pill, Zap, DollarSign, Calculator
} from "lucide-react";
import Link from "next/link";

export default function EditarHostUltimatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);
  
  const [customExotic, setCustomExotic] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    city: "São Paulo",
    neighborhood: "",
    photoUrl: "",
    price: "",
    maxDogs: 2,
    maxCats: 0,
    extraPetDiscount: 40,
    acceptedSizes: ["Pequeno", "Médio"] as string[],
    acceptedExotics: [] as string[],
    facilities: [] as string[],
    checkInStart: "08:00",
    checkInEnd: "20:00",
    checkOutMax: "12:00",
    instantBooking: false,
    sleepingArrangement: "Caminha Própria",
    walkRoutine: "1x ao dia (20min)",
    requiredVaccines: ["V10/V8", "Antirrábica"] as string[],
    medicalSkills: [] as string[],
    emergencyTransport: false,
    acceptedBehaviors: [] as string[],
    onlyNeutered: false,
    supervision24h: true,
    services: [] as { name: string, price: number }[]
  });

  // --- Listas Estáticas ---
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
            price: data.price || "80", // Default value string
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

  // --- Handlers ---
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
    setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
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
        maxPets: Number(formData.maxDogs) + Number(formData.maxCats),
        acceptsMultiPetDiscount: Number(formData.extraPetDiscount) > 0
      });
      alert("✅ Perfil Atualizado com Sucesso!");
      router.push("/painel-host");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  // --- LÓGICA DO SIMULADOR (MATH ENGINE) ---
  const basePrice = Number(formData.price) || 0;
  const discount = Number(formData.extraPetDiscount) || 0;
  const extraPetPrice = basePrice * (1 - discount / 100);
  const twoPetsTotal = basePrice + extraPetPrice;

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white"><Loader2 className="animate-spin mr-2"/> CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-purple-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
            <Link href="/painel-host" className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
            <ArrowLeft size={16} /> Voltar ao Painel
            </Link>
        </div>

        <header className="border-b-[8px] border-black pb-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              Editar <span className="text-purple-600">Perfil.</span>
            </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* 1. IDENTIDADE */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2">Identidade</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do Espaço</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Cidade</label>
                <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 cursor-pointer">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
               <label className="font-black uppercase text-xs">Bio</label>
               <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border-4 border-black font-bold h-24 resize-none outline-none bg-gray-50" />
            </div>
          </section>

          {/* =======================
              BLOCO 2: REGRAS & CALCULADORA (O PULO DO GATO)
             ======================= */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
             <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase rotate-1">Regras & Valores</div>
             
             {/* INPUTS PRINCIPAIS */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px]">Diária Base (1 Pet)</label>
                   <div className="flex items-center border-4 border-black bg-white h-[56px]">
                      <span className="pl-3 font-bold text-xs">R$</span>
                      <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full h-full p-2 font-black text-xl bg-transparent outline-none" />
                   </div>
                </div>
                
                {/* Desconto Extra */}
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px] text-purple-800 flex items-center gap-1"><Sparkles size={10}/> Desconto 2º Pet+</label>
                   <div className="flex items-center border-4 border-black bg-purple-100 h-[56px]">
                      <input required type="number" min="0" max="100" value={formData.extraPetDiscount} onChange={e => setFormData({...formData, extraPetDiscount: Number(e.target.value)})} className="w-full h-full p-2 font-black text-xl bg-transparent text-purple-800 text-center outline-none" />
                      <span className="pr-3 font-bold text-[10px] uppercase opacity-50">%OFF</span>
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px]">Máx. Cães</label>
                   <select value={formData.maxDogs} onChange={e => setFormData({...formData, maxDogs: Number(e.target.value)})} className="w-full h-[56px] border-4 border-black font-black text-xl bg-white cursor-pointer text-center">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="font-black uppercase text-[10px]">Máx. Gatos</label>
                   <select value={formData.maxCats} onChange={e => setFormData({...formData, maxCats: Number(e.target.value)})} className="w-full h-[56px] border-4 border-black font-black text-xl bg-white cursor-pointer text-center">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>
             </div>

             {/* SIMULADOR DE GANHOS (VISUAL FEEDBACK) */}
             <div className="mt-6 bg-white border-4 border-black p-4 relative">
                <div className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase flex items-center gap-1">
                   <Calculator size={10} /> Simulador de Ganhos
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                   <div className="text-sm font-bold border-r-0 md:border-r-2 border-dashed border-gray-300 pr-4">
                      <p className="mb-2 uppercase text-[10px] text-gray-500 font-black">Como funciona o cálculo:</p>
                      <ul className="space-y-1 list-disc list-inside">
                         <li>1º Pet paga <strong className="text-black">100%</strong> (R$ {basePrice})</li>
                         <li>2º Pet em diante paga <strong className="text-purple-600">{100 - discount}%</strong> (R$ {extraPetPrice.toFixed(0)})</li>
                         <li className="text-[10px] italic opacity-70">Válido para cães e gatos misturados.</li>
                      </ul>
                   </div>
                   
                   <div className="bg-gray-50 p-3 border-2 border-black border-dashed text-center">
                      <p className="text-[10px] font-black uppercase mb-1">Exemplo: Hospedando 2 Pets</p>
                      <div className="flex justify-center items-center gap-2 text-2xl font-black">
                         <span>R$ {twoPetsTotal.toFixed(0)}</span>
                         <span className="text-[10px] bg-green-200 text-green-800 px-1 border border-green-800 rounded">DIÁRIA TOTAL</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">(Ao invés de R$ {(basePrice * 2).toFixed(0)})</p>
                   </div>
                </div>
             </div>

             {/* Restrições */}
             <div className="mt-6 pt-4 border-t-4 border-black border-dashed flex flex-wrap gap-2">
                <label className="font-black uppercase text-xs flex items-center gap-2 mr-4"><Scale size={14}/> Portes Aceitos:</label>
                {petSizes.map(size => {
                   const s = size.split(' ')[0];
                   return (
                     <button key={size} type="button" onClick={() => toggleList('acceptedSizes', s)} className={`px-2 py-1 border-2 border-black font-black text-[10px] uppercase transition-all ${formData.acceptedSizes.includes(s) ? 'bg-black text-white' : 'bg-white hover:bg-white/50'}`}>
                         {formData.acceptedSizes.includes(s) && "✓ "} {size}
                     </button>
                   )
                })}
             </div>
          </section>

          {/* 3. LOGÍSTICA & SAÚDE (Mantidos iguais para economizar espaço, mas incluídos) */}
          <section className="border-[6px] border-black p-6 md:p-8 bg-blue-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2">Logística</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
               <div className="space-y-1"><label className="font-black text-[10px]">Check-in Início</label><input type="time" value={formData.checkInStart} onChange={e => setFormData({...formData, checkInStart: e.target.value})} className="w-full p-2 border-4 border-black font-bold bg-white" /></div>
               <div className="space-y-1"><label className="font-black text-[10px]">Check-in Fim</label><input type="time" value={formData.checkInEnd} onChange={e => setFormData({...formData, checkInEnd: e.target.value})} className="w-full p-2 border-4 border-black font-bold bg-white" /></div>
               <div className="space-y-1"><label className="font-black text-[10px] text-red-600">Checkout Máx.</label><input type="time" value={formData.checkOutMax} onChange={e => setFormData({...formData, checkOutMax: e.target.value})} className="w-full p-2 border-4 border-black font-bold bg-white text-red-600" /></div>
            </div>
          </section>

          <section className="border-[6px] border-black p-6 md:p-8 bg-purple-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-5 -left-2 bg-black text-white px-4 py-1 font-black text-xs uppercase -rotate-2">Upsell (Serviços)</div>
            <div className="space-y-3 mt-4">
               {formData.services.map((serv, idx) => (
                  <div key={idx} className="flex justify-between bg-white border-4 border-black p-3"><span className="font-black uppercase text-sm">{serv.name}</span><div className="flex gap-4"><span className="font-black text-green-600">R$ {serv.price}</span><button type="button" onClick={() => removeService(idx)} className="text-red-500"><X size={16}/></button></div></div>
               ))}
               <div className="flex gap-2 items-end pt-2">
                  <input placeholder="Ex: Banho" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="flex-1 p-2 border-4 border-black font-bold text-xs uppercase bg-white" />
                  <input type="number" placeholder="R$" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="w-20 p-2 border-4 border-black font-bold text-xs text-center bg-white" />
                  <button onClick={addService} className="h-[36px] px-3 bg-green-500 border-4 border-black"><Plus strokeWidth={4}/></button>
               </div>
            </div>
          </section>

          {/* BOTÃO SALVAR */}
          <div className="sticky bottom-4 z-50">
             <button disabled={saving} type="submit" className="w-full bg-black text-white border-[6px] border-white ring-4 ring-black p-6 font-black uppercase text-2xl shadow-[15px_15px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-none hover:bg-green-500 hover:text-black transition-all flex items-center justify-center gap-3">
                {saving ? <Loader2 className="animate-spin" /> : <Save size={32} />} 
                {saving ? "PROCESSANDO..." : "SALVAR ALTERAÇÕES"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}