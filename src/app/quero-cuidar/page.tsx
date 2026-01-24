"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  DollarSign, MapPin, Camera, CheckCircle2, ArrowRight, 
  Plus, X, Settings, Sparkles 
} from "lucide-react";

export default function QueroCuidarProPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Estado para input de nova facilidade customizada
  const [customFacility, setCustomFacility] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: "",
    city: "São Paulo", // Default
    neighborhood: "",
    photoUrl: "",
    maxPets: 2,
    extraPetDiscount: 50, // Default 50%
    facilities: [] as string[]
  });

  // Lista Padrão (Sugestões)
  const defaultFacilities = [
    "Quintal Gramado", "Apartamento Telado", "Veterinária", 
    "Passeios Inclusos", "Câmeras 24h", "Aceita Gatos"
  ];

  // Cidades Padrão (Mock)
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Brasília", "Salvador", "Florianópolis"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const q = query(collection(db, "hosts"), where("ownerId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          router.push("/painel-host");
        } else {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Adicionar/Remover Facilidades
  const toggleFacility = (item: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(item)
        ? prev.facilities.filter(i => i !== item)
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
    if (!user) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, "hosts"), {
        ...formData,
        ownerId: user.uid,
        email: user.email,
        price: String(formData.price),
        maxPets: Number(formData.maxPets),
        extraPetDiscount: Number(formData.extraPetDiscount),
        // Flag para facilitar a lógica antiga: se desconto > 0, aceita desconto
        acceptsMultiPetDiscount: Number(formData.extraPetDiscount) > 0, 
        rating: 5.0,
        reviews: 0,
        createdAt: serverTimestamp()
      });
      router.push("/painel-host");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase">Verificando...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-200">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        
        <div className="text-center mb-12 space-y-4">
           <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none">
              Cadastro <span className="text-purple-600">Pro.</span>
           </h1>
           <p className="font-bold text-gray-500 max-w-xl mx-auto">
              Configure suas regras, defina seus descontos e mostre seus diferenciais.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 border-[8px] border-black p-8 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
          
          {/* 1. O BÁSICO */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-4 border-dashed border-gray-300 pb-8">
             <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                   <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span> Seu Espaço
                </h3>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Nome do Anúncio</label>
                   <input required placeholder="Ex: Resort do Totó" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 focus:bg-white" />
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Sua Experiência</label>
                   <textarea required placeholder="Conte sobre você..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-3 border-4 border-black font-bold h-32 resize-none outline-none bg-gray-50 focus:bg-white" />
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                   <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span> Localização
                </h3>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={12}/> Cidade</label>
                   {/* SELETOR DE CIDADE PADRONIZADO */}
                   <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 focus:bg-white cursor-pointer appearance-none">
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Bairro</label>
                   <input required placeholder="Ex: Copacabana" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 focus:bg-white" />
                </div>
             </div>
          </section>

          {/* 3. REGRAS DE NEGÓCIO (PREÇO E DESCONTOS) */}
          <section className="space-y-6 border-b-4 border-dashed border-gray-300 pb-8">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span> Regras & Valores
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs text-green-700 flex items-center gap-1"><DollarSign size={12}/> Valor Diária (1 Pet)</label>
                   <input required type="number" placeholder="80" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 border-4 border-black font-black text-2xl outline-none bg-green-50 text-green-700" />
                </div>
                
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><Settings size={12}/> Capacidade Máx.</label>
                   <div className="flex items-center border-4 border-black bg-gray-50">
                      <input required type="number" min="1" max="50" value={formData.maxPets} onChange={e => setFormData({...formData, maxPets: Number(e.target.value)})} className="w-full p-4 font-black text-xl outline-none bg-transparent" />
                      <span className="pr-4 font-bold text-xs uppercase opacity-50">Pets</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="font-black uppercase text-xs text-purple-700 flex items-center gap-1"><Sparkles size={12}/> Desconto Pet Extra (%)</label>
                   <div className="flex items-center border-4 border-black bg-purple-50">
                      <input required type="number" min="0" max="100" value={formData.extraPetDiscount} onChange={e => setFormData({...formData, extraPetDiscount: Number(e.target.value)})} className="w-full p-4 font-black text-xl outline-none bg-transparent text-purple-700" />
                      <span className="pr-4 font-bold text-xs uppercase opacity-50">% OFF</span>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400">0% = Sem desconto. 100% = Grátis.</p>
                </div>
             </div>
          </section>

          {/* 4. DIFERENCIAIS (TAGS DINÂMICAS) */}
          <section className="space-y-6">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">4</span> Diferenciais
             </h3>

             <div className="space-y-2">
                <label className="font-black uppercase text-xs flex items-center gap-1"><Camera size={12}/> Foto do Espaço (URL)</label>
                <input required placeholder="https://..." value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full p-3 border-4 border-black font-bold outline-none bg-gray-50 focus:bg-white" />
             </div>

             <div className="space-y-3 pt-2">
                <label className="font-black uppercase text-xs">O que você oferece? (Selecione ou Adicione)</label>
                
                {/* Lista de Selecionados + Default */}
                <div className="flex flex-wrap gap-2">
                    {defaultFacilities.map(item => (
                       <button key={item} type="button" onClick={() => toggleFacility(item)} className={`px-3 py-2 border-2 border-black font-black text-[10px] uppercase transition-all flex items-center gap-2 ${formData.facilities.includes(item) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                          {formData.facilities.includes(item) && <CheckCircle2 size={12} className="text-green-500" />} {item}
                       </button>
                    ))}
                    
                    {/* Exibir os customizados que já foram adicionados mas não estão na lista default */}
                    {formData.facilities.filter(f => !defaultFacilities.includes(f)).map(custom => (
                       <button key={custom} type="button" onClick={() => toggleFacility(custom)} className="px-3 py-2 border-2 border-black bg-purple-100 font-black text-[10px] uppercase flex items-center gap-2 hover:bg-red-100 group">
                          <CheckCircle2 size={12} className="text-purple-600" /> {custom} <X size={12} className="opacity-0 group-hover:opacity-100"/>
                       </button>
                    ))}
                </div>

                {/* Input para Adicionar Novo */}
                <div className="flex gap-2 max-w-md mt-4">
                   <input 
                      placeholder="Outro? Ex: Piscina de Bolinhas" 
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

          <button disabled={submitting} type="submit" className="w-full bg-green-500 text-black border-[6px] border-black p-6 font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
             {submitting ? "PUBLICANDO..." : "PUBLICAR ANÚNCIO PRO"} <ArrowRight strokeWidth={3} />
          </button>

        </form>
      </div>
    </div>
  );
}