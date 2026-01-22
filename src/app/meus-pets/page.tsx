"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import Link from "next/link";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
}

export default function MyPetsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Estados do Formulário
  const [editingId, setEditingId] = useState<string | null>(null); // ID do pet sendo editado
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Cachorro");
  const [newBreed, setNewBreed] = useState("");
  const [newAge, setNewAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Verificar Login e Carregar Pets
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

  // Função para buscar pets no Firestore
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

  // 2. Preencher formulário para Edição
  const handleEditClick = (pet: Pet) => {
    setEditingId(pet.id);
    setNewName(pet.name);
    setNewType(pet.type);
    setNewBreed(pet.breed);
    setNewAge(pet.age);
    // Rola a página para o topo (formulário) suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Cancelar Edição
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewName("");
    setNewType("Cachorro");
    setNewBreed("");
    setNewAge("");
  };

  // 4. Salvar (Criar ou Atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        // --- MODO EDIÇÃO (UPDATE) ---
        const petRef = doc(db, "pets", editingId);
        await updateDoc(petRef, {
          name: newName,
          type: newType,
          breed: newBreed,
          age: newAge,
          updatedAt: new Date()
        });
      } else {
        // --- MODO CRIAÇÃO (CREATE) ---
        await addDoc(collection(db, "pets"), {
          ownerUid: user.uid,
          name: newName,
          type: newType,
          breed: newBreed,
          age: newAge,
          createdAt: new Date()
        });
      }
      
      // Limpar tudo e recarregar
      handleCancelEdit();
      await fetchPets(user.uid);
      
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Deletar Pet
  const handleDeletePet = async (petId: string) => {
    if (!confirm("Tem certeza que quer remover este pet?")) return;
    try {
      await deleteDoc(doc(db, "pets", petId));
      setPets(pets.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-yellow-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-yellow-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Topo */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-black hover:underline decoration-2">
            ← Voltar ao Painel
          </Link>
          <h1 className="text-4xl font-black text-black">Meus Pets 🐶</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulário (Esquerda) */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-24 transition-colors ${editingId ? 'bg-yellow-100' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className={`p-1 rounded border-2 border-black text-sm ${editingId ? 'bg-yellow-300' : 'bg-purple-100'}`}>
                  {editingId ? '✏️' : '➕'}
                </span> 
                {editingId ? 'Editar Pet' : 'Adicionar Pet'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Nome do Pet</label>
                  <input 
                    type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Tipo</label>
                  <select 
                    value={newType} onChange={e => setNewType(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                  >
                    <option value="Cachorro">🐶 Cachorro</option>
                    <option value="Gato">🐱 Gato</option>
                    <option value="Outro">🦜 Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Raça</label>
                  <input 
                    type="text" value={newBreed} onChange={e => setNewBreed(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Idade (anos)</label>
                  <input 
                    type="number" value={newAge} onChange={e => setNewAge(e.target.value)}
                    className="w-full p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    type="submit" disabled={isSubmitting}
                    className={`w-full text-black font-bold py-3 px-4 rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all ${editingId ? 'bg-yellow-400' : 'bg-[#A78BFA]'}`}
                  >
                    {isSubmitting ? "Salvando..." : (editingId ? "Atualizar Pet" : "Salvar Pet")}
                  </button>

                  {editingId && (
                    <button 
                      type="button" onClick={handleCancelEdit}
                      className="w-full bg-white text-gray-600 font-bold py-2 px-4 rounded border-2 border-gray-300 hover:bg-gray-100 hover:border-black transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Pets (Direita) */}
          <div className="lg:col-span-2 space-y-4">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center group hover:bg-gray-50 transition relative">
                
                {/* Destaque visual se estiver sendo editado */}
                {editingId === pet.id && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-16 bg-yellow-400 rounded-r border-y-2 border-r-2 border-black"></div>
                )}

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl ${pet.type === 'Gato' ? 'bg-orange-200' : 'bg-blue-200'}`}>
                    {pet.type === 'Gato' ? '🐱' : '🐶'}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{pet.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {pet.breed || "Sem raça"} • {pet.age} anos
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Botão Editar */}
                  <button 
                    onClick={() => handleEditClick(pet)}
                    className="bg-yellow-300 hover:bg-yellow-400 border-2 border-black text-black p-2 rounded-lg transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  
                  {/* Botão Excluir */}
                  <button 
                    onClick={() => handleDeletePet(pet.id)}
                    className="bg-red-100 hover:bg-red-200 border-2 border-black text-red-600 p-2 rounded-lg transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                    title="Excluir"
                  >
                    🗑️
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
