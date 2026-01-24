"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, Loader2, Plus, X, CheckCircle2, 
  Settings, Sparkles, MapPin, Dog, Cat, Bird, ShieldAlert, Scale
} from "lucide-react";
import Link from "next/link";

export default function EditarHostElitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);
  
  // Inputs temporários
  const [customFacility, setCustomFacility] = useState("");
  const [customExotic, setCustomExotic] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: "",
    city: "",
    neighborhood: "",
    photoUrl: "",
    // Capacidade Granular
    maxDogs: 2,
    maxCats: 0,
    // Regras Avançadas
    extraPetDiscount: 40,
    acceptedSizes: ["Pequeno", "Médio"] as string[],
    acceptedExotics: [] as string[], // Hamster, Cobra, etc.
    onlyNeutered: false, // Apenas castrados
    acceptsPuppies: true, // Aceita filhotes
    supervision24h: true,
    facilities: [] as string[]
  });

  // Opções Estáticas
  const defaultFacilities = ["Quintal Gramado", "Apartamento Telado", "Veterinária", "Passeios Inclusos", "Câmeras 24h"];
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Brasília", "Salvador", "Florianópolis"];
  const petSizes = ["Pequeno (até 10kg)", "Médio (10-25kg)", "Grande (25-45kg)", "Gigante (+45kg)"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "hosts"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setHostId(docData.id);
          const data = docData.data();
          setFormData({
            ...formData, // Mantém defaults novos
            ...data as any, // Sobrescreve com dados do banco
            // Garante que campos novos não quebrem se não existirem no banco
            maxDogs: data.maxDogs ?? 2,
            maxCats: data.maxCats ?? 0,
            acceptedSizes: data.acceptedSizes ?? ["Pequeno"],
            acceptedExotics: data.acceptedExotics ?? [],
            onlyNeutered: data.onlyNeutered ?? false,
          });
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

  // Handlers Genéricos
  const toggleItem = (listName: 'facilities' | 'acceptedSizes', item: string) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].includes(item)
        ? prev[listName].filter(f => f !== item)
        : [...prev[listName], item]
    }));
  };

  const addToList = (e: React.MouseEvent, listName: 'facilities' | 'acceptedExotics', value: string, setter: any) => {
    e.preventDefault();
    if (value.trim() && !formData[listName].includes(value)) {
      setFormData(prev => ({ ...prev, [listName]: [...prev[listName], value.trim()] }));
      setter("");
    }
  };

  const removeFromList = (listName: 'facilities' | 'acceptedExotics', item: string) => {
    setFormData(prev => ({ ...prev, [listName]: prev[listName].filter(i => i !== item) }));
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
        // Campo legado para compatibilidade
        maxPets: Number(formData.maxDogs) + Number(formData.maxCats),
        acceptsMultiPetDiscount: Number(formData.extraPetDiscount) > 0
      });
      alert("✅ Regras atualizadas com sucesso!");
      router.push("/painel-host");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white"><Loader2 className="animate-spin mr-2"/> CARREGANDO REGRAS...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-purple-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link href="/painel-host" className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>

        <header className="border-b-[8px] border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              EDITAR <span className="text-purple-600">ELITE.</span>
            </h1>
            <p className="font-bold text-gray-400 mt-2 uppercase text-xs">Configure suas regras de hospedagem detalhadas</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* 1. DADOS GERAIS (Identidade) */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Identidade & Local</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do Anúncio</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={12}/> Cidade</label>
                <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 cursor-pointer">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
               <label className="font-black uppercase text-xs">Bio (Experiência)</label>
               <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border-4 border-black font-bold h-24 resize-none outline-none bg-gray-50" />
            </div>
          </section>

          {/* 2. REGRAS DE CAPACIDADE (O CORAÇÃO DA ATUALIZAÇÃO) */}
          <section className="border-[6px] border-black p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
             <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                <Settings className="w-8 h-8" />
                <h3 className="text-3xl font-black uppercase italic">Regras da Casa</h3>
             </div>
             
             {/* Grid Alinhado */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Preço Base */}
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Diária Base (R$)</label>
                   <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 border-4 border-black font-black text-2xl outline-none bg-white text-center" />
                </div>

                {/* Capacidade Cães */}
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><Dog size={12}/> Máx. Cães</label>
                   <select value={formData.maxDogs} onChange={e => setFormData({...formData, maxDogs: Number(e.target.value)})} className="w-full p-4 border-4 border-black font-black text-xl outline-none bg-white cursor-pointer text-center appearance-none">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>

                {/* Capacidade Gatos */}
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><Cat size={12}/> Máx. Gatos</label>
                   <select value={formData.maxCats} onChange={e => setFormData({...formData, maxCats: Number(e.target.value)})} className="w-full p-4 border-4 border-black font-black text-xl outline-none bg-white cursor-pointer text-center appearance-none">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                   </select>
                </div>

                {/* Desconto Extra */}
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><Sparkles size={12}/> Desconto Extra</label>
                   <div className="flex items-center border-4 border-black bg-purple-100 h-[68px]"> {/* Altura fixa para alinhar */}
                      <input required type="number" min="0" max="100" value={formData.extraPetDiscount} onChange={e => setFormData({...formData, extraPetDiscount: Number(e.target.value)})} className="w-full h-full p-4 font-black text-xl outline-none bg-transparent text-purple-800 text-center" />
                      <span className="pr-4 font-bold text-xs uppercase opacity-50">%OFF</span>
                   </div>
                </div>
             </div>

             {/* Porte Aceito */}
             <div className="space-y-3 pt-4 border-t-4 border-black border-dashed">
                <label className="font-black uppercase text-xs flex items-center gap-1"><Scale size={14}/> Que tamanhos você aceita?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {petSizes.map(size => {
                      const simpleSize = size.split(' ')[0]; // Pega só a primeira palavra pra lógica
                      return (
                        <button key={size} type="button" onClick={() => toggleItem('acceptedSizes', simpleSize)} className={`p-3 border-4 border-black font-black text-[10px] uppercase transition-all ${formData.acceptedSizes.includes(simpleSize) ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}>
                            {formData.acceptedSizes.includes(simpleSize) && <CheckCircle2 size={12} className="inline mr-1 text-green-500"/>} 
                            {size}
                        </button>
                      )
                   })}
                </div>
             </div>

             {/* Animais Exóticos */}
             <div className="space-y-3">
                <label className="font-black uppercase text-xs flex items-center gap-1"><Bird size={14}/> Outros Animais (Exóticos)</label>
                <div className="flex flex-wrap gap-2">
                   {formData.acceptedExotics.map(exo => (
                      <span key={exo} className="px-3 py-2 bg-purple-600 text-white border-2 border-black font-black text-[10px] uppercase flex items-center gap-2">
                         {exo} <button type="button" onClick={() => removeFromList('acceptedExotics', exo)}><X size={12}/></button>
                      </span>
                   ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                   <input placeholder="Ex: Hamster, Coelho..." value={customExotic} onChange={e => setCustomExotic(e.target.value)} className="flex-1 p-2 border-4 border-black font-bold text-xs outline-none uppercase bg-white" />
                   <button onClick={(e) => addToList(e, 'acceptedExotics', customExotic, setCustomExotic)} className="bg-black text-white px-3 border-4 border-black hover:bg-green-500"><Plus size={16}/></button>
                </div>
             </div>

             {/* Restrições (Toggles) */}
             <div className="space-y-3 pt-4 border-t-4 border-black border-dashed">
                <label className="font-black uppercase text-xs flex items-center gap-1"><ShieldAlert size={14}/> Restrições & Segurança</label>
                <div className="flex flex-wrap gap-4">
                   <div onClick={() => setFormData({...formData, onlyNeutered: !formData.onlyNeutered})} className={`cursor-pointer px-4 py-3 border-4 border-black flex items-center gap-3 ${formData.onlyNeutered ? 'bg-red-500 text-white' : 'bg-white'}`}>
                      <div className={`w-4 h-4 border-2 border-black ${formData.onlyNeutered ? 'bg-black' : 'bg-white'}`}></div>
                      <span className="font-black text-[10px] uppercase">Apenas Castrados</span>
                   </div>
                   
                   <div onClick={() => setFormData({...formData, supervision24h: !formData.supervision24h})} className={`cursor-pointer px-4 py-3 border-4 border-black flex items-center gap-3 ${formData.supervision24h ? 'bg-green-500 text-black' : 'bg-white'}`}>
                      <div className={`w-4 h-4 border-2 border-black ${formData.supervision24h ? 'bg-black' : 'bg-white'}`}></div>
                      <span className="font-black text-[10px] uppercase">Supervisão 24h</span>
                   </div>
                </div>
             </div>
          </section>

          {/* 3. DIFERENCIAIS (TAGS) */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] space-y-6">
             <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Diferenciais</h3>
             <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {defaultFacilities.map(item => (
                       <button key={item} type="button" onClick={() => toggleItem('facilities', item)} className={`px-3 py-2 border-2 border-black font-black text-[10px] uppercase transition-all flex items-center gap-2 ${formData.facilities.includes(item) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                          {item}
                       </button>
                    ))}
                    {formData.facilities.filter(f => !defaultFacilities.includes(f)).map(custom => (
                       <button key={custom} type="button" onClick={() => removeFromList('facilities', custom)} className="px-3 py-2 border-2 border-black bg-purple-100 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-red-100 group">
                          {custom} <X size={12} className="opacity-0 group-hover:opacity-100"/>
                       </button>
                    ))}
                </div>
                <div className="flex gap-2 max-w-md mt-4">
                   <input placeholder="Adicionar diferencial..." value={customFacility} onChange={e => setCustomFacility(e.target.value)} className="flex-1 p-3 border-4 border-black font-bold text-xs outline-none uppercase bg-gray-50" />
                   <button onClick={(e) => addToList(e, 'facilities', customFacility, setCustomFacility)} className="bg-black text-white px-4 border-4 border-black hover:bg-green-500"><Plus strokeWidth={4} /></button>
                </div>
             </div>
          </section>

          <button disabled={saving} type="submit" className="w-full bg-green-500 text-black border-[6px] border-black p-6 font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
             {saving ? <Loader2 className="animate-spin" /> : <Save size={32} />} 
             {saving ? "SALVANDO..." : "ATUALIZAR REGRAS"}
          </button>

        </form>
      </div>
    </div>
  );
}