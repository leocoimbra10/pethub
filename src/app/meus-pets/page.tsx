"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  // Novos campos de saúde
  healthConditions?: string;
  medications?: string;
  vaccinated?: boolean;
}

export default function MyPetsPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Estados do Formulário
  const [editingId, setEditingId] = useState<string | null>(null); // ID do pet sendo editado
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Cachorro");
  const [newBreed, setNewBreed] = useState("");
  const [newAge, setNewAge] = useState("");
  // Novos estados para os campos de saúde
  const [newHealthConditions, setNewHealthConditions] = useState("");
  const [newMedications, setNewMedications] = useState("");
  const [newVaccinated, setNewVaccinated] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Verificar Login e Carregar Pets
  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const fetchPets = async (userId: string) => {
      try {
        const q = query(collection(db, "users", userId, "pets"));
        const querySnapshot = await getDocs(q);
        const petsList: Pet[] = [];
        querySnapshot.forEach((doc) => {
          petsList.push({ id: doc.id, ...doc.data() } as Pet);
        });
        setPets(petsList);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        toast({ variant: "destructive", title: "Erro ao buscar pets." });
      } finally {
        setLoading(false);
      }
    };
    fetchPets(user.uid);
  }, [user, loadingAuth, router, toast]);

  // 2. Preencher formulário para Edição
  const handleEditClick = (pet: Pet) => {
    setEditingId(pet.id);
    setNewName(pet.name);
    setNewType(pet.type);
    setNewBreed(pet.breed);
    setNewAge(pet.age);
    setNewHealthConditions(pet.healthConditions || "");
    setNewMedications(pet.medications || "");
    setNewVaccinated(pet.vaccinated || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Cancelar Edição
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewName("");
    setNewType("Cachorro");
    setNewBreed("");
    setNewAge("");
    setNewHealthConditions("");
    setNewMedications("");
    setNewVaccinated(false);
  };

  // 4. Salvar (Criar ou Atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const petData = {
      name: newName,
      type: newType,
      breed: newBreed,
      age: newAge,
      healthConditions: newHealthConditions,
      medications: newMedications,
      vaccinated: newVaccinated,
      ownerUid: user.uid,
    };

    try {
      if (editingId) {
        const petRef = doc(db, "users", user.uid, "pets", editingId);
        await updateDoc(petRef, { ...petData, updatedAt: new Date() });
        toast({ title: "Pet atualizado com sucesso!" });
      } else {
        await addDoc(collection(db, "users", user.uid, "pets"), { ...petData, createdAt: new Date() });
        toast({ title: "Pet adicionado com sucesso!" });
      }
      
      handleCancelEdit();
      // Re-fetch pets after submission
      const q = query(collection(db, "users", user.uid, "pets"));
      const querySnapshot = await getDocs(q);
      const petsList: Pet[] = [];
      querySnapshot.forEach((doc) => {
        petsList.push({ id: doc.id, ...doc.data() } as Pet);
      });
      setPets(petsList);

    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      toast({ variant: "destructive", title: "Erro ao salvar pet." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Deletar Pet
  const handleDeletePet = async (petId: string) => {
    if (!user || !confirm("Tem certeza que quer remover este pet?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "pets", petId));
      setPets(pets.filter(pet => pet.id !== petId));
      toast({ title: "Pet removido." });
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      toast({ variant: "destructive", title: "Erro ao remover pet." });
    }
  };

  if (loading || loadingAuth) return (
      <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-black hover:underline decoration-2">
            ← Voltar ao Painel
          </Link>
          <h1 className="text-4xl font-black text-black">Meus Pets 🐶</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-24 transition-colors ${editingId ? 'bg-secondary/20' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className={`p-1 rounded border-2 border-black text-sm ${editingId ? 'bg-secondary' : 'bg-primary/20'}`}>
                  {editingId ? <Pencil size={14}/> : <Plus size={14}/>}
                </span> 
                {editingId ? 'Editar Pet' : 'Adicionar Pet'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Nome do Pet *</label>
                  <input 
                    type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-bold mb-1">Tipo</label>
                    <select 
                        value={newType} onChange={e => setNewType(e.target.value)}
                        className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                    >
                        <option value="Cachorro">🐶 Cão</option>
                        <option value="Gato">🐱 Gato</option>
                        <option value="Outro">🦜 Outro</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-bold mb-1">Idade</label>
                    <input 
                        type="text" value={newAge} onChange={e => setNewAge(e.target.value)}
                        className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                        placeholder="Ex: 2 anos"
                    />
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Raça</label>
                  <input 
                    type="text" value={newBreed} onChange={e => setNewBreed(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                  />
                </div>

                <div className="border-t-2 border-black pt-4 mt-4">
                    <h3 className="font-bold mb-2">🏥 Saúde & Cuidados</h3>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">Condições de Saúde / Alergias</label>
                        <textarea
                            value={newHealthConditions} onChange={e => setNewHealthConditions(e.target.value)}
                            className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white resize-none h-20 text-sm"
                            placeholder="Ex: Alérgico a frango, tem displasia..."
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">Medicamentos Contínuos</label>
                        <textarea
                            value={newMedications} onChange={e => setNewMedications(e.target.value)}
                            className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white resize-none h-20 text-sm"
                            placeholder="Ex: Remédio X todo dia às 8h..."
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 p-2 rounded border-2 border-black">
                        <input
                            type="checkbox" id="vaccinated"
                            checked={newVaccinated} onChange={e => setNewVaccinated(e.target.checked)}
                            className="w-5 h-5 text-primary border-2 border-black rounded focus:ring-primary cursor-pointer"
                        />
                        <label htmlFor="vaccinated" className="text-sm font-bold cursor-pointer flex-1">
                            Vacinas estão em dia? 💉
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    type="submit" disabled={isSubmitting}
                    className={`w-full text-white font-bold py-3 px-4 rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all ${editingId ? 'bg-secondary text-secondary-foreground' : 'bg-primary'}`}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : (editingId ? "Atualizar Pet" : "Salvar Pet")}
                  </button>

                  {editingId && (
                    <button 
                      type="button" onClick={handleCancelEdit}
                      className="w-full bg-white text-gray-600 font-bold py-2 px-4 rounded border-2 border-gray-300 hover:bg-gray-100 hover:border-black transition-all flex items-center justify-center gap-2"
                    >
                      <X size={16}/> Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between gap-4 group hover:bg-gray-50 transition relative">
                {editingId === pet.id && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-16 bg-secondary rounded-r border-y-2 border-r-2 border-black"></div>
                )}
                <div className="flex gap-4 flex-1">
                  <div className={`w-16 h-16 rounded-full border-2 border-black flex items-center justify-center text-3xl shrink-0 ${pet.type === 'Gato' ? 'bg-orange-200' : 'bg-blue-200'}`}>
                    {pet.type === 'Gato' ? '🐱' : pet.type === 'Cachorro' ? '🐶' : '🦜'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="text-2xl font-black">{pet.name}</h3>
                        {pet.vaccinated && (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-green-800 flex items-center gap-1">
                                ✓ Vacinado
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-700 font-bold mb-3">
                      {pet.breed || "Sem raça definida"} • {pet.age || "? anos"}
                    </p>
                    {(pet.healthConditions || pet.medications) && (
                        <div className="bg-yellow-50 p-3 rounded-lg border-2 border-black text-sm space-y-2">
                            {pet.healthConditions && ( <p><strong>🏥 Saúde:</strong> {pet.healthConditions}</p> )}
                            {pet.medications && ( <p><strong>💊 Remédios:</strong> {pet.medications}</p> )}
                        </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button onClick={() => handleEditClick(pet)} className="bg-secondary hover:bg-yellow-400 border-2 border-black text-black p-2 rounded-lg transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none flex items-center justify-center" title="Editar" >
                    <Pencil size={18}/>
                  </button>
                  <button onClick={() => handleDeletePet(pet.id)} className="bg-red-100 hover:bg-red-200 border-2 border-black text-red-600 p-2 rounded-lg transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none flex items-center justify-center" title="Excluir">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
