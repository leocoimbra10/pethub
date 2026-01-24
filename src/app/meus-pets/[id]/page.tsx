"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Syringe, Heart, Phone, ShieldAlert, Share2, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export default function PetPassport() {
  const { id } = useParams();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      const docRef = doc(db, "pets", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPet(docSnap.data());
      setLoading(false);
    };
    fetchPet();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black italic animate-pulse text-4xl">CARREGANDO PASSAPORTE...</div>;
  if (!pet) return <div className="p-10 font-black">Pet não encontrado.</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* NAV & ACTIONS */}
        <div className="flex justify-between items-center">
          <Link href="/meus-pets" className="flex items-center gap-2 font-black uppercase text-xs border-b-4 border-black italic">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <button className="bg-black text-white px-6 py-2 font-black uppercase text-xs border-4 border-black shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] flex items-center gap-2">
            <Share2 size={16} /> Compartilhar Ficha
          </button>
        </div>

        {/* HEADER: O PASSAPORTE */}
        <div className="border-[8px] border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-green-400 border-4 border-black px-4 py-1 font-black uppercase text-xs rotate-3">
            Verificado
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-48 border-[6px] border-black bg-gray-100 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
               {pet.photoUrl ? <img src={pet.photoUrl} className="w-full h-full object-cover" /> : <ClipboardCheck size={80} className="text-gray-300" />}
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-6xl md:text-8xl font-black uppercase leading-none italic">{pet.name}</h1>
              <p className="text-xl font-bold text-purple-600 uppercase tracking-widest">{pet.breed || "Raça não informada"}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-4">
                {pet.behavior?.map((b: string) => (
                  <span key={b} className="bg-yellow-400 border-2 border-black px-3 py-1 font-black text-[10px] uppercase">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GRID DE INFORMAÇÕES TÉCNICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SAÚDE E VACINAS */}
          <div className="border-[6px] border-black p-6 space-y-6 bg-white shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]">
            <h3 className="text-2xl font-black uppercase italic flex items-center gap-2 border-b-4 border-black pb-2">
              <Syringe /> Vacinação
            </h3>
            <div className="space-y-3">
              {pet.vaccines?.map((v: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 border-2 border-black bg-gray-50">
                  <span className="font-black uppercase text-xs">{v.type}</span>
                  <span className="font-bold text-xs">{v.date ? new Date(v.date).toLocaleDateString() : "S/ Data"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DIETA E ROTINA */}
          <div className="border-[6px] border-black p-6 space-y-6 bg-white shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
            <h3 className="text-2xl font-black uppercase italic flex items-center gap-2 border-b-4 border-black pb-2">
              <Heart /> Rotina & Dieta
            </h3>
            <div className="bg-gray-50 p-4 border-2 border-black min-h-[100px]">
              <p className="text-sm font-bold leading-relaxed">{pet.diet || "Nenhuma instrução de dieta cadastrada."}</p>
            </div>
          </div>

          {/* EMERGÊNCIA */}
          <div className="md:col-span-2 border-[6px] border-black p-8 bg-red-50 shadow-[10px_10px_0px_0px_rgba(239,68,68,1)]">
            <div className="flex items-center gap-4 mb-4">
               <ShieldAlert size={40} className="text-red-600" />
               <h3 className="text-4xl font-black uppercase italic leading-none text-red-600">Protocolo SOS</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="font-black uppercase text-xs opacity-50">Veterinário Responsável</p>
                <p className="text-xl font-black">{pet.vetName || "NÃO CADASTRADO"}</p>
              </div>
              <div className="space-y-1">
                <p className="font-black uppercase text-xs opacity-50">Telefone de Emergência</p>
                <div className="flex items-center gap-2">
                  <Phone size={20} />
                  <p className="text-xl font-black">{pet.vetPhone || "NÃO CADASTRADO"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OBSERVAÇÕES GERAIS */}
        <div className="border-[6px] border-black p-8 bg-black text-white">
          <h3 className="text-2xl font-black uppercase italic mb-4">Notas do Tutor</h3>
          <p className="font-bold text-gray-400 italic leading-relaxed">
            {pet.observations || "Nenhuma observação extra adicionada pelo proprietário."}
          </p>
        </div>
      </div>
    </div>
  );
}