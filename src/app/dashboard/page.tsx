"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  Bell, Wallet, ShieldCheck, HeartPulse, MessageSquare, 
  PawPrint, Home, ArrowUpRight, History, Sun, CheckSquare, 
  QrCode, Award, ThermometerSun, LogOut, CheckCircle2
} from "lucide-react";

export default function DashboardFinalBoss() {
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-20 h-20 border-[10px] border-black border-t-purple-600 animate-spin mb-6"></div>
      <h2 className="text-4xl font-black uppercase italic animate-pulse">Sincronizando Ecossistema...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 font-sans selection:bg-yellow-200">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* HEADER GIGANTE - IMPACTO IMEDIATO */}
        <header className="border-b-[12px] border-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="bg-green-400 border-4 border-black px-4 py-1 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Online</span>
              <span className="bg-black text-white px-4 py-1 font-black uppercase text-xs italic">PetHub v3.0</span>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter italic">
              SALVE, <span className="text-purple-600">{user?.displayName?.split(' ')[0] || "HERÓI"}!</span>
            </h1>
          </div>
          <button onClick={() => auth.signOut()} className="bg-red-500 text-white border-4 border-black p-5 font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
            <LogOut size={24} /> SAIR
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* COLUNA 01: FINANCEIRO E SAÚDE */}
          <div className="xl:col-span-4 space-y-10">
            {/* CARTEIRA */}
            <div className="border-[8px] border-black p-8 bg-yellow-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-10">
                <Wallet size={48} />
                <div className="text-right">
                  <p className="font-black uppercase text-xs bg-black text-white px-2 inline-block">Saldo Disponível</p>
                  <h2 className="text-6xl font-black leading-none mt-1">R$ 0,00</h2>
                </div>
              </div>
              <button className="w-full bg-black text-white py-5 font-black uppercase text-xl border-4 border-black hover:bg-white hover:text-black transition-all">SACAR GANHOS</button>
            </div>

            {/* RADAR DE SAÚDE */}
            <div className="border-[8px] border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(239,68,68,1)]">
              <div className="flex items-center gap-4 mb-6">
                <HeartPulse size={40} className="text-red-600 animate-pulse" />
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Radar de Saúde</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 border-4 border-black bg-gray-50 flex justify-between items-center">
                  <span className="font-black uppercase italic">Vacinas em dia</span>
                  <CheckCircle2 className="text-green-500" />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 italic">O PetHub monitora as vacinas cadastradas na ficha de cada pet.</p>
              </div>
            </div>

            {/* WIDGET DE CLIMA */}
            <div className="border-[8px] border-black p-6 bg-blue-50 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
               <div className="flex items-center gap-3 mb-4">
                  <ThermometerSun size={28} className="text-orange-500" />
                  <h3 className="font-black uppercase italic text-xl leading-none">Assistente de Clima</h3>
               </div>
               <p className="font-bold text-sm border-l-4 border-black pl-4">
                 "Tempo seco em sua região. Mantenha os bebedouros sempre cheios e limpos!"
               </p>
            </div>
          </div>

          {/* COLUNA 02: CORE, MALA E PERFIL */}
          <div className="xl:col-span-5 space-y-10">
            {/* ATALHOS PRINCIPAIS */}
            <div className="grid grid-cols-2 gap-8">
              <Link href="/meus-pets" className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)] group hover:-translate-y-2 transition-all">
                <PawPrint size={48} className="text-purple-600 mb-6" />
                <h4 className="text-3xl font-black uppercase italic leading-none">Meus<br/>Pets</h4>
              </Link>
              <Link href="/quero-cuidar" className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(250,204,21,1)] group hover:-translate-y-2 transition-all">
                <Home size={48} className="text-yellow-500 mb-6" />
                <h4 className="text-3xl font-black uppercase italic leading-none">Área<br/>Host</h4>
              </Link>
            </div>

            {/* CHECKLIST DE MALA */}
            <div className="border-[8px] border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                <CheckSquare size={36} />
                <h3 className="text-4xl font-black uppercase italic">Mala de Viagem</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Ração", "Caminha", "Brinquedos", "Guia/Coleira", "Remédios"].map(item => (
                  <div key={item} className="flex items-center gap-4 p-4 border-4 border-black font-black uppercase text-xs">
                    <input type="checkbox" className="w-6 h-6 border-4 border-black accent-purple-600 cursor-pointer" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* PET ID */}
            <div className="border-[8px] border-black p-8 bg-purple-600 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center group cursor-pointer">
              <div>
                <h3 className="text-4xl font-black uppercase italic leading-none">Pet ID Digital</h3>
                <p className="font-bold text-sm mt-2 text-purple-200 uppercase">QR Code de Emergência Gerado</p>
              </div>
              <QrCode size={80} className="group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* COLUNA 03: MENSAGENS, CONQUISTAS E FEED */}
          <div className="xl:col-span-3 space-y-10">
            {/* CONQUISTAS */}
            <div className="border-[8px] border-black p-6 bg-white shadow-[10px_10px_0px_0px_rgba(34,197,94,1)]">
              <h3 className="font-black uppercase text-sm mb-6 flex justify-between italic border-b-2 border-black pb-2">
                Conquistas 🏅
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="w-16 h-16 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-2xl" title="Pai de Pet Exemplar">🏅</div>
                <div className="w-16 h-16 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center opacity-30 text-2xl">🥈</div>
                <div className="w-16 h-16 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center opacity-30 text-2xl">🥉</div>
              </div>
            </div>

            {/* MENSAGENS RECENTES */}
            <div className="border-[8px] border-black p-6 bg-white shadow-[10px_10px_0px_0px_rgba(147,51,234,1)]">
              <div className="flex items-center gap-2 mb-6 border-b-4 border-black pb-2">
                <MessageSquare size={24} />
                <h2 className="font-black uppercase text-xl italic">Inbox</h2>
              </div>
              <div className="text-center py-8">
                <p className="font-black text-gray-300 uppercase italic text-xs leading-tight">Sua caixa de mensagens<br/>está vazia.</p>
              </div>
            </div>

            {/* FEED DE ATIVIDADE */}
            <div className="border-[8px] border-black p-6 bg-black text-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] h-[350px] flex flex-col">
              <div className="flex items-center gap-2 mb-8 border-b-2 border-white pb-2">
                <History size={24} />
                <h3 className="font-black uppercase italic text-xl">Timeline</h3>
              </div>
              <div className="space-y-8 flex-1 overflow-y-auto scrollbar-hide">
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-[10px] font-black text-purple-400 uppercase leading-none">Agora</p>
                  <p className="font-bold text-xs">Acesso ao PetHub Cockpit v3.0.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-[10px] font-black text-green-500 uppercase leading-none">2h atrás</p>
                  <p className="font-bold text-xs italic opacity-60">Base de dados sincronizada.</p>
                </div>
              </div>
            </div>

            <Link href="/search" className="block text-center p-8 border-[8px] border-black bg-purple-600 text-white font-black uppercase italic text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              BUSCAR <br/> HERÓIS
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}