"use client";

import Link from "next/link";
import { CheckCircle2, MessageSquare, MapPin, Calendar, Copy, ArrowRight, PartyPopper } from "lucide-react";

export default function SuccessPage() {
  // Mock Data (simulando o que viria do banco)
  const reservation = {
    id: "PH-8829X",
    host: "Lar da Tia Juju",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
    dates: "10/12 - 15/12",
    total: "R$ 440,00"
  };

  return (
    <div className="min-h-screen bg-green-500 text-black font-sans selection:bg-white flex items-center justify-center p-4">
      
      <div className="max-w-3xl w-full space-y-8">
        
        {/* CABEÇALHO CELEBRATIVO */}
        <div className="text-center text-white space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center">
            <div className="bg-white text-green-500 p-6 border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-full">
               <CheckCircle2 size={64} strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Tudo Certo!
          </h1>
          <p className="font-black text-xl uppercase tracking-widest bg-black inline-block px-4 py-1">
            Sua reserva foi garantida com sucesso.
          </p>
        </div>

        {/* O TICKET DOURADO */}
        <div className="bg-white border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          {/* Faixa decorativa */}
          <div className="h-4 bg-purple-500 border-b-4 border-black"></div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LADO ESQUERDO: DETALHES */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Código da Reserva</p>
                <div className="flex items-center gap-2">
                   <span className="text-4xl font-black uppercase">{reservation.id}</span>
                   <button className="text-gray-400 hover:text-black"><Copy size={16}/></button>
                </div>
              </div>

              <div className="flex items-center gap-4 border-4 border-black p-4 bg-yellow-400">
                 <img src={reservation.image} className="w-16 h-16 object-cover border-2 border-black bg-white" />
                 <div>
                    <p className="text-[10px] font-black uppercase mb-1">Hospedagem Confirmada</p>
                    <h3 className="text-xl font-black uppercase leading-none">{reservation.host}</h3>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="border-2 border-black p-2">
                    <p className="text-[9px] font-black uppercase text-gray-400">Quando</p>
                    <p className="font-bold text-sm">{reservation.dates}</p>
                 </div>
                 <div className="border-2 border-black p-2">
                    <p className="text-[9px] font-black uppercase text-gray-400">Valor Pago</p>
                    <p className="font-bold text-sm">{reservation.total}</p>
                 </div>
              </div>
            </div>

            {/* LADO DIREITO: PRÓXIMOS PASSOS */}
            <div className="border-l-4 border-black pl-8 space-y-6 flex flex-col justify-center">
               <h3 className="font-black uppercase italic text-xl mb-2">Próximos Passos</h3>
               
               <div className="space-y-4">
                  <div className="flex gap-3 items-center opacity-50">
                     <div className="bg-black text-white p-1 rounded-full"><CheckCircle2 size={12}/></div>
                     <span className="font-bold text-xs uppercase line-through">Pagamento Processado</span>
                  </div>
                  <div className="flex gap-3 items-center">
                     <div className="bg-green-500 border-2 border-black text-white p-1 rounded-full animate-bounce"><ArrowRight size={12}/></div>
                     <span className="font-bold text-xs uppercase">Anfitrião Notificado</span>
                  </div>
                  <div className="flex gap-3 items-center opacity-40">
                     <div className="border-2 border-black p-1 rounded-full w-6 h-6"></div>
                     <span className="font-bold text-xs uppercase">Check-in Realizado</span>
                  </div>
               </div>

               <div className="pt-6 space-y-3">
                  <Link href="/dashboard" className="w-full block text-center bg-black text-white border-4 border-black py-3 font-black uppercase text-sm hover:bg-purple-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                     Gerenciar Viagem
                  </Link>
                  <button className="w-full flex items-center justify-center gap-2 text-center bg-white text-black border-4 border-black py-3 font-black uppercase text-sm hover:bg-gray-100 transition-all">
                     <MessageSquare size={16} /> Falar com Anfitrião
                  </button>
               </div>
            </div>

          </div>
          
          {/* Footer do Ticket */}
          <div className="bg-gray-100 border-t-4 border-black p-4 text-center">
             <p className="text-[10px] font-black uppercase text-gray-400">Um recibo detalhado foi enviado para seu e-mail.</p>
          </div>
        </div>

      </div>
    </div>
  );
}