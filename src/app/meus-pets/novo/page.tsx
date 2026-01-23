"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Syringe, Heart, ClipboardList, PhoneCall, Plus, Trash2 } from "lucide-react";

export default function CadastroPetGenius() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customTrait, setCustomTrait] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    species: "Cão",
    breed: "",
    weight: "",
    behavior: [] as string[],
    diet: "",
    vetName: "",
    vetPhone: "",
    vaccines: [{ type: "V10/V8", date: "" }]
  });

  const behaviors = ["Amigável", "Ativo", "Carente", "Medroso", "Bravo", "Social"];

  const toggleBehavior = (item: string) => {
    setFormData(prev => ({
      ...prev,
      behavior: prev.behavior.includes(item) ? prev.behavior.filter(i => i !== item) : [...prev.behavior, item]
    }));
  };

  const addVaccine = () => {
    setFormData(prev => ({ ...prev, vaccines: [...prev.vaccines, { type: "Raiva", date: "" }] }));
  };

  const updateVaccine = (index: number, field: string, value: string) => {
    const newVaccines = [...formData.vaccines];
    newVaccines[index] = { ...newVaccines[index], [field]: value };
    setFormData(prev => ({ ...prev, vaccines: newVaccines }));
  };

  const removeVaccine = (index: number) => {
    setFormData(prev => ({ ...prev, vaccines: prev.vaccines.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    const finalBehavior = [...formData.behavior];
    if (customTrait) finalBehavior.push(customTrait);

    try {
      await addDoc(collection(db, "pets"), {
        ...formData,
        behavior: finalBehavior,
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      router.push("/meus-pets");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/meus-pets" className="flex items-center gap-2 font-black text-xs uppercase italic hover:underline">
          <ArrowLeft size={16} /> Voltar para matilha
        </Link>

        <header className="border-b-[10px] border-black pb-6">
          <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
            PET <span className="text-green-600">GENIUS.</span>
          </h1>
          <p className="font-bold text-gray-400 mt-2 uppercase text-xs tracking-widest">Cadastro Técnico e Comportamental</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* 01. IDENTIDADE BÁSICA */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <h3 className="text-3xl font-black uppercase italic flex items-center gap-3">
               <span className="bg-purple-600 text-white px-2">01</span> Identidade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="font-black uppercase text-xs">Nome do Pet</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border-4 border-black font-black outline-none bg-gray-50 focus:bg-white" placeholder="EX: THOR" />
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Peso (KG)</label>
                <input type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-4 border-4 border-black font-black outline-none" placeholder="0.0" />
              </div>
            </div>
          </section>

          {/* 02. PERSONALIDADE CUSTOMIZADA */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] space-y-6">
            <h3 className="text-3xl font-black uppercase italic flex items-center gap-3">
               <span className="bg-yellow-400 text-black px-2">02</span> Comportamento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {behaviors.map(item => (
                <button key={item} type="button" onClick={() => toggleBehavior(item)} className={`p-3 border-4 border-black font-black text-xs uppercase transition-all ${formData.behavior.includes(item) ? 'bg-black text-white' : 'bg-white'}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t-2 border-black border-dashed">
              <label className="font-black uppercase text-xs">Outro traço específico?</label>
              <input type="text" value={customTrait} onChange={e => setCustomTrait(e.target.value)} className="w-full p-4 border-4 border-black font-black outline-none mt-2 italic" placeholder="EX: MEDO DE LIQUIDIFICADOR, VICIADO EM FRUTAS..." />
            </div>
          </section>

          {/* 03. HISTÓRICO DE VACINAS (DYNAMIC) */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase italic flex items-center gap-3">
                 <span className="bg-purple-600 text-white px-2">03</span> Vacinação
              </h3>
              <button type="button" onClick={addVaccine} className="bg-black text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all">
                <Plus size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.vaccines.map((v, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 border-4 border-black">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="font-black uppercase text-[10px]">Tipo da Vacina</label>
                    <select value={v.type} onChange={e => updateVaccine(index, 'type', e.target.value)} className="w-full p-2 border-2 border-black font-black uppercase text-xs">
                      <option>V10/V8</option>
                      <option>Raiva</option>
                      <option>Gripe</option>
                      <option>Giárdia</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <label className="font-black uppercase text-[10px]">Data da Dose</label>
                    <input type="date" value={v.date} onChange={e => updateVaccine(index, 'date', e.target.value)} className="w-full p-2 border-2 border-black font-black text-xs" />
                  </div>
                  {index > 0 && (
                    <button type="button" onClick={() => removeVaccine(index)} className="text-red-600 p-2 hover:bg-red-100 border-2 border-transparent">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 04. DIETA E EMERGÊNCIA */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-4">
               <h4 className="font-black uppercase italic flex items-center gap-2"><ClipboardList size={20}/> Rotina Alimentar</h4>
               <textarea value={formData.diet} onChange={e => setFormData({...formData, diet: e.target.value})} className="w-full p-4 border-4 border-black font-bold h-32 resize-none outline-none text-sm" placeholder="QUANTIDADE, MARCA DA RAÇÃO E HORÁRIOS..." />
            </div>
            <div className="border-[6px] border-black p-8 bg-red-50 shadow-[10px_10px_0px_0px_rgba(239,68,68,1)] space-y-4">
               <h4 className="font-black uppercase italic flex items-center gap-2 text-red-600"><PhoneCall size={20}/> Veterinário SOS</h4>
               <input type="text" value={formData.vetName} onChange={e => setFormData({...formData, vetName: e.target.value})} className="w-full p-3 border-4 border-black font-black text-xs mb-2" placeholder="NOME DO VETERINÁRIO" />
               <input type="text" value={formData.vetPhone} onChange={e => setFormData({...formData, vetPhone: e.target.value})} className="w-full p-3 border-4 border-black font-black text-xs" placeholder="TELEFONE DE EMERGÊNCIA" />
            </div>
          </section>

          <button disabled={loading} type="submit" className="w-full bg-green-500 text-black border-[6px] border-black p-8 font-black uppercase text-4xl shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-4">
            {loading ? "PROCESSANDO DNA..." : "FINALIZAR PRONTUÁRIO 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}