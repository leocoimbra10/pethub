"use client";
import { useState, useEffect } from "react";
import { auth, firestore } from "@/lib/firebase";
import { useAuth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { User, Phone, Mail, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: loadingAuth } = useAuth();
  const [userData, setUserData] = useState<any>({ nome: "", telefone: "", email: "", photoURL: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/login");
      return;
    }
    
    async function fetchProfile() {
      if (user) {
        setIsLoading(true);
        const docRef = doc(firestore, "users", user.uid);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          const data = snap.data();
          setUserData({
            nome: data.nome || user.displayName || "",
            telefone: data.telefone || "",
            email: user.email || "",
            photoURL: data.photoURL || user.photoURL || ""
          });
        } else {
          setUserData({ 
            nome: user.displayName || "", 
            email: user.email || "", 
            telefone: "",
            photoURL: user.photoURL || "" 
          });
        }
        setIsLoading(false);
      }
    }
    if (user) {
      fetchProfile();
    }
  }, [user, loadingAuth, router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Update Database
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        nome: userData.nome,
        telefone: userData.telefone
      }, { merge: true });
      
      // 2. Update Auth Profile for name
      if (user.displayName !== userData.nome) {
          await updateProfile(user, { displayName: userData.nome });
      }
      
      toast({ title: "Perfil salvo com sucesso! ✅" });
      window.location.reload(); 
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: "Erro ao salvar.", description: error.message });
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
        
        {/* ÁREA DA FOTO */}
        <div className="mb-8 flex flex-col items-center">
          <ImageUpload 
            currentImage={userData.photoURL}
            onUpload={async (url) => {
              if(!user) return;
              setUserData((prev: any) => ({ ...prev, photoURL: url }));
              try {
                await setDoc(doc(firestore, "users", user.uid), { photoURL: url }, { merge: true }); // Database
                await updateProfile(user, { photoURL: url }); // Auth Profile
                
                toast({ title: "Foto de perfil atualizada!" });
                window.location.reload();
              } catch(e: any) {
                  toast({variant: 'destructive', title: 'Erro ao salvar foto', description: e.message})
              }
            }} 
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="font-bold flex items-center gap-2 mb-2"><User size={20}/> Nome Completo</label>
            <input 
              value={userData.nome}
              onChange={(e) => setUserData({...userData, nome: e.target.value})}
              className="w-full p-3 border-2 border-black rounded-lg font-bold"
            />
          </div>

          <div>
            <label className="font-bold flex items-center gap-2 mb-2"><Phone size={20}/> WhatsApp</label>
            <input 
              value={userData.telefone}
              onChange={(e) => setUserData({...userData, telefone: e.target.value})}
              className="w-full p-3 border-2 border-black rounded-lg font-bold"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="font-bold flex items-center gap-2 mb-2 text-gray-400"><Mail size={20}/> Email</label>
            <input value={userData.email} disabled className="w-full p-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-400 font-bold cursor-not-allowed" />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-black text-white font-black py-4 rounded-lg hover:bg-[#8B5CF6] transition-colors flex justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin"/> : <Save />} SALVAR DADOS
          </button>
        </div>
      </div>
    </div>
  );
}
