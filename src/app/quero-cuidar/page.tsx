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
  const [customHomeType, setCustomHomeType] = useState("");
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
        setHasPets(data.hasPets || false);
        
        const dbHomeType = data.homeType || "Casa";
        const standardHomeTypes = ["Casa", "Apartamento"];
        if (standardHomeTypes.includes(dbHomeType)) {
          setHomeType(dbHomeType);
        } else {
          setHomeType("Outros");
          setCustomHomeType(dbHomeType);
        }
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
    
    const finalHomeType = homeType === 'Outros' ? customHomeType : homeType;
    if (homeType === 'Outros' && !customHomeType) {
        toast({
            variant: "destructive",
            title: "Campo obrigatório",
            description: "Por favor, especifique o tipo de residência.",
        });
        setIsSubmitting(false);
        return;
    }

    const hostData = {
      ownerId: user.uid,
      nome,
      preco: Number(preco),
      cidade,
      descricao,
      houseImages: houseImages.length > 0 ? houseImages : ['https://picsum.photos/seed/default/400/300'],
      homeType: finalHomeType,
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
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className='text-center mb-10'>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">{isEditing ? "AJUSTAR CADASTRO" : "SEJA UM HERÓI"}</h1>
            <p className="text-lg font-bold text-gray-600 mt-3 max-w-xl mx-auto uppercase">
                {isEditing ? "Atualize os dados do seu espaço." : "Preencha o formulário e comece a faturar com o que você ama."}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 border-4 border-black p-8 shadow-[10px_10px_0px_#8b5cf6]">
          
          <div className="space-y-2">
            <Label htmlFor="nome" className="block font-black text-sm uppercase">Nome do Anfitrião / Espaço</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Cantinho Feliz da Tia Maria" className="w-full p-4 border-4 border-black font-black bg-white outline-none"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preco" className="block font-black text-sm uppercase">Preço da Diária (R$)</Label>
              <Input id="preco" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Ex: 99" className="w-full p-4 border-4 border-black font-black bg-white outline-none"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade" className="block font-black text-sm uppercase">Sua Cidade</Label>
              <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Curitiba" className="w-full p-4 border-4 border-black font-black bg-white outline-none"/>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao" className="block font-black text-sm uppercase">Bio: Descreva seu espaço e amor por pets</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Fale sobre o ambiente, sua experiência, rotina de passeios, etc." className="w-full p-4 border-4 border-black font-black bg-white outline-none min-h-[150px]"/>
          </div>

          <div className="space-y-4">
              <Label className="block font-black text-sm uppercase">Tipo de Residência</Label>
              <select 
                value={homeType} 
                onChange={(e) => setHomeType(e.target.value)}
                className="w-full p-4 border-4 border-black font-black bg-white outline-none"
              >
                <option value="Casa">CASA</option>
                <option value="Apartamento">APARTAMENTO</option>
                <option value="Outros">OUTROS (ESPECIFICAR)</option>
              </select>

              {homeType === "Outros" && (
                <input 
                  type="text" 
                  placeholder="DIGITE O TIPO (Ex: SÍTIO, CHÁCARA, ETC)"
                  value={customHomeType}
                  onChange={(e) => setCustomHomeType(e.target.value)}
                  className="w-full p-4 border-4 border-black font-black bg-yellow-50 outline-none animate-in fade-in slide-in-from-top-2"
                  required
                />
              )}
            </div>

            <label className="flex items-center gap-4 cursor-pointer p-4 border-4 border-black bg-gray-50 hover:bg-yellow-100">
                <input type="checkbox" checked={hasPets} onChange={(e) => setHasPets(e.target.checked)} className="w-6 h-6 border-4 border-black text-purple-600 focus:ring-purple-500"/>
                <span className="font-black text-base uppercase">Eu já tenho outros pets em casa</span>
            </label>


          <div className="space-y-4">
            <Label className="block font-black text-sm uppercase">Fotos do seu Espaço (Opcional)</Label>
            <div className="p-4 border-4 border-dashed border-black rounded-none text-center bg-gray-50">
              {houseImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {houseImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-none overflow-hidden border-4 border-black">
                      <Image src={img} alt={`Foto ${i + 1}`} fill style={{objectFit: 'cover'}} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-bold text-gray-500 p-4">Use o botão abaixo para gerar fotos de exemplo!</p>
              )}
            </div>
             <button type="button" onClick={handleGenerateImages} className="w-full bg-black text-white font-black p-4 border-4 border-black uppercase hover:bg-purple-600">
              <Dice5 className="mr-2 inline" /> Gerar Fotos Aleatórias
            </button>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-purple-600 text-white font-black text-xl py-5 border-4 border-black shadow-[6px_6px_0px_#000] hover:bg-purple-700 active:shadow-none active:translate-y-1 transition-all" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="mr-2 h-5 w-5 animate-spin inline" /> : <CheckCircle className="mr-2 h-5 w-5 inline" />}
              {isEditing ? "ATUALIZAR PERFIL" : "ATIVAR PERFIL DE ANFITRIÃO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}