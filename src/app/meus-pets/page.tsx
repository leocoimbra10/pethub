"use client";
import { useState, useEffect } from "react";
import { firestore, useAuth } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, PawPrint } from "lucide-react";
import PetForm from "@/components/PetForm"; 
import { useToast } from "@/hooks/use-toast";

export default function MyPetsPage() {
  const { user, loading: loadingAuth } = useAuth();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePhoto, setActivePhoto] = useState<Record<string, string>>({});
  const router = useRouter();
  const { toast } = useToast();

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
            let fotosArray = [];
            if (Array.isArray(data.fotos)) {
              fotosArray = data.fotos;
            } else if (data.foto) {
              fotosArray = [data.foto]; 
            }
            return { id: d.id, ...data, fotos: fotosArray };
          }));
        } catch (error) {
          console.error("Erro ao buscar pets", error);
          toast({ variant: "destructive", title: "Erro ao buscar seus pets." });
        } finally {
          setLoading(false);
        }
      }
    }
    if (user) {
      fetchPets();
    } else {
        setLoading(false);
    }
  }, [user, loadingAuth, router, toast]);

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
      toast({ title: "Pet adicionado!", description: `${petData.nome} agora faz parte da matilha.` });
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
          const currentImg = activePhoto[pet.id] || (pet.fotos && pet.fotos.length > 0 ? pet.fotos[0] : null);

          return (
            <div key={pet.id} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 relative group">
              
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                  {currentImg ? (
                    <img src={currentImg} alt={pet.nome} className="w-full h-full object-cover transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <PawPrint className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black truncate">{pet.nome}</h3>
                    <button 
                      onClick={() => handleDeletePet(pet.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-500 mb-1">{pet.raca} • {pet.idade}</p>
                  
                  {pet.obs && (
                    <p className="text-xs bg-yellow-50 p-2 border border-yellow-200 rounded text-gray-700 italic line-clamp-2">
                      "{pet.obs}"
                    </p>
                  )}
                </div>
              </div>

              {pet.fotos && pet.fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pt-2 border-t border-gray-100 scrollbar-hide">
                  {pet.fotos.map((f: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActivePhoto(prev => ({ ...prev, [pet.id]: f }))}
                      className={`w-10 h-10 rounded-md border-2 overflow-hidden shrink-0 transition-all ${currentImg === f ? 'border-black ring-1 ring-black scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
