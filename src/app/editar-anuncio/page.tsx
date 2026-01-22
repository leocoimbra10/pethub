"use client";
import { useState, useEffect } from "react";
import { useAuth, firestore } from "@/lib/firebase";
import { collection, doc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditListingPage() {
  const { user, loading: loadingAuth } = useAuth();
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
        const q = query(collection(firestore, "hosts"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const hostDoc = querySnapshot.docs[0];
          setHostData(hostDoc.data());
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
      const docRef = doc(firestore, "hosts", hostId);
      await updateDoc(docRef, {
        nome: hostData.nome,
        descricao: hostData.descricao,
        preco: Number(hostData.preco),
        cidade: hostData.cidade
      });
      toast({ title: "Anúncio atualizado!", description: "Suas alterações foram salvas." });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao atualizar." });
    } finally {
      setSaving(false);
    }
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
