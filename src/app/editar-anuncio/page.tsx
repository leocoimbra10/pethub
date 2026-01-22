"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditListingPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [hostData, setHostData] = useState<any>(null);
  const [hostId, setHostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/login");
      return;
    }

    async function fetchHostData() {
      if (user) {
        const q = query(collection(db, "hosts"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const hostDoc = querySnapshot.docs[0];
          const data = hostDoc.data();
          setHostData({ ...data, houseImages: data.houseImages || [] });
          setHostId(hostDoc.id);
        } else {
          toast({ variant: "destructive", title: "Anúncio não encontrado!" });
          router.push("/dashboard");
        }
        setLoading(false);
      }
    }
    fetchHostData();
  }, [user, loadingAuth, router, toast]);

  const handleSave = async () => {
    if (!hostId) return;
    setSaving(true);
    try {
      const docRef = doc(db, "hosts", hostId);
      await updateDoc(docRef, {
        nome: hostData.nome,
        descricao: hostData.descricao,
        preco: Number(hostData.preco),
        cidade: hostData.cidade,
        houseImages: hostData.houseImages
      });
      toast({ title: "Anúncio atualizado com sucesso! 🏠" });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao atualizar." });
    } finally {
      setSaving(false);
    }
  };

  const addPhoto = (url: string) => {
    if (hostData.houseImages.length >= 5) {
        toast({ variant: 'destructive', title: 'Limite de fotos atingido', description: 'Você pode ter no máximo 5 fotos.'});
        return;
    }
    setHostData((prev: any) => ({
      ...prev,
      houseImages: [...prev.houseImages, url]
    }));
  };

  const removePhoto = (indexToRemove: number) => {
    setHostData((prev: any) => ({
      ...prev,
      houseImages: prev.houseImages.filter((_: any, idx: number) => idx !== indexToRemove)
    }));
  };

  if (loading || !hostData) return (
      <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="font-bold text-lg ml-4">Carregando seu anúncio...</p>
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 font-bold mb-6 hover:underline -ml-4">
        <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
      </Button>

      <h1 className="text-3xl font-black mb-6 border-b-4 border-black pb-4">Editar meu Anúncio</h1>

      <div className="bg-card border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        
        <div>
          <Label className="block font-bold mb-4">Fotos do Ambiente</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {hostData.houseImages.map((img: string, idx: number) => (
              <div key={idx} className="relative aspect-video rounded-md overflow-hidden border-2 border-black shadow-neo-sm group">
                <img src={img} alt={`Casa ${idx+1}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100"
                  aria-label={`Remover foto ${idx + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {hostData.houseImages.length < 5 && (
                 <div className="relative flex flex-col items-center justify-center aspect-video border-2 border-dashed border-black rounded-md bg-muted/50">
                    <div className="transform scale-75"> 
                      <ImageUpload 
                        onUpload={addPhoto} 
                      />
                    </div>
                    <span className="absolute bottom-2 text-xs font-bold text-muted-foreground">Adicionar Foto</span>
                 </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-bold">Dica: Adicione fotos da sala, quintal e onde o pet vai dormir.</p>
        </div>

        <hr className="border-t-2 border-muted" />

        <div>
          <Label className="block font-bold mb-2">Título do Anúncio</Label>
          <Input 
            value={hostData.nome}
            onChange={(e) => setHostData({...hostData, nome: e.target.value})}
            className="w-full p-3 border-2 border-black rounded-lg font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block font-bold mb-2">Preço por Noite (R$)</Label>
              <Input 
                type="number"
                value={hostData.preco}
                onChange={(e) => setHostData({...hostData, preco: e.target.value})}
                className="w-full p-3 border-2 border-black rounded-lg font-bold"
              />
            </div>
            <div>
              <Label className="block font-bold mb-2">Cidade</Label>
              <select
                value={hostData.cidade}
                onChange={(e) => setHostData({...hostData, cidade: e.target.value})}
                className="w-full p-3 border-2 border-black rounded-lg font-bold bg-card"
              >
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
                <option value="Curitiba">Curitiba</option>
                <option value="Salvador">Salvador</option>
                <option value="Brasília">Brasília</option>
              </select>
            </div>
        </div>

        <div>
          <Label className="block font-bold mb-2">Descrição</Label>
          <Textarea 
            value={hostData.descricao}
            onChange={(e) => setHostData({...hostData, descricao: e.target.value})}
            className="w-full p-3 border-2 border-black rounded-lg font-bold min-h-[150px]"
          />
        </div>

        <Button 
          size="lg"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#8B5CF6] text-white font-black py-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex justify-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save />} SALVAR ALTERAÇÕES
        </Button>

      </div>
    </div>
  );
}
