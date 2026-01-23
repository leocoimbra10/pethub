"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Dice5, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function QueroCuidarPage() {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [cidade, setCidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [houseImages, setHouseImages] = useState<string[]>([]);
  const [homeType, setHomeType] = useState("Casa");
  const [hasPets, setHasPets] = useState(false);

  // Logic states
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);

  // Fetch existing host data on load
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchHostData = async () => {
      const q = query(collection(db, "hosts"), where("ownerId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const hostDoc = querySnapshot.docs[0];
        const data = hostDoc.data();

        setHostId(hostDoc.id);
        setIsEditing(true);

        // Populate form with existing data
        setNome(data.nome || "");
        setPreco(data.preco || "");
        setCidade(data.cidade || "");
        setDescricao(data.descricao || "");
        setHouseImages(data.houseImages || []);
        setHomeType(data.homeType || "Casa");
        setHasPets(data.hasPets || false);
      }
      setPageLoading(false);
    };

    fetchHostData();
  }, [user, authLoading, router]);
  
  const handleGenerateImages = () => {
    const keywords = ['living-room', 'backyard', 'cozy-corner'];
    const newImages = keywords.map(
      (kw) => `https://picsum.photos/seed/${kw}-${Math.random()}/400/300`
    );
    setHouseImages(newImages);
    toast({
      title: 'Fotos geradas!',
      description: 'Novas imagens de exemplo foram carregadas.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !nome || !preco || !cidade || !descricao) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, preço, cidade e descrição.",
      });
      return;
    }
    setIsSubmitting(true);

    const hostData = {
      ownerId: user.uid,
      nome,
      preco: Number(preco),
      cidade,
      descricao,
      houseImages: houseImages.length > 0 ? houseImages : ['https://picsum.photos/seed/default/400/300'],
      homeType,
      hasPets,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEditing && hostId) {
        const hostRef = doc(db, "hosts", hostId);
        await updateDoc(hostRef, hostData);
        toast({ title: "Perfil de cuidador atualizado!" });
      } else {
        const newHostData = {
            ...hostData,
            createdAt: serverTimestamp(),
            rating: 5.0,
            photo: `https://picsum.photos/seed/${user.uid}/200/200`
        }
        await addDoc(collection(db, "hosts"), newHostData);
        toast({ title: "Parabéns! Você agora é um anfitrião PetHub." });
      }
      router.push("/dashboard");
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        toast({ variant: "destructive", title: "Erro ao salvar", description: "Ocorreu um erro. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className='text-center mb-8'>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{isEditing ? "Editar Perfil" : "Seja um Anfitrião"}</h1>
            <p className="text-lg font-medium text-muted-foreground mt-2">
                {isEditing ? "Ajuste os detalhes do seu espaço." : "Complete seu perfil para começar a receber hóspedes."}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border-2 border-black rounded-2xl p-6 md:p-8 shadow-neo">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-lg font-bold">Nome do seu Espaço</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Cantinho da Tia Juju" className="p-3 text-base"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preco" className="text-lg font-bold">Preço por Noite (R$)</Label>
              <Input id="preco" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: 120" className="p-3 text-base"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-lg font-bold">Sua Cidade</Label>
              <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: São Paulo" className="p-3 text-base"/>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-lg font-bold">Descreva seu espaço e amor por pets</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Fale sobre o ambiente, sua experiência, rotina de passeios, etc." className="p-3 text-base min-h-[120px]"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="homeType" className="text-lg font-bold">Tipo de Residência</Label>
                <select id="homeType" value={homeType} onChange={(e) => setHomeType(e.target.value)} className="w-full p-3 border-2 border-black rounded-lg font-bold bg-card text-base">
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                </select>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
                 <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-black bg-muted/50 rounded-lg">
                    <input type="checkbox" checked={hasPets} onChange={(e) => setHasPets(e.target.checked)} className="w-5 h-5 border-2 border-black text-primary focus:ring-primary"/>
                    <span className="font-bold text-sm">Eu já tenho pets</span>
                </label>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-bold">Fotos do seu Espaço</Label>
            <div className="p-4 border-2 border-dashed border-black rounded-lg text-center">
              {houseImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {houseImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-md overflow-hidden border-2 border-black shadow-neo-sm">
                      <Image src={img} alt={`Foto ${i + 1}`} fill style={{objectFit: 'cover'}} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground font-medium">Use o botão para gerar fotos de exemplo!</p>
              )}
            </div>
             <Button type="button" variant="secondary" onClick={handleGenerateImages} className="w-full">
              <Dice5 className="mr-2" /> Gerar Fotos de Exemplo
            </Button>
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
              {isEditing ? "Atualizar Perfil" : "Ativar Perfil de Cuidador"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
