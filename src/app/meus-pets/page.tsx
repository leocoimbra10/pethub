"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, PawPrint, Save, Loader2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function MyPetsPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const nomeRef = useRef<HTMLInputElement>(null);
  const racaRef = useRef<HTMLInputElement>(null);
  const idadeRef = useRef<HTMLInputElement>(null);
  const obsRef = useRef<HTMLTextAreaElement>(null);
  
  const [fotos, setFotos] = useState<string[]>([]);

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
          const q = query(collection(db, "users", user.uid, "pets"));
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
      } else {
        setLoading(false);
      }
    }
    if (user) {
      fetchPets();
    }
  }, [user, loadingAuth, router, toast]);

  const handleAddPhoto = (url: string) => {
    setFotos(prev => [...prev, url]);
  };

  const handleRemovePhoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePet = async () => {
    const nome = nomeRef.current?.value;
    const raca = racaRef.current?.value;
    const idade = idadeRef.current?.value;
    const obs = obsRef.current?.value;

    if (!nome || !raca) {
      toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Por favor, preencha o nome e a raça.' });
      return;
    }
    
    setSaving(true);
    try {
      const newPetData = { nome, raca, idade, obs, fotos };
      
      const docRef = await addDoc(collection(db, "users", user!.uid, "pets"), newPetData);
      setPets(prev => [...prev, { id: docRef.id, ...newPetData }]);
      
      toast({ title: 'Pet salvo!', description: `${nome} foi adicionado(a) à sua matilha.` });

      if (nomeRef.current) nomeRef.current.value = "";
      if (racaRef.current) racaRef.current.value = "";
      if (idadeRef.current) idadeRef.current.value = "";
      if (obsRef.current) obsRef.current.value = "";
      setFotos([]);
      
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao salvar pet', description: 'Não foi possível adicionar o pet.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("Tem certeza que quer remover este pet?")) return;
    try {
      await deleteDoc(doc(db, "users", user!.uid, "pets", id));
      setPets(pets.filter(p => p.id !== id));
      toast({ title: 'Pet removido com sucesso.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao remover pet.' });
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
        <div className="bg-white border-2 border-black rounded-xl p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2">
          <h2 className="font-black text-xl mb-4">Novo Aumigo (ou Miaumigo)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
            
            <div>
              <label className="block text-xs font-bold mb-2">Galeria de Fotos</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {fotos.map((foto, idx) => (
                  <div key={idx} className="relative aspect-square border-2 border-black rounded-lg overflow-hidden group">
                    <img src={foto} alt="Pet" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                   <div className="transform scale-75">
                     <ImageUpload onUpload={handleAddPhoto} />
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 mt-[-5px]">Adicionar</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-sm">Nome</label>
                  <input 
                    ref={nomeRef}
                    className="w-full p-2 border-2 border-black rounded-lg font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="Ex: Rex"
                  />
                </div>
                <div>
                  <label className="font-bold text-sm">Raça</label>
                  <input 
                    ref={racaRef}
                    className="w-full p-2 border-2 border-black rounded-lg font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="Ex: Vira-lata"
                  />
                </div>
              </div>
              
              <div>
                  <label className="font-bold text-sm">Idade</label>
                  <input 
                    ref={idadeRef}
                    className="w-full p-2 border-2 border-black rounded-lg font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="Ex: 2 anos"
                  />
              </div>

              <div>
                  <label className="font-bold text-sm">Observações</label>
                  <textarea 
                    ref={obsRef}
                    className="w-full p-2 border-2 border-black rounded-lg font-bold h-20 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="Detalhes..."
                  />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="font-bold text-gray-500 hover:text-black">Cancelar</button>
                <button 
                  onClick={handleSavePet}
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pets.length === 0 && !showForm && (
          <div className="col-span-full text-center py-10 text-gray-400">
            <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-bold text-xl">Nenhum pet cadastrado.</p>
          </div>
        )}

        {pets.map((pet) => {
          const currentImg = activePhoto[pet.id] || (pet.fotos && pet.fotos.length > 0 ? pet.fotos[0] : null);

          return (
            <div key={pet.id} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 relative group">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                  {currentImg ? (
                    <img src={currentImg} alt={pet.nome} className="w-full h-full object-cover" />
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
