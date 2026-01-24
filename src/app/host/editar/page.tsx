"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditarHostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: "",
    city: "",
    neighborhood: "",
    photoUrl: "",
    maxPets: 2,
    acceptsMultiPetDiscount: false,
    facilities: [] as string[]
  });

  const availableFacilities = ["Quintal Gramado", "Veterinária", "Câmeras 24h", "Passeios Inclusos", "Ar Condicionado", "Transporte Pet"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Busca o perfil do host vinculado a este usuário
        const q = query(collection(db, "hosts"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setHostId(docData.id);
          setFormData({ ...formData, ...docData.data() as any });
        } else {
          // Se não achar perfil, manda criar um
          alert("Perfil de anfitrião não encontrado. Vamos criar um!");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostId) return;
    setSaving(true);

    try {
      const docRef = doc(db, "hosts", hostId);
      await updateDoc(docRef, {
        ...formData,
        price: String(formData.price), // Garante string
        maxPets: Number(formData.maxPets) // Garante numero
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black bg-white"><Loader2 className="animate-spin mr-2"/> CARREGANDO SEUS DADOS...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-purple-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link href="/painel-host" className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>

        <header className="border-b-[8px] border-black pb-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
            EDITAR <span className="text-purple-600">PERFIL.</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BLOCO 1: IDENTIDADE */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do Espaço / Anfitrião</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Link da Foto (URL)</label>
                <input value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-2">
               <label className="font-black uppercase text-xs">Sobre você e o espaço</label>
               <textarea required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-4 border-4 border-black font-bold h-32 resize-none outline-none bg-gray-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="font-black uppercase text-xs">Cidade</label>
                 <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" />
               </div>
               <div className="space-y-2">
                 <label className="font-black uppercase text-xs">Bairro</label>
                 <input required value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" />
               </div>
            </div>
          </section>

          {/* BLOCO 2: REGRAS E PREÇO */}
          <section className="border-[6px] border-black p-8 bg-yellow-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
             <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">Regras de Negócio</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Preço Diária (R$)</label>
                   <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 border-4 border-black font-black text-xl outline-none bg-white" />
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Capacidade Máx (Pets)</label>
                   <input required type="number" value={formData.maxPets} onChange={e => setFormData({...formData, maxPets: Number(e.target.value)})} className="w-full p-4 border-4 border-black font-black text-xl outline-none bg-white" />
                </div>
             </div>

             <div className="flex items-center gap-4 bg-white border-4 border-black p-4 cursor-pointer" onClick={() => setFormData({...formData, acceptsMultiPetDiscount: !formData.acceptsMultiPetDiscount})}>
                <div className={`w-8 h-8 border-4 border-black flex items-center justify-center transition-all ${formData.acceptsMultiPetDiscount ? 'bg-black' : 'bg-white'}`}>
                   {formData.acceptsMultiPetDiscount && <div className="w-4 h-4 bg-green-500"></div>}
                </div>
                <div>
                   <span className="font-black uppercase text-sm block">Aceitar Desconto Matilha?</span>
                   <span className="text-xs font-bold text-gray-500">Se ativo, pets adicionais pagam 50% da diária.</span>
                </div>
             </div>
          </section>

          {/* BLOCO 3: FACILIDADES */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] space-y-6">
             <h3 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4">O que você oferece?</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFacilities.map(f => (
                   <button key={f} type="button" onClick={() => toggleFacility(f)} className={`p-3 border-4 border-black font-black text-[10px] uppercase transition-all ${formData.facilities?.includes(f) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                      {f}
                   </button>
                ))}
             </div>
          </section>

          <button disabled={saving} type="submit" className="w-full bg-green-500 text-black border-[6px] border-black p-6 font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
             {saving ? <Loader2 className="animate-spin" /> : <Save size={32} />} 
             {saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </button>

        </form>
      </div>
    </div>
  );
}