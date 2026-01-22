"use client";
import { useState, useEffect } from "react";
import { firestore, useAuth } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, PawPrint, Loader, Cat, Dog, Bird } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const PetIcon = ({ tipo, className }: { tipo: string, className?: string }) => {
    switch(tipo?.toLowerCase()) {
        case 'cachorro': return <Dog className={className} />;
        case 'gato': return <Cat className={className} />;
        default: return <Bird className={className} />;
    }
}

export default function MyPetsPage() {
  const { user, loading: loadingAuth } = useAuth();
  const [pets, setPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [newPet, setNewPet] = useState({ nome: "", raca: "", idade: "", foto: "", obs: "" });
  const [saving, setSaving] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/login");
      return;
    }
    
    if (user) {
      setLoadingPets(true);
      const q = query(collection(firestore, "users", user.uid, "pets"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPets(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoadingPets(false);
      }, (error) => {
        console.error("Erro ao buscar pets:", error);
        toast({ variant: 'destructive', title: "Erro ao buscar pets." });
        setLoadingPets(false);
      });
      return () => unsubscribe();
    }
  }, [user, loadingAuth, router, toast]);

  const handleAddPet = async () => {
    if (!newPet.nome || !newPet.raca) {
      toast({ variant: "destructive", title: "Nome e Raça são obrigatórios." });
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(firestore, "users", user!.uid, "pets"), newPet);
      toast({ title: "Pet adicionado com sucesso!", description: `${newPet.nome} agora faz parte da família.`});
      setShowForm(false);
      setNewPet({ nome: "", raca: "", idade: "", foto: "", obs: "" });
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao adicionar pet", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!window.confirm("Tem certeza que quer remover este pet?")) return;
    try {
      await deleteDoc(doc(firestore, "users", user!.uid, "pets", id));
      toast({ title: "Pet removido." });
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao remover pet", description: error.message });
    }
  };

  if (loadingAuth || loadingPets) return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 font-bold">Carregando seus pets...</p>
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/dashboard">
        <Button variant="ghost" className="flex items-center gap-2 font-bold mb-6 hover:underline -ml-4">
          <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
        <h1 className="text-3xl font-black flex items-center gap-2">
          <PawPrint className="w-8 h-8" /> Meus Pets
        </h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#FACC15] text-black"
        >
          <Plus className="w-5 h-5" /> Adicionar Pet
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 animate-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="font-black text-xl">Novo Aumigo (ou Miaumigo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
              <div>
                <label className="block text-xs font-bold mb-1">Foto do Pet</label>
                <div className="transform scale-90 origin-top-left">
                  <ImageUpload 
                    currentImage={newPet.foto} 
                    onUpload={(url) => setNewPet({...newPet, foto: url})} 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-sm">Nome</label>
                    <Input value={newPet.nome} onChange={e => setNewPet({...newPet, nome: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-bold text-sm">Raça</label>
                    <Input value={newPet.raca} onChange={e => setNewPet({...newPet, raca: e.target.value})} />
                  </div>
                </div>
                <div>
                    <label className="font-bold text-sm">Idade (anos)</label>
                    <Input type="number" value={newPet.idade} onChange={e => setNewPet({...newPet, idade: e.target.value})} className="w-24"/>
                </div>
                <div>
                    <label className="font-bold text-sm">Observações (remédios, medos, etc)</label>
                    <Textarea value={newPet.obs} onChange={e => setNewPet({...newPet, obs: e.target.value})} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setShowForm(false)} variant="ghost">Cancelar</Button>
                  <Button onClick={handleAddPet} disabled={saving}>
                    {saving ? <><Loader className="animate-spin mr-2" /> Salvando...</> : "Salvar Pet"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pets.length === 0 && !showForm ? (
        <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed border-black rounded-xl">
          <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="font-bold text-xl">Você ainda não cadastrou nenhum pet.</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">Cadastrar meu primeiro pet</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="p-4 flex gap-4 relative group">
              <div className="w-24 h-24 rounded-lg border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                {pet.foto ? (
                  <img src={pet.foto} alt={pet.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <PetIcon tipo={pet.tipo || 'Cachorro'} className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-black">{pet.nome}</h3>
                <p className="text-sm font-bold text-muted-foreground">{pet.raca} • {pet.idade ? `${pet.idade} anos` : 'Idade não informada'}</p>
                {pet.obs && <p className="text-xs mt-2 bg-secondary/30 p-2 border border-secondary/50 rounded text-secondary-foreground font-bold">{pet.obs}</p>}
              </div>
              <Button 
                onClick={() => handleDeletePet(pet.id)}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
