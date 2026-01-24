"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { DollarSign, Heart, MapPin, Camera, CheckCircle2, ArrowRight } from "lucide-react";

export default function QueroCuidarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: "",
    city: "",
    neighborhood: "",
    photoUrl: "",
    facilities: [] as string[]
  });

  // Lista de facilidades para marcar
  const facilitiesOptions = [
    "Quintal Gramado", "Apartamento Telado", "Veterinária", 
    "Passeios Inclusos", "Câmeras 24h", "Aceita Gatos"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // VERIFICAÇÃO DE SEGURANÇA: O usuário já é host?
        // Se sim, não deixa criar outro, manda pro painel.
        const q = query(collection(db, "hosts"), where("ownerId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          router.push("/painel-host");
        } else {
          setLoading(false); // Libera o formulário
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleFacility = (item: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(item)
        ? prev.facilities.filter(i => i !== item)
        : [...prev.facilities, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      // O PULO DO GATO: Salvando com o ID correto
      await addDoc(collection(db, "hosts"), {
        ...formData,
        ownerId: user.uid, // VÍNCULO CRÍTICO
        email: user.email,
        price: String(formData.price),
        maxPets: 2, // Default
        acceptsMultiPetDiscount: false, // Default
        rating: 5.0, // Começa bem
        reviews: 0,
        createdAt: serverTimestamp()
      });

      // Redireciona para o painel de sucesso
      router.push("/painel-host");
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black bg-white uppercase">
      Verificando Elegibilidade...
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-green-200">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* HEADER */}
        <div className="text-center mb-12 space-y-4">
           <div className="inline-block bg-green-500 text-black border-4 border-black px-4 py-1 font-black text-xs uppercase transform -rotate-2">
              Renda Extra
           </div>
           <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none">
              Ganhe Dinheiro <br/> <span className="text-purple-600">Amando Pets.</span>
           </h1>
           <p className="font-bold text-gray-500 max-w-xl mx-auto">
              Transforme seu espaço em um hotel 5 estrelas. Defina suas regras, seus preços e receba hóspedes peludos.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 border-[6px] border-black p-8 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
          
          {/* 1. O BÁSICO */}
          <section className="space-y-6">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                Seu Espaço
             </h3>
             
             <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do seu "Hotel"</label>
                <input required placeholder="Ex: Cantinho da Alegria" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50 focus:bg-white transition-all" />
             </div>

             <div className="space-y-2">
                <label className="font-black uppercase text-xs">Descreva sua experiência</label>
                <textarea required placeholder="Tenho quintal grande, amo cachorros..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-4 border-4 border-black font-bold h-32 resize-none outline-none bg-gray-50 focus:bg-white transition-all" />
             </div>
          </section>

          {/* 2. LOCAL E PREÇO */}
          <section className="space-y-6">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                Local & Valor
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={12}/> Cidade</label>
                   <input required placeholder="São Paulo" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" />
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs">Bairro</label>
                   <input required placeholder="Vila Madalena" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" />
                </div>
                <div className="space-y-2">
                   <label className="font-black uppercase text-xs flex items-center gap-1"><DollarSign size={12}/> Preço Diária</label>
                   <input required type="number" placeholder="80" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 border-4 border-black font-black text-xl outline-none bg-green-50 text-green-700" />
                </div>
             </div>
          </section>

          {/* 3. FOTO E DETALHES */}
          <section className="space-y-6">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
                Foto & Diferenciais
             </h3>

             <div className="space-y-2">
                <label className="font-black uppercase text-xs flex items-center gap-1"><Camera size={12}/> Foto de Capa (URL)</label>
                <input required placeholder="https://..." value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full p-4 border-4 border-black font-bold outline-none bg-gray-50" />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {facilitiesOptions.map(item => (
                   <button key={item} type="button" onClick={() => toggleFacility(item)} className={`p-3 border-4 border-black font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${formData.facilities.includes(item) ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                      {formData.facilities.includes(item) && <CheckCircle2 size={12} className="text-green-500" />} {item}
                   </button>
                ))}
             </div>
          </section>

          <button disabled={submitting} type="submit" className="w-full bg-yellow-400 text-black border-[6px] border-black p-6 font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
             {submitting ? "CRIANDO PERFIL..." : "PUBLICAR MEU PERFIL"} <ArrowRight strokeWidth={3} />
          </button>

        </form>
      </div>
    </div>
  );
}