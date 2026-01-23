"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  Bell, Wallet, ShieldCheck, HeartPulse, MessageSquare, 
  PawPrint, Home, ArrowUpRight, History, CheckSquare, 
  QrCode, ThermometerSun, LogOut, PhoneCall, Star
} from "lucide-react";

export default function DashboardElite() {
  const [user, setUser] = useState<any>(null);
  const [hostData, setHostData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const hostSnap = await getDoc(doc(db, "hosts", currentUser.uid));
        if (hostSnap.exists()) setHostData(hostSnap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-black">
      <div className="w-16 h-16 border-[8px] border-black border-t-purple-600 animate-spin mb-4"></div>
      <p className="text-2xl uppercase tracking-widest">Sincronizando Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans selection:bg-yellow-200">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* HEADER AJUSTADO - EQUILÍBRIO VISUAL */}
        <header className="border-b-[8px] border-black pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-purple-600 text-white border-2 border-black px-2 py-0.5 font-black uppercase text-[10px]">PetHub v4.0</span>
              <span className="bg-green-400 border-2 border-black px-2 py-0.5 font-black uppercase text-[10px]">Sistema Ativo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
              E AÍ, <span className="text-purple-600">{user?.displayName?.split(' ')[0] || "USUÁRIO"}!</span>
            </h1>
          </div>
          <button onClick={() => auth.signOut()} className="bg-white border-4 border-black p-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-sm">
            <LogOut size={18} /> Sair da Conta
          </button>
        </header>

        {/* GRID PRINCIPAL - DIAGRAMAÇÃO DE ELITE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA ESQUERDA: FINANCEIRO & CLIMA (3 COLUNAS) */}
          <div className="lg:col-span-3 space-y-8">
            {/* WALLET MELHORADA */}
            <div className="border-4 border-black p-6 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-4">
                <Wallet size={32} />
                <p className="font-black uppercase text-[10px] bg-black text-white px-2">Finanças</p>
              </div>
              <h2 className="text-4xl font-black leading-none">R$ 0,00</h2>
              <p className="text-[10px] font-bold uppercase mt-1 opacity-70">Saldo disponível</p>
              <button className="w-full mt-6 bg-black text-white py-3 font-black uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all">Relatório</button>
            </div>

            {/* ASSISTENTE DE CLIMA COMPACTO */}
            <div className="border-4 border-black p-6 bg-blue-50 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
               <div className="flex items-center gap-2 mb-3">
                  <ThermometerSun size={20} className="text-orange-500" />
                  <h3 className="font-black uppercase italic text-sm">Clima Pet</h3>
               </div>
               <p className="font-bold text-[11px] leading-tight border-l-2 border-black pl-3">
                 Tempo seco detectado. Hidrate seus pets com frequência hoje.
               </p>
            </div>

            {/* CONTATOS DE EMERGÊNCIA */}
            <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
               <div className="flex items-center gap-2 mb-4">
                  <PhoneCall size={20} className="text-red-600" />
                  <h3 className="font-black uppercase text-sm">Emergência</h3>
               </div>
               <button className="w-full border-2 border-black p-2 font-black text-[10px] uppercase hover:bg-black hover:text-white transition-all">+ Add Contato SOS</button>
            </div>
          </div>

          {/* COLUNA CENTRAL: CORE & MALA (6 COLUNAS) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/meus-pets" className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] group hover:-translate-y-1 transition-all">
                <PawPrint size={40} className="text-purple-600 mb-4" />
                <h4 className="text-2xl font-black uppercase italic leading-none">Meus Pets</h4>
                <p className="font-bold text-[11px] text-gray-500 mt-2 italic">Acesse fichas médicas e vacinas.</p>
              </Link>
              <Link href="/quero-cuidar" className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] group hover:-translate-y-1 transition-all">
                <Home size={40} className="text-yellow-500 mb-4" />
                <h4 className="text-2xl font-black uppercase italic leading-none">Anfitrião</h4>
                <p className="font-bold text-[11px] text-gray-500 mt-2 italic">Gerencie seu espaço e agenda.</p>
              </Link>
            </div>

            {/* MALA DO PET DIAGRAMADA */}
            <div className="border-4 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-3">
                <CheckSquare size={28} />
                <h3 className="text-2xl font-black uppercase italic">Mala de Viagem</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Ração", "Caminha", "Brinquedos", "Coleira"].map(item => (
                  <div key={item} className="flex items-center gap-3 p-3 border-2 border-black font-black uppercase text-[10px] bg-gray-50">
                    <input type="checkbox" className="w-4 h-4 border-2 border-black accent-purple-600" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* PET ID DIGITAL - GRID INTEGRADO */}
            <div className="border-4 border-black p-6 bg-purple-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase italic leading-none">Pet ID Digital</h3>
                <p className="font-bold text-[10px] mt-1 text-purple-200">Gere o QR Code de emergência.</p>
              </div>
              <QrCode size={50} />
            </div>
          </div>

          {/* COLUNA DIREITA: FEED & STATUS (3 COLUNAS) */}
          <div className="lg:col-span-3 space-y-8">
            {/* STATUS DE CONFIANÇA */}
            <div className="border-4 border-black p-5 bg-white shadow-[6px_6px_0px_0px_rgba(34,197,94,1)]">
               <h3 className="font-black uppercase text-[10px] mb-4 flex justify-between">
                  Confiança <span className="text-green-600 flex items-center gap-1"><Star size={10} fill="currentColor"/> 4.9</span>
               </h3>
               <div className="w-full h-4 border-2 border-black bg-gray-100 mb-2 p-0.5">
                  <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
               </div>
               <p className="text-[9px] font-bold uppercase italic text-gray-400 text-center">Perfil altamente confiável</p>
            </div>

            {/* FEED RECENTE COMPACTO */}
            <div className="border-4 border-black p-5 bg-black text-white shadow-[6px_6px_0px_0px_rgba(147,51,234,1)] h-[300px] flex flex-col">
               <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                  <History size={16} />
                  <h3 className="font-black uppercase italic text-sm">Timeline</h3>
               </div>
               <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide text-[10px]">
                  <div className="border-l-2 border-purple-500 pl-3">
                     <p className="font-black text-purple-400 uppercase leading-none mb-1">Agora</p>
                     <p className="font-bold opacity-80 italic">Painel Elite v4 ativado com sucesso.</p>
                  </div>
                  <div className="border-l-2 border-gray-600 pl-3">
                     <p className="font-black text-gray-500 uppercase leading-none mb-1">Ontem</p>
                     <p className="font-bold opacity-50 italic">Perfil de anfitrião sincronizado.</p>
                  </div>
               </div>
            </div>

            <Link href="/search" className="block text-center p-4 border-4 border-black bg-purple-600 text-white font-black uppercase italic text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
               BUSCAR ANFITRIÃO
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}