
"use client";
import { useState, useEffect } from "react";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/firebase";
import { User, Phone, Mail, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: loadingAuth } = useAuth();
  const [userData, setUserData] = useState({ nome: "", telefone: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      const fetchUser = async () => {
        setIsLoading(true);
        const docRef = doc(firestore, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserData({ 
              nome: data.nome || user.displayName || "",
              telefone: data.telefone || "",
              email: user.email || ""
          });
        } else {
          setUserData({ nome: user.displayName || "", email: user.email || "", telefone: "" });
        }
        setIsLoading(false);
      };
      fetchUser();
    }
  }, [user, loadingAuth, router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        nome: userData.nome,
        telefone: userData.telefone,
      }, { merge: true });
      toast({
          title: "Perfil Atualizado!",
          description: "Suas informações foram salvas com sucesso."
      })
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
          variant: "destructive",
          title: "Erro ao Salvar",
          description: "Não foi possível atualizar seu perfil."
      })
    } finally {
      setSaving(false);
    }
  };

  if (loadingAuth || isLoading) return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-black mb-8 border-b-4 border-black pb-4">Meu Perfil</h1>
      
      <div className="bg-white border-2 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-24 h-24 bg-black rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-black shadow-lg">
          <span className="text-white text-3xl font-bold">{userData.nome?.charAt(0).toUpperCase()}</span>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block font-bold mb-2 flex items-center gap-2">
              <User className="w-5 h-5" /> Nome Completo
            </label>
            <input 
              type="text" 
              value={userData.nome}
              onChange={(e) => setUserData({...userData, nome: e.target.value})}
              className="w-full p-3 border-2 border-black rounded-lg font-bold"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5" /> Telefone / WhatsApp
            </label>
            <input 
              type="text" 
              value={userData.telefone}
              onChange={(e) => setUserData({...userData, telefone: e.target.value})}
              placeholder="(00) 00000-0000"
              className="w-full p-3 border-2 border-black rounded-lg font-bold"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 flex items-center gap-2 text-gray-500">
              <Mail className="w-5 h-5" /> Email (Não editável)
            </label>
            <input 
              type="text" 
              value={userData.email}
              disabled
              className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#8B5CF6] text-white font-black py-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2 mt-4 disabled:bg-gray-400"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save />}
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
}
