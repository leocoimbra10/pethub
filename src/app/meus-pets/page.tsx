"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  healthConditions?: string;
  medications?: string;
  vaccinated?: boolean;
}

export default function MyPetsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Cachorro");
  const [newBreed, setNewBreed] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newHealthConditions, setNewHealthConditions] = useState("");
  const [newMedications, setNewMedications] = useState("");
  const [newVaccinated, setNewVaccinated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      await fetchPets(currentUser.uid);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchPets = async (userId: string) => {
    try {
      const q = query(collection(db, "pets"), where("ownerUid", "==", userId));
      const querySnapshot = await getDocs(q);
      const petsList: Pet[] = [];
      querySnapshot.forEach((doc) => {
        petsList.push({ id: doc.id, ...doc.data() } as Pet);
      });
      setPets(petsList);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    }
  };

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
        await updateDoc(doc(db, "pets", editingId), { ...petData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "pets"), { ...petData, createdAt: serverTimestamp() });
      }
      handleCancelEdit();
      await fetchPets(user.uid);
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm("Remover esse amigão da lista?")) return;
    try {
      await deleteDoc(doc(db, "pets", petId));
      setPets(pets.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black italic">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b-8 border-black pb-4">
          <Link href="/dashboard" className="font-black p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300">← PAINEL</Link>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Meus Pets 🦴</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLUNA ESQUERDA: FORMULÁRIO */}
          <div className="lg:col-span-4">
            <div className={`p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${editingId ? 'bg-yellow-200' : 'bg-white'}`}>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight border-b-2 border-black">
                {editingId ? 'Editar Pet' : 'Novo Pet'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" placeholder="NOME DO PET" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-3 border-4 border-black font-black outline-none focus:bg-gray-50" />
                
                <div className="flex gap-4">
                  <select value={newType} onChange={e => setNewType(e.target.value)} className="w-1/2 p-3 border-4 border-black font-black bg-white">
                    <option value="Cachorro">🐶 CÃO</option>
                    <option value="Gato">🐱 GATO</option>
                  </select>
                  <input type="text" placeholder="IDADE" value={newAge} onChange={e => setNewAge(e.target.value)} className="w-1/2 p-3 border-4 border-black font-black" />
                </div>

                <input type="text" placeholder="RAÇA" value={newBreed} onChange={e => setNewBreed(e.target.value)} className="w-full p-3 border-4 border-black font-black" />

                <div className="space-y-4 pt-4 border-t-4 border-black">
                  <p className="font-black uppercase text-xs">💉 FICHA MÉDICA</p>
                  <textarea placeholder="CONDIÇÕES / ALERGIAS" value={newHealthConditions} onChange={e => setNewHealthConditions(e.target.value)} className="w-full p-3 border-4 border-black font-bold h-24 resize-none outline-none" />
                  <textarea placeholder="MEDICAMENTOS" value={newMedications} onChange={e => setNewMedications(e.target.value)} className="w-full p-3 border-4 border-black font-bold h-24 resize-none outline-none" />
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-4 border-black bg-green-100 font-black text-sm">
                    <input type="checkbox" checked={newVaccinated} onChange={e => setNewVaccinated(e.target.checked)} className="w-6 h-6 border-4 border-black" />
                    VACINAÇÃO EM DIA?
                  </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-purple-500 text-white font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:bg-purple-600 uppercase">
                  {isSubmitting ? "..." : (editingId ? "ATUALIZAR" : "SALVAR PET")}
                </button>
              </form>
            </div>
          </div>

          {/* COLUNA DIREITA: LISTA */}
          <div className="lg:col-span-8 space-y-8">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between gap-6 hover:translate-x-1 hover:translate-y-1 transition-all">
                <div className="flex gap-6 items-start">
                  <div className={`w-20 h-20 border-4 border-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${pet.type === 'Gato' ? 'bg-orange-300' : 'bg-blue-300'}`}>
                    {pet.type === 'Gato' ? '🐱' : '🐶'}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase italic leading-none">{pet.name}</h3>
                    <p className="font-black text-gray-500 uppercase text-xs mb-4">{pet.breed} • {pet.age}</p>
                    
                    {pet.vaccinated && (
                      <span className="bg-green-400 border-2 border-black px-2 py-1 font-black text-[10px] uppercase">✓ Vacinado</span>
                    )}
                    
                    {(pet.healthConditions || pet.medications) && (
                      <div className="mt-4 bg-gray-50 border-2 border-black p-4 space-y-2">
                        {pet.healthConditions && <p className="text-sm font-bold"><span className="text-red-600 font-black">ALERTA:</span> {pet.healthConditions}</p>}
                        {pet.medications && <p className="text-sm font-bold"><span className="text-blue-600 font-black">REMÉDIOS:</span> {pet.medications}</p>}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-3">
                  <button onClick={() => handleEditClick(pet)} className="bg-yellow-400 p-3 border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Editar</button>
                  <button onClick={() => handleDeletePet(pet.id)} className="bg-red-500 text-white p-3 border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}