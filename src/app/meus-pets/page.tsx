"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { 
  Plus, PawPrint, Syringe, Scale, Heart, 
  AlertCircle, Camera, ClipboardList, Info, ArrowLeft, X 
} from "lucide-react";

export default function MeusPetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

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

  const Modal = ({ title, children, onClose }: any) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border-[6px] border-black p-8 max-w-lg w-full shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 hover:rotate-90 transition-transform">
          <X size={32} />
        </button>
        <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-black pb-2">{title}</h2>
        {children}
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-black">
      <div className="w-16 h-16 border-[8px] border-black border-t-green-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-green-200 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER RESPONSIVO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[8px] md:border-b-[10px] border-black pb-8 gap-6">
          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-black text-[10px] md:text-xs uppercase hover:underline mb-2">
              <ArrowLeft size={14} /> Painel
            </Link>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              MEU <span className="text-green-600">SQUAD.</span>
            </h1>
          </div>
          <Link href="/meus-pets/novo" className="w-full md:w-auto bg-black text-white border-4 border-black p-4 md:p-5 font-black uppercase shadow-[5px_5px_0px_0px_rgba(34,197,94,1)] md:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] text-center">
            + Adicionar Pet
          </Link>
        </header>

        {/* LISTAGEM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {pets.map((pet) => (
            <div key={pet.id} className="border-[6px] md:border-[8px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-1/3 border-b-[6px] md:border-b-0 md:border-r-[6px] border-black p-6 bg-gray-50 flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  {pet.photoUrl ? <img src={pet.photoUrl} className="w-full h-full object-cover" /> : <PawPrint size={40} />}
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase italic text-center leading-none">{pet.name}</h3>
              </div>
              <div className="md:w-2/3 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-black p-2 bg-purple-50">
                    <span className="font-black text-[9px] uppercase block">Vacinas</span>
                    <p className="font-black text-xs uppercase">Em Dia</p>
                  </div>
                  <div className="border-2 border-black p-2 bg-blue-50">
                    <span className="font-black text-[9px] uppercase block">Peso</span>
                    <p className="font-black text-xs uppercase">{pet.weight}kg</p>
                  </div>
                </div>
                <Link href={`/meus-pets/${pet.id}`} className="block w-full text-center border-4 border-black bg-black text-white py-2 font-black uppercase text-xs hover:bg-green-500 hover:text-black transition-all">
                  Ver Ficha Completa
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* BOTÕES DE GESTÃO (AGORA COM FUNÇÃO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 pt-6">
           <button onClick={() => setActiveModal('agenda')} className="border-4 border-black p-6 bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <ClipboardList size={32} className="mb-4" />
              <h3 className="font-black uppercase text-lg italic leading-none">Agenda de Cuidados</h3>
           </button>
           
           <button onClick={() => setActiveModal('dieta')} className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] text-left hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <Heart size={32} className="mb-4 text-red-500" />
              <h3 className="font-black uppercase text-lg italic leading-none">Plano de Dieta</h3>
           </button>

           <button onClick={() => setActiveModal('id-card')} className="border-4 border-black p-6 bg-black text-white shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] text-left hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <Info size={32} className="mb-4 text-green-400" />
              <h3 className="font-black uppercase text-lg italic leading-none">Pet ID Card</h3>
           </button>
        </div>

        {/* LOGICA DOS MODAIS */}
        {activeModal === 'agenda' && (
          <Modal title="Agenda de Saúde" onClose={() => setActiveModal(null)}>
            <p className="font-bold text-gray-600 mb-4 uppercase text-sm italic">Próximos eventos:</p>
            <div className="space-y-2">
              <div className="p-3 border-2 border-black bg-gray-50 font-black text-xs uppercase flex justify-between">
                <span>Vermífugo Plus</span> <span className="text-red-600">Em 5 dias</span>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'dieta' && (
          <Modal title="Plano de Dieta" onClose={() => setActiveModal(null)}>
            <div className="p-4 border-4 border-dashed border-gray-200 text-center font-black text-gray-400 uppercase italic">
              Nenhuma dieta específica configurada. Clique em "Abrir Ficha" no pet para configurar.
            </div>
          </Modal>
        )}

        {activeModal === 'id-card' && (
          <Modal title="Pet ID Digital" onClose={() => setActiveModal(null)}>
            <div className="flex flex-col items-center gap-6">
              <div className="w-48 h-48 bg-gray-100 border-4 border-black flex items-center justify-center">
                <QrCode size={120} />
              </div>
              <p className="font-black text-[10px] uppercase text-center italic">Escaneie para acessar o prontuário de emergência do pet.</p>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
}

// Pequeno helper para o ícone de QR Code que faltou no import inicial
function QrCode({size}: {size: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>;
}