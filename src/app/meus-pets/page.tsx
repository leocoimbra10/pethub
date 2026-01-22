"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, ArrowLeft, PawPrint, Pencil, X } from "lucide-react";
import type { Pet } from "@/lib/types";

export default function MyPetsPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"Cachorro" | "Gato" | "Outro">("Cachorro");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Auth check and initial pet fetch
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
        const petsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
        setPets(petsList);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        toast({ variant: "destructive", title: "Erro ao buscar seus pets." });
      } finally {
        setLoading(false);
      }
    };

    fetchPets(user.uid);
  }, [user, loadingAuth, router, toast]);

  // 2. Populate form for editing
  const handleEditClick = (pet: Pet) => {
    setEditingId(pet.id);
    setNome(pet.nome);
    setTipo(pet.tipo);
    setRaca(pet.raca);
    setIdade(pet.idade?.toString() || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setNome("");
    setTipo("Cachorro");
    setRaca("");
    setIdade("");
  };


  // 4. Save (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !nome) {
      toast({ variant: 'destructive', title: 'O nome do pet é obrigatório.' });
      return;
    };
    setIsSubmitting(true);

    try {
      if (editingId) {
        // --- UPDATE MODE ---
        const petRef = doc(db, "users", user.uid, "pets", editingId);
        await updateDoc(petRef, {
          nome,
          tipo,
          raca,
          idade: Number(idade) || 0,
          updatedAt: serverTimestamp()
        });
        toast({ title: "Pet atualizado com sucesso! ✏️" });
      } else {
        // --- CREATE MODE ---
        const petData = {
          ownerId: user.uid,
          nome,
          tipo,
          raca,
          idade: Number(idade) || 0,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, "users", user.uid, "pets"), petData);
        toast({ title: "Pet adicionado com sucesso! 🎉" });
      }
      
      // Reset form and reload list
      handleCancelEdit();
      const q = query(collection(db, "users", user.uid, "pets"));
      const querySnapshot = await getDocs(q);
      const petsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
      setPets(petsList);
      
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      toast({ variant: 'destructive', title: "Erro ao salvar o pet." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete Pet
  const handleDeletePet = async (petId: string) => {
    if (!user || !window.confirm("Tem certeza que quer remover este pet?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "pets", petId));
      setPets(pets.filter(pet => pet.id !== petId));
      toast({ title: "Pet removido com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      toast({ variant: 'destructive', title: "Erro ao remover o pet." });
    }
  };

  if (loading || loadingAuth) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-black hover:underline">
                <ArrowLeft /> Voltar ao Painel
            </Link>
             <h1 className="text-3xl font-black text-black flex items-center gap-3"><PawPrint className="w-8 h-8" />Meus Pets</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <form onSubmit={handleSubmit} className={`p-6 rounded-xl border-2 border-black shadow-neo sticky top-24 space-y-4 transition-colors ${editingId ? 'bg-secondary/20' : 'bg-card'}`}>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {editingId ? <Pencil /> : <Plus />}
                        {editingId ? "Editar Pet" : "Adicionar Novo Pet"}
                    </h2>
                    
                    <div>
                        <Label htmlFor="nome" className="font-bold">Nome do Pet</Label>
                        <Input id="nome" type="text" required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Rex" />
                    </div>

                    <div>
                        <Label htmlFor="tipo" className="font-bold">Tipo</Label>
                        <select 
                            id="tipo" value={tipo} onChange={e => setTipo(e.target.value as any)}
                            className="w-full p-2 border-2 border-black rounded-lg bg-card text-base md:text-sm focus:ring-2 focus:ring-ring"
                        >
                            <option value="Cachorro">🐶 Cachorro</option>
                            <option value="Gato">🐱 Gato</option>
                            <option value="Outro">🦜 Outro</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="raca" className="font-bold">Raça</Label>
                        <Input id="raca" type="text" value={raca} onChange={e => setRaca(e.target.value)} placeholder="Ex: Vira-lata" />
                    </div>

                    <div>
                        <Label htmlFor="idade" className="font-bold">Idade (anos)</Label>
                        <Input id="idade" type="number" value={idade} onChange={e => setIdade(e.target.value)} placeholder="Ex: 3" />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Button type="submit" disabled={isSubmitting} variant={editingId ? 'secondary' : 'default'}>
                          {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? "Atualizar Pet" : "Salvar Pet")}
                      </Button>

                      {editingId && (
                        <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                          <X className="mr-2" /> Cancelar Edição
                        </Button>
                      )}
                    </div>
                </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
                {pets.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-black rounded-xl">
                    <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-bold">Nenhum pet cadastrado ainda.</p>
                    <p>Use o formulário para começar!</p>
                </div>
                ) : (
                pets.map((pet) => (
                    <div key={pet.id} className={`bg-card p-4 rounded-xl border-2 border-black shadow-neo flex justify-between items-center group transition-all ${editingId === pet.id ? 'shadow-[8px_8px_0px_hsl(var(--secondary))]' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-lg border-2 border-black flex items-center justify-center text-3xl ${pet.tipo === 'Gato' ? 'bg-secondary' : 'bg-accent/20'}`}>
                            {pet.tipo === 'Gato' ? '🐱' : '🐶'}
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{pet.nome}</h3>
                                <p className="text-sm text-muted-foreground font-bold">
                                    {pet.raca || "Sem raça definida"} • {pet.idade || 'N/A'} anos
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button 
                                onClick={() => handleEditClick(pet)}
                                variant="secondary"
                                size="icon"
                                title="Editar Pet"
                            >
                                <Pencil />
                            </Button>
                            <Button 
                                onClick={() => handleDeletePet(pet.id)}
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Excluir Pet"
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
