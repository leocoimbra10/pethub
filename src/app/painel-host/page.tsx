"use client";

import { useState, useEffect } from "react"; // Adicionado useEffect
import { auth } from "@/lib/firebase"; // Importar Auth
import { onAuthStateChanged } from "firebase/auth"; // Importar Listener
import Link from "next/link";
import { 
  DollarSign, Calendar, TrendingUp, CheckCircle2, XCircle, 
  MessageSquare, User, Clock, ArrowUpRight, Star 
} from "lucide-react";

export default function PainelHostPage() {
  const [user, setUser] = useState<any>(null); // Estado para o usuário

  // Efeito para pegar o ID do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Mock Data (Mantido igual)
  const [requests, setRequests] = useState([
    {
      id: 1,
      owner: "Ricardo Souza",
      pet: "Thor",
      petType: "Cão (Golden)",
      dates: "10 Dez - 15 Dez",
      nights: 5,
      total: 400,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
      status: "pending"
    },
    {
      id: 2,
      owner: "Ana Clara",
      pet: "Mia",
      petType: "Gato (Siamês)",
      dates: "20 Dez - 22 Dez",
      nights: 2,
      total: 160,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      status: "pending"
    }
  ]);

  const handleAction = (id: number, action: 'accept' | 'reject') => {
    alert(action === 'accept' ? "Reserva Aceita! 🎉" : "Reserva Recusada.");
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans selection:bg-purple-200 p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER EXECUTIVO COM LINK REAL */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-black pb-6">
          <div>
            <p className="font-black text-xs uppercase text-gray-500 mb-1">Painel do Anfitrião</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic leading-none">
              Gestão <span className="text-purple-600">Pro.</span>
            </h1>
          </div>
          <div className="flex gap-3">
             <Link href="/host/editar" className="bg-white border-4 border-black px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                <User size={16} /> Editar Perfil
             </Link>
             
             {/* BOTÃO MÁGICO CORRIGIDO */}
             <Link 
                href={user ? `/host/${user.uid}` : '#'} 
                className={`bg-black text-white border-4 border-black px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] transition-all flex items-center gap-2 ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500 hover:text-black'}`}
             >
                Ver meu Anúncio <ArrowUpRight size={16} />
             </Link>
          </div>
        </header>

        {/* RESTANTE DO CÓDIGO MANTIDO IGUAL AO ANTERIOR... */}
        {/* ... (Copie os widgets de Saldo, Performance e Lista de Pedidos aqui) ... */}
        {/* Para economizar espaço aqui no chat, o agente deve manter o resto do conteúdo igual ao prompt anterior */}
        
        {/* 2. KPIs (O DINHEIRO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-500 text-black border-[6px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="flex justify-between items-start mb-4">
                <div className="bg-black text-white p-2 border-2 border-white">
                   <DollarSign size={24} />
                </div>
                <span className="font-black text-[10px] uppercase bg-white px-2 py-1 border-2 border-black">Disponível</span>
             </div>
             <p className="font-black text-sm uppercase opacity-70">Saldo em Conta</p>
             <h2 className="text-5xl font-black tracking-tighter">R$ 1.250<span className="text-2xl">,00</span></h2>
             <button className="mt-4 w-full bg-black text-white py-2 font-black uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all">
                Solicitar Saque
             </button>
          </div>

          <div className="bg-white border-[6px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-lg italic">Performance</h3>
                <TrendingUp className="text-purple-600" />
             </div>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-xs font-black uppercase mb-1">
                      <span>Taxa de Resposta</span>
                      <span className="text-green-600">98%</span>
                   </div>
                   <div className="w-full h-3 bg-gray-200 border-2 border-black">
                      <div className="h-full bg-green-500 w-[98%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs font-black uppercase mb-1">
                      <span>Avaliação Média</span>
                      <span className="text-yellow-500 flex items-center gap-1">4.9 <Star size={10} fill="currentColor"/></span>
                   </div>
                   <div className="w-full h-3 bg-gray-200 border-2 border-black">
                      <div className="h-full bg-yellow-400 w-[95%]"></div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-yellow-400 border-[6px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
             <div className="flex items-center gap-2 mb-2">
                <Calendar size={24} />
                <h3 className="font-black uppercase text-lg italic">Agenda Dezembro</h3>
             </div>
             <div className="flex gap-1 justify-between text-center">
                {[10, 11, 12, 13, 14, 15, 16].map(day => (
                   <div key={day} className={`flex-1 border-2 border-black p-1 ${day >= 12 && day <= 14 ? 'bg-red-500 text-white' : 'bg-white'}`}>
                      <span className="text-[10px] font-black block">DIA</span>
                      <span className="text-lg font-black">{day}</span>
                   </div>
                ))}
             </div>
             <p className="text-[10px] font-black uppercase text-center mt-4">3 dias ocupados esta semana</p>
          </div>
        </div>

        <section>
           <h2 className="text-3xl font-black uppercase italic mb-6 flex items-center gap-3">
              <Clock className="text-purple-600" /> Solicitações Pendentes <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full border-2 border-black">{requests.length}</span>
           </h2>

           <div className="space-y-4">
              {requests.length === 0 ? (
                 <div className="p-10 border-4 border-dashed border-gray-300 text-center font-black text-gray-400 uppercase">
                    Tudo limpo! Nenhuma solicitação pendente.
                 </div>
              ) : (
                 requests.map(req => (
                    <div key={req.id} className="bg-white border-[6px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] flex flex-col md:flex-row justify-between items-center gap-6">
                       
                       <div className="flex items-center gap-4 w-full md:w-auto">
                          <img src={req.avatar} className="w-16 h-16 border-4 border-black object-cover" />
                          <div>
                             <h4 className="text-xl font-black uppercase leading-none">{req.owner}</h4>
                             <p className="text-sm font-bold text-gray-500 uppercase flex items-center gap-1 mt-1">
                                <span className="bg-gray-200 px-1 border border-black text-[10px]">Tutor de</span> {req.pet} • {req.petType}
                             </p>
                          </div>
                       </div>

                       <div className="flex gap-8 text-center border-l-0 md:border-l-4 border-gray-200 pl-0 md:pl-8 w-full md:w-auto justify-center md:justify-start">
                          <div>
                             <p className="text-[10px] font-black uppercase text-gray-400">Entrada</p>
                             <p className="font-black text-lg">{req.dates.split(' - ')[0]}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-gray-400">Saída</p>
                             <p className="font-black text-lg">{req.dates.split(' - ')[1]}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-gray-400">Ganhos</p>
                             <p className="font-black text-lg text-green-600">R$ {req.total}</p>
                          </div>
                       </div>

                       <div className="flex gap-3 w-full md:w-auto">
                          <button onClick={() => handleAction(req.id, 'reject')} className="flex-1 md:flex-none border-4 border-black px-4 py-3 font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                             <XCircle size={18} /> Recusar
                          </button>
                          <button onClick={() => handleAction(req.id, 'accept')} className="flex-1 md:flex-none bg-black text-white border-4 border-black px-6 py-3 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                             <CheckCircle2 size={18} /> Aceitar
                          </button>
                       </div>
                    </div>
                 ))
              )}
           </div>
        </section>

      </div>
    </div>
  );
}