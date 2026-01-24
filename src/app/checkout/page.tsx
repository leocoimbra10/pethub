"use client";

import { useState } from "react";
import { ShieldCheck, Lock, CreditCard, QrCode, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Mock Data (Viria do passo anterior na vida real)
  const booking = {
    hostName: "Mariana Silva",
    hostPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    checkIn: "10/12/2024",
    checkOut: "15/12/2024",
    nights: 5,
    pricePerNight: 80,
    serviceFee: 40, // Taxa do PetHub
  };

  const subtotal = booking.nights * booking.pricePerNight;
  const total = subtotal + booking.serviceFee;

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Pagamento Simulado com Sucesso! 💰");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-green-200">
      
      {/* HEADER DE SEGURANÇA */}
      <div className="bg-black text-white p-4 text-center font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
        <Lock size={14} className="text-green-500" /> Ambiente Seguro SSL de 256-bits
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUNA ESQUERDA: DADOS E PAGAMENTO */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <Link href="/search" className="font-black text-xs uppercase text-gray-400 hover:text-black mb-4 block">← Cancelar e Voltar</Link>
            <h1 className="text-5xl font-black uppercase italic leading-none">Finalizar Reserva</h1>
            <p className="font-bold text-gray-500 mt-2">Você está a um passo de garantir as férias do seu pet.</p>
          </div>

          {/* PASSO 1: SEUS DADOS */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
             <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
               <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span> Seus Dados
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="NOME COMPLETO" className="w-full p-4 border-4 border-black font-black text-xs uppercase outline-none bg-gray-50" />
                <input type="email" placeholder="SEU E-MAIL" className="w-full p-4 border-4 border-black font-black text-xs uppercase outline-none bg-gray-50" />
                <input type="text" placeholder="CPF" className="w-full p-4 border-4 border-black font-black text-xs uppercase outline-none bg-gray-50" />
                <input type="text" placeholder="CELULAR" className="w-full p-4 border-4 border-black font-black text-xs uppercase outline-none bg-gray-50" />
             </div>
          </section>

          {/* PASSO 2: PAGAMENTO */}
          <section className="border-[6px] border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(168,85,247,1)]">
             <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
               <span className="bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span> Pagamento
             </h3>
             
             {/* SELETOR DE MÉTODO */}
             <div className="flex gap-4 mb-8">
                <button onClick={() => setMethod('card')} className={`flex-1 p-4 border-4 border-black font-black uppercase flex items-center justify-center gap-2 transition-all ${method === 'card' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                   <CreditCard size={20} /> Cartão
                </button>
                <button onClick={() => setMethod('pix')} className={`flex-1 p-4 border-4 border-black font-black uppercase flex items-center justify-center gap-2 transition-all ${method === 'pix' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
                   <QrCode size={20} /> PIX
                </button>
             </div>

             {method === 'card' ? (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <input type="text" placeholder="NÚMERO DO CARTÃO" className="w-full p-4 border-4 border-black font-black text-lg outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="VALIDADE (MM/AA)" className="w-full p-4 border-4 border-black font-black outline-none" />
                     <input type="text" placeholder="CVV" className="w-full p-4 border-4 border-black font-black outline-none" />
                  </div>
                  <input type="text" placeholder="NOME NO CARTÃO" className="w-full p-4 border-4 border-black font-black text-xs uppercase outline-none" />
               </div>
             ) : (
               <div className="bg-yellow-50 border-4 border-black p-8 text-center animate-in fade-in slide-in-from-top-2">
                  <QrCode size={80} className="mx-auto mb-4" />
                  <p className="font-black text-sm uppercase">O QR Code será gerado na próxima tela.</p>
                  <p className="text-xs font-bold text-gray-500 mt-2">Aprovação imediata + 5% de desconto.</p>
               </div>
             )}
          </section>

          {/* GARANTIAS */}
          <div className="flex items-start gap-4 p-4 bg-green-50 border-l-8 border-green-500">
             <ShieldCheck size={32} className="text-green-600 shrink-0" />
             <div>
                <h4 className="font-black uppercase text-sm text-green-700">Garantia PetHub Safe™</h4>
                <p className="text-xs font-bold text-gray-600 mt-1">Seu pagamento fica retido conosco. O anfitrião só recebe 24h após o check-out, garantindo que seu pet foi bem cuidado.</p>
             </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO (STICKY) */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 border-[6px] border-black bg-yellow-400 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
             <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-black pb-4">Resumo</h2>
             
             {/* CARD DO HOST */}
             <div className="flex items-center gap-4 mb-6">
                <img src={booking.hostPhoto} className="w-16 h-16 border-4 border-black object-cover bg-white" />
                <div>
                   <p className="text-[10px] font-black uppercase opacity-60">Hospedagem com</p>
                   <p className="text-xl font-black uppercase leading-none">{booking.hostName}</p>
                </div>
             </div>

             {/* DATAS */}
             <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-white border-4 border-black p-3">
                   <p className="text-[10px] font-black uppercase text-gray-400">Entrada</p>
                   <p className="font-black text-sm flex items-center gap-2"><Calendar size={12}/> {booking.checkIn}</p>
                </div>
                <div className="bg-white border-4 border-black p-3">
                   <p className="text-[10px] font-black uppercase text-gray-400">Saída</p>
                   <p className="font-black text-sm flex items-center gap-2"><Calendar size={12}/> {booking.checkOut}</p>
                </div>
             </div>

             {/* PREÇO DETALHADO */}
             <div className="space-y-3 border-t-4 border-black pt-6 mb-6">
                <div className="flex justify-between font-bold text-sm">
                   <span>R${booking.pricePerNight} x {booking.nights} noites</span>
                   <span>R${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-purple-700">
                   <span className="flex items-center gap-1">Taxa de Serviço <CheckCircle2 size={12}/></span>
                   <span>R${booking.serviceFee.toFixed(2)}</span>
                </div>
             </div>

             {/* TOTAL */}
             <div className="bg-black text-white p-4 border-4 border-white flex justify-between items-center mb-6">
                <span className="font-black uppercase">Total</span>
                <span className="text-2xl font-black">R${total.toFixed(2)}</span>
             </div>

             <button onClick={handlePayment} disabled={loading} className="w-full bg-white text-black py-4 font-black uppercase text-xl border-4 border-black hover:bg-green-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex justify-center gap-2">
                {loading ? "PROCESSANDO..." : <>CONFIRMAR PAGAMENTO <ArrowRight /></>}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}