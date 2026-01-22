"use client";
import { useState, useEffect } from "react";
import { firestore, useAuth } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, PawPrint, Save, Loader2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

// === COMPONENTE DO FORMULÁRIO (Separado para corrigir o bug de foco) ===
function PetForm({ onSave, onCancel, saving }: any) {
  // Agora 'fotos' é um array de strings (lista de fotos)
  const [newPet, setNewPet] = useState({ nome: "", raca: "", idade: "", fotos: [] as string[], obs: "" });

  const handleAddPhoto = (url: string) => {
    setNewPet(prev => ({ ...prev, fotos: [...prev.fotos, url] }));
  };

  const handleRemovePhoto = (index: number) => {
    setNewPet(prev => ({ ...prev, fotos: prev.fotos.filter((_, i) => i !== index) }));
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2">
      <h2 className="font-black text-xl mb-4">Novo Aumigo (ou Miaumigo)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
        
        {/* ÁREA DA GALERIA DE FOTOS */}
        <div>
          <label className="block text-xs font-bold mb-2">Galeria de Fotos (Quanto mais, melhor!)</label>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            {newPet.fotos.map((foto, idx) => (
              <div key={idx} className="relative aspect-square border-2 border-black rounded-lg overflow-hidden group">
                <img src={foto} alt="Pet" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Botão de Adicionar Foto (Sempre visível) */}
            <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
               <div className="transform scale-75">
                 <ImageUpload onUpload={handleAddPhoto} />
               </div>
               <span className="text-[10px] font-bold text-gray-400 mt-[-5px]">Adicionar</span>
            </div>
          </div>
        </div>

        {/* CAMPOS DE TEXTO */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-sm">Nome</label>
              <input 
                value={newPet.nome}
                onChange={e => setNewPet({...newPet, nome: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                placeholder="Ex: Rex"
              />
            </div>
            <div>
              <label className="font-bold text-sm">Raça</label>
              <input 
                value={newPet.raca}
                onChange={e => setNewPet({...newPet, raca: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                placeholder="Ex: Vira-lata"
              />
            </div>
          </div>
          
          <div>
              <label className="font-bold text-sm">Idade</label>
              <input 
                type="text"
                value={newPet.idade}
                onChange={e => setNewPet({...newPet, idade: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                placeholder="Ex: 2 anos"
              />
          </div>

          <div>
              <label className="font-bold text-sm">Observações (Marcas, medos, remédios...)</label>
              <textarea 
                value={newPet.obs}
                onChange={e => setNewPet({...newPet, obs: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold h-20 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                placeholder="Descreva detalhes que ajudem a identificar ou cuidar..."
              />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onCancel} className="font-bold text-gray-500 hover:text-black">Cancelar</button>
            <button 
              onClick={() => onSave(newPet)}
              disabled={saving}
              className="bg-black text-white font-black px-6 py-3 rounded-lg border-2 border-transparent hover:bg-[#8B5CF6] hover:border-black transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
              SALVAR PET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// === PÁGINA PRINCIPAL ===
export default function MyPetsPage() {
  const { user, loading: loadingAuth } = useAuth();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // 1. Buscar Pets
  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/login");
      return;
    }
    
    async function fetchPets() {
      if (user) {
        try {
          const q = query(collection(firestore, "users", user.uid, "pets"));
          const snap = await getDocs(q);
          setPets(snap.docs.map(d => {
            const data = d.data();
            // Garante que 'fotos' seja sempre array, mesmo se vier string antiga
            let fotosArray = [];
            if (Array.isArray(data.fotos)) fotosArray = data.fotos;
            else if (data.foto) fotosArray = [data.foto]; // Migração de dado antigo
            
            return { id: d.id, ...data, fotos: fotosArray };
          }));
        } catch (error) {
          console.error("Erro ao buscar pets", error);
        } finally {
          setLoading(false);
        }
      }
    }
    if (user) {
        fetchPets();
    }
  }, [user, loadingAuth, router]);

  // 2. Salvar Novo Pet
  const handleSavePet = async (petData: any) => {
    if (!petData.nome || !petData.raca) {
        toast({ variant: "destructive", title: "Nome e Raça são obrigatórios." });
        return;
    }
    setSaving(true);
    try {
      const docRef = await addDoc(collection(firestore, "users", user!.uid, "pets"), petData);
      setPets([...pets, { id: docRef.id, ...petData }]);
      setShowForm(false);
      toast({ title: "Pet adicionado!", description: `${petData.nome} agora faz parte da família.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao adicionar pet." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("Remover este pet?")) return;
    try {
      await deleteDoc(doc(firestore, "users", user!.uid, "pets", id));
      setPets(pets.filter(p => p.id !== id));
      toast({ title: "Pet removido." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao remover pet." });
    }
  };

  // State para foto ativa no visualizador (mini-galeria)
  const [activePhoto, setActivePhoto] = useState<Record<string, string>>({});

  if (loading || loadingAuth) return <div className="p-10 font-bold text-center">Carregando sua matilha...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 font-bold mb-6 hover:underline">
        <ArrowLeft className="w-5 h-5" /> Voltar
      </button>

      <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
        <h1 className="text-3xl font-black flex items-center gap-2">
          <PawPrint className="w-8 h-8" /> Meus Pets
        </h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#FACC15] text-black font-black px-4 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Adicionar Pet
          </button>
        )}
      </div>

      {showForm && (
        <PetForm 
          onSave={handleSavePet} 
          onCancel={() => setShowForm(false)} 
          saving={saving} 
        />
      )}

      {/* LISTA DE PETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pets.length === 0 && !showForm && (
          <div className="col-span-full text-center py-10 text-gray-400">
            <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-xl">Nenhum pet cadastrado.</p>
            <p className="text-sm">Clique em "Adicionar Pet" para começar.</p>
          </div>
        )}

        {pets.map((pet) => {
          // Lógica simples para mostrar foto principal ou a selecionada
          const currentImg = activePhoto[pet.id] || (pet.fotos && pet.fotos.length > 0 ? pet.fotos[0] : null);

          return (
            <div key={pet.id} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 relative group">
              
              <div className="flex gap-4">
                {/* FOTO PRINCIPAL */}
                <div className="w-24 h-24 rounded-lg border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                  {currentImg ? (
                    <img src={currentImg} alt={pet.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <PawPrint className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* DADOS */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black truncate">{pet.nome}</h3>
                    <button 
                      onClick={() => handleDeletePet(pet.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-500 mb-1">{pet.raca} • {pet.idade}</p>
                  
                  {/* OBSERVAÇÕES */}
                  {pet.obs && (
                    <p className="text-xs bg-yellow-50 p-2 border border-yellow-200 rounded text-gray-700 italic line-clamp-2">
                      "{pet.obs}"
                    </p>
                  )}
                </div>
              </div>

              {/* MINI GALERIA (Se tiver mais de 1 foto) */}
              {pet.fotos && pet.fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pt-2 border-t border-gray-100">
                  {pet.fotos.map((f: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActivePhoto(prev => ({ ...prev, [pet.id]: f }))}
                      className={`w-10 h-10 rounded-md border-2 overflow-hidden shrink-0 ${currentImg === f ? 'border-black ring-1 ring-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={f} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
