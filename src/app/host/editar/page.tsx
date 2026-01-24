"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Plus, X, CheckCircle2, Settings, Sparkles, MapPin, Camera } from "lucide-react";
import Link from "next/link";

export default function EditarHostProPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);
  
  // Estado para nova tag customizada
  const [customFacility, setCustomFacility] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: "",
    city: "",
    neighborhood: "",
    photoUrl: "",
    maxPets: 2,
    extraPetDiscount: 50,
    facilities: [] as string[]
  });

  // Facilidades Padrão
  const defaultFacilities = [
    "Quintal Gramado", "Apartamento Telado", "Veterinária", 
    "Passeios Inclusos", "Câmeras 24h", "Aceita Gatos"
  ];

  // Cidades
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Brasília", "Salvador", "Florianópolis"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "hosts"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setHostId(docData.id);
          // Merge seguro dos dados
          const data = docData.data();
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            price: data.price || "",
            city: data.city || "São Paulo",
            neighborhood: data.neighborhood || "",
            photoUrl: data.photoUrl || "",
            maxPets: data.maxPets || 2,
            extraPetDiscount: data.extraPetDiscount !== undefined ? data.extraPetDiscount : 50,
            facilities: data.facilities || []
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

  const toggleFacility = (item: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(item)
        ? prev.facilities.filter(f => f !== item)
        : [...prev.facilities, item]
    }));
  };

  const addCustomFacility = (e: React.MouseEvent) => {
    e.preventDefault();
    if (customFacility.trim() && !formData.facilities.includes(customFacility)) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, customFacility.trim()]
      }));
      setCustomFacility("");
    }
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
        maxPets: Number(formData.maxPets),
        extraPetDiscount: Number(formData.extraPetDiscount),
        // Atualiza a flag para compatibilidade
        acceptsMultiPetDiscount: Number(formData.extraPetDiscount) > 0
      });
      alert("✅ Perfil atualizado com sucesso!");
      router.push("/painel-host");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white"><Loader2 className="animate-spin mr-2"/> CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-purple-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link href="/painel-host" className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>

        <header className="border-b-[8px] border-black pb-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
            EDITAR <span className="text-purple-600">PRO.</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BLOCO 1: IDENTIDADE E LOCAL */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Dados Básicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do Anúncio</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Foto (URL)</label>
                <input value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50" />
              </div>
            </div>

            <div className="space-y-2">
               <label className="font-black uppercase text-xs">Sobre a Experiência</label>
               <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border-4 border-black font-bold h-32 resize-none outline-none bg-gray-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={12}/> Cidade</label>
                 <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 cursor-pointer appearance-none">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="font-black uppercase text-xs">Bairro</label>
                 <input required value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50" />
               </div>
            </div>
          </section>

          {/* BLOCO 2: REGRAS AVANÇADAS */}
          <section className="border-[6px] border-black p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
             <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Regras & Valores</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Diária (R$)</label>
                   <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 border-4 border-black font-black text-2xl outline-none bg-white" />
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><Settings size={12}/> Capacidade</label>
                   <div className="flex items-center border-4 border-black bg-white">
                      <input required type="number" min="1" max="50" value={formData.maxPets} onChange={e => setFormData({...formData, maxPets: Number(e.target.value)})} className="w-full p-4 font-black text-xl outline-none" />
                      <span className="pr-4 font-bold text-xs uppercase opacity-50">Pets</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><Sparkles size={12}/> Desconto Extra</label>
                   <div className="flex items-center border-4 border-black bg-purple-100">
                      <input required type="number" min="0" max="100" value={formData.extraPetDiscount} onChange={e => setFormData({...formData, extraPetDiscount: Number(e.target.value)})} className="w-full p-4 font-black text-xl outline-none bg-transparent text-purple-800" />
                      <span className="pr-4 font-bold text-xs uppercase opacity-50">% OFF</span>
                   </div>
                </div>
             </div>
          </section>

          {/* BLOCO 3: DIFERENCIAIS DINÂMICOS */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] space-y-6">
             <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Seus Diferenciais</h3>
             
             <div className="space-y-3">
                {/* Lista de Tags */}
                <div className="flex flex-wrap gap-2">
                    {defaultFacilities.map(item => (
                       <button key={item} type="button" onClick={() => toggleFacility(item)} className={`px-3 py-2 border-2 border-black font-black text-[10px] uppercase transition-all flex items-center gap-2 ${formData.facilities.includes(item) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                          {formData.facilities.includes(item) && <CheckCircle2 size={12} className="text-green-500" />} {item}
                       </button>
                    ))}
                    {/* Customizados */}
                    {formData.facilities.filter(f => !defaultFacilities.includes(f)).map(custom => (
                       <button key={custom} type="button" onClick={() => toggleFacility(custom)} className="px-3 py-2 border-2 border-black bg-purple-100 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-red-100 group">
                          <CheckCircle2 size={12} className="text-purple-600" /> {custom} <X size={12} className="opacity-0 group-hover:opacity-100"/>
                       </button>
                    ))}
                </div>

                {/* Input Custom */}
                <div className="flex gap-2 max-w-md mt-4">
                   <input 
                      placeholder="Adicionar novo... Ex: Piscina" 
                      value={customFacility} 
                      onChange={e => setCustomFacility(e.target.value)} 
                      className="flex-1 p-3 border-4 border-black font-bold text-xs outline-none uppercase bg-gray-50"
                      onKeyDown={(e) => { if(e.key === 'Enter') addCustomFacility(e as any) }}
                   />
                   <button onClick={addCustomFacility} className="bg-black text-white px-4 border-4 border-black hover:bg-green-500 hover:text-black transition-all">
                      <Plus strokeWidth={4} />
                   </button>
                </div>
             </div>
          </section>

          <button disabled={saving} type="submit" className="w-full bg-green-500 text-black border-[6px] border-black p-6 font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
             {saving ? <Loader2 className="animate-spin" /> : <Save size={32} />} 
             {saving ? "ATUALIZANDO..." : "SALVAR TUDO"}
          </button>

        </form>
      </div>
    </div>
  );
}