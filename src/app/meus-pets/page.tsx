"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  Plus, PawPrint, Syringe, Scale, Heart, 
  AlertCircle, Camera, ClipboardList, Info, ArrowLeft, MoreHorizontal 
} from "lucide-react";

export default function MeusPetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "pets"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const petsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPets(petsData);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-black">
      <div className="w-16 h-16 border-[8px] border-black border-t-green-500 animate-spin mb-4"></div>
      <p className="text-2xl uppercase tracking-[0.2em]">Escaneando DNA Pet...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-green-200">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b-[10px] border-black pb-8 gap-6">
          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-black text-xs uppercase hover:underline mb-4">
              <ArrowLeft size={16} /> Voltar ao Painel
            </Link>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              MEU <span className="text-green-600">SQUAD.</span>
            </h1>
          </div>
          <Link href="/meus-pets/novo" className="bg-black text-white border-4 border-black p-5 font-black uppercase shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
            <Plus size={24} /> Novo Pet
          </Link>
        </header>

        {/* LISTAGEM DE PETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {pets.length === 0 ? (
            <div className="col-span-full border-8 border-dashed border-gray-200 p-20 text-center">
              <PawPrint size={80} className="mx-auto text-gray-200 mb-6" />
              <h2 className="text-4xl font-black text-gray-300 uppercase italic">Sua matilha ainda está vazia.</h2>
              <p className="font-bold text-gray-400 mt-2 uppercase text-sm italic">Cadastre seu primeiro pet para ativar a inteligência.</p>
            </div>
          ) : (
            pets.map((pet) => (
              <div key={pet.id} className="border-[8px] border-black bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row">
                {/* LADO A: FOTO E COMPORTAMENTO */}
                <div className="md:w-1/3 border-b-8 md:border-b-0 md:border-r-8 border-black p-6 bg-gray-50 flex flex-col items-center">
                  <div className="w-32 h-32 border-4 border-black bg-white flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                    {pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" /> : <PawPrint size={48} />}
                  </div>
                  <h3 className="text-3xl font-black uppercase italic text-center mb-4">{pet.name}</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {pet.behavior?.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-black border-2 border-black px-2 py-0.5 uppercase bg-yellow-400">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* LADO B: SAÚDE E INTELIGÊNCIA */}
                <div className="md:w-2/3 p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-[10px] uppercase text-gray-400 leading-none">Status de Saúde</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`h-2 w-8 border-2 border-black ${i <= 4 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                        ))}
                      </div>
                    </div>
                    <button className="border-2 border-black p-1 hover:bg-black hover:text-white transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-4 border-black p-3 bg-purple-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Syringe size={16} className="text-purple-600" />
                        <span className="font-black text-[10px] uppercase">Próx. Vacina</span>
                      </div>
                      <p className="font-black text-xs">Mar/2026</p>
                    </div>
                    <div className="border-4 border-black p-3 bg-blue-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Scale size={16} className="text-blue-600" />
                        <span className="font-black text-[10px] uppercase">Peso Atual</span>
                      </div>
                      <p className="font-black text-xs">{pet.weight || "0.0"} kg</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-black text-xs uppercase flex items-center gap-2 italic text-red-600">
                      <AlertCircle size={14} /> Notas Importantes
                    </h4>
                    <p className="text-[11px] font-bold border-l-4 border-black pl-3 leading-tight italic">
                      {pet.observations || "Nenhuma restrição cadastrada para este pet."}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 border-4 border-black bg-black text-white py-2 font-black uppercase text-[10px] hover:bg-green-500 hover:text-black transition-all">
                      Abrir Ficha
                    </button>
                    <button className="p-2 border-4 border-black bg-white hover:bg-yellow-400 transition-all">
                      <Camera size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SEÇÃO INFERIOR: WIDGETS DE GESTÃO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
           <div className="border-4 border-black p-6 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <ClipboardList size={32} className="mb-4" />
              <h3 className="font-black uppercase text-xl italic mb-2">Agenda de Cuidados</h3>
              <p className="font-bold text-xs uppercase opacity-80 leading-tight">Acompanhe vermifugação e antipulgas de todos os seus pets em um só lugar.</p>
           </div>
           
           <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]">
              <Heart size={32} className="mb-4 text-red-500" />
              <h3 className="font-black uppercase text-xl italic mb-2">Plano de Dieta</h3>
              <p className="font-bold text-xs uppercase opacity-80 leading-tight">Configure horários e porções para que o anfitrião siga à risca.</p>
           </div>

           <div className="border-4 border-black p-6 bg-black text-white shadow-[8px_8px_0px_0px_rgba(34,197,94,1)]">
              <Info size={32} className="mb-4 text-green-400" />
              <h3 className="font-black uppercase text-xl italic mb-2">Pet ID Card</h3>
              <p className="font-bold text-xs uppercase opacity-80 leading-tight">Gere o documento oficial do seu pet para viagens e consultas.</p>
           </div>
        </div>

      </div>
    </div>
  );
}