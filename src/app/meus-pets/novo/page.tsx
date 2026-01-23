"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PawPrint, Save } from "lucide-react";

export default function NovoPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "Cão",
    breed: "",
    weight: "",
    lastVaccine: "",
    observations: "",
    behavior: [] as string[],
  });

  const behaviors = ["Amigável", "Ativo", "Carente", "Medroso", "Bravo", "Social"];

  const toggleBehavior = (item: string) => {
    setFormData(prev => ({
      ...prev,
      behavior: prev.behavior.includes(item) 
        ? prev.behavior.filter(i => i !== item) 
        : [...prev.behavior, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "pets"), {
        ...formData,
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      router.push("/meus-pets");
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-green-200">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/meus-pets" className="flex items-center gap-2 font-black text-xs uppercase hover:underline">
          <ArrowLeft size={16} /> Cancelar e Voltar
        </Link>

        <header className="border-b-[8px] border-black pb-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
            NOVO <span className="text-green-600">MEMBRO.</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10 border-[6px] border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {/* IDENTIDADE */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black uppercase italic border-l-8 border-purple-600 pl-4">Identidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Nome do Pet</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border-4 border-black font-black outline-none bg-gray-50 focus:bg-white" placeholder="EX: TOTÓ" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Espécie</label>
                <select value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} className="w-full p-4 border-4 border-black font-black bg-white">
                  <option value="Cão">CÃO</option>
                  <option value="Gato">GATO</option>
                  <option value="Outros">OUTROS</option>
                </select>
              </div>
            </div>
          </section>

          {/* COMPORTAMENTO */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black uppercase italic border-l-8 border-yellow-400 pl-4">Personalidade</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {behaviors.map(item => (
                <button key={item} type="button" onClick={() => toggleBehavior(item)} className={`p-3 border-4 border-black font-black text-[10px] uppercase transition-all ${formData.behavior.includes(item) ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}>
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* SAÚDE */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black uppercase italic border-l-8 border-red-500 pl-4">Saúde e Dieta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Peso (KG)</label>
                <input type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-4 border-4 border-black font-black outline-none" placeholder="0.0" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Última Vacina</label>
                <input type="date" value={formData.lastVaccine} onChange={e => setFormData({...formData, lastVaccine: e.target.value})} className="w-full p-4 border-4 border-black font-black outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-xs">Observações (Alergias/Ração)</label>
              <textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full p-4 border-4 border-black font-bold h-32 resize-none outline-none" placeholder="EX: ALÉRGICO A FRANGO..." />
            </div>
          </section>

          <button disabled={loading} type="submit" className="w-full bg-green-500 text-black border-4 border-black p-6 font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
            <Save size={28} /> {loading ? "SALVANDO..." : "CONFIRMAR CADASTRO"}
          </button>
        </form>
      </div>
    </div>
  );
}
