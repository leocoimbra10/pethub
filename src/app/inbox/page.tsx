"use client";

import { useState } from "react";
import { 
  Send, Paperclip, MoreVertical, Phone, ShieldCheck, 
  Calendar, DollarSign, CheckCircle2, User, ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function InboxPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  // MOCK: Lista de Conversas
  const conversations = [
    {
      id: 1,
      name: "Lar da Tia Juju",
      avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
      lastMessage: "Claro! Pode trazer a ração dele sim.",
      time: "10:42",
      unread: 2,
      status: "online",
      role: "Anfitrião"
    },
    {
      id: 2,
      name: "Ricardo Souza",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
      lastMessage: "Qual o endereço exato?",
      time: "Ontem",
      unread: 0,
      status: "offline",
      role: "Tutor"
    }
  ];

  // MOCK: Histórico de Mensagens do Chat 1
  const [messages, setMessages] = useState([
    { id: 1, sender: "them", text: "Olá! Vi que você tem interesse nas datas 10 a 15 de Dezembro. Tudo certo?", time: "10:30" },
    { id: 2, sender: "me", text: "Oi Juju! Sim, mas o Thor precisa tomar remédio às 14h. Você consegue dar?", time: "10:32" },
    { id: 3, sender: "them", text: "Sem problemas! Sou técnica veterinária, tenho experiência com medicação oral e injetável.", time: "10:35" },
    { id: 4, sender: "me", text: "Ah que ótimo! E sobre a alimentação, eu levo?", time: "10:40" },
    { id: 5, sender: "them", text: "Claro! Pode trazer a ração dele sim. Assim ele não estranha a mudança.", time: "10:42" }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "me", text: newMessage, time: "Agora" }]);
    setNewMessage("");
  };

  return (
    <div className="h-screen bg-white text-black font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* === COLUNA ESQUERDA: LISTA DE CONVERSAS === */}
      <div className="w-full md:w-1/3 border-r-[6px] border-black flex flex-col h-full bg-gray-50">
        
        {/* Header Lista */}
        <div className="p-6 border-b-4 border-black bg-white flex justify-between items-center">
           <div className="flex items-center gap-3">
              <Link href="/dashboard" className="md:hidden"><ArrowLeft/></Link>
              <h1 className="text-2xl font-black uppercase italic">Inbox</h1>
           </div>
           <span className="bg-red-500 text-white px-2 py-1 text-[10px] font-black uppercase rounded-full border-2 border-black">2 Novas</span>
        </div>

        {/* Lista Scrollável */}
        <div className="flex-1 overflow-y-auto">
           {conversations.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b-2 border-black cursor-pointer hover:bg-gray-200 transition-all flex gap-4 items-center ${activeChat === chat.id ? 'bg-black text-white' : 'bg-white'}`}
              >
                 <div className="relative">
                    <img src={chat.avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    {chat.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                       <h3 className="font-black uppercase truncate">{chat.name}</h3>
                       <span className={`text-[10px] font-bold ${activeChat === chat.id ? 'text-gray-400' : 'text-gray-500'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-sm truncate ${activeChat === chat.id ? 'text-gray-300' : 'text-gray-600'}`}>{chat.lastMessage}</p>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* === COLUNA DIREITA: CHAT ATIVO === */}
      <div className="w-full md:w-2/3 flex flex-col h-full relative bg-[#f0f0f0]">
        
        {/* 1. Header do Chat */}
        <div className="p-4 border-b-4 border-black bg-white flex justify-between items-center shadow-sm z-20">
           <div className="flex items-center gap-3">
              <img src={conversations[0].avatar} className="w-10 h-10 rounded-full border-2 border-black object-cover" />
              <div>
                 <h2 className="font-black uppercase text-lg leading-none flex items-center gap-2">
                    {conversations[0].name} <ShieldCheck size={16} className="text-green-500"/>
                 </h2>
                 <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Responde rápido
                 </p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"><Phone size={20}/></button>
              <button className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"><MoreVertical size={20}/></button>
           </div>
        </div>

        {/* 2. CARD DE CONTEXTO (NEGOCIAÇÃO) */}
        <div className="bg-yellow-400 border-b-4 border-black p-3 flex flex-col md:flex-row justify-between items-center gap-3 z-10 shadow-md">
           <div className="flex items-center gap-4">
              <div className="bg-black text-white p-2 border-2 border-white">
                 <Calendar size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-black/60">Solicitação de Reserva</p>
                 <p className="font-black text-sm uppercase">10 Dez - 15 Dez • 1 Cão (Thor)</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <p className="font-black text-xl">R$ 450</p>
              <Link href="/checkout" className="bg-black text-white px-4 py-2 font-black uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]">
                 Fechar Reserva
              </Link>
           </div>
        </div>

        {/* 3. Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
           {/* Data Divisor */}
           <div className="flex justify-center">
              <span className="bg-gray-200 text-gray-600 px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-gray-300">Hoje</span>
           </div>

           {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] md:max-w-[60%] p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] relative ${msg.sender === 'me' ? 'bg-black text-white rounded-tl-2xl rounded-tr-none rounded-bl-2xl rounded-br-2xl' : 'bg-white text-black rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'}`}>
                    <p className="font-bold text-sm leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] font-black uppercase mt-2 block text-right ${msg.sender === 'me' ? 'text-gray-400' : 'text-gray-400'}`}>
                       {msg.time} {msg.sender === 'me' && <CheckCircle2 size={10} className="inline ml-1"/>}
                    </span>
                 </div>
              </div>
           ))}
        </div>

        {/* 4. Input Area */}
        <div className="p-4 bg-white border-t-4 border-black">
           <form onSubmit={handleSend} className="flex gap-4 items-end">
              <button type="button" className="p-3 bg-gray-100 border-4 border-black hover:bg-gray-200 transition-all text-gray-500">
                 <Paperclip size={20} />
              </button>
              <div className="flex-1 border-4 border-black bg-gray-50 p-3 focus-within:bg-white focus-within:shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] transition-all">
                 <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..." 
                    className="w-full bg-transparent outline-none font-bold text-sm"
                 />
              </div>
              <button type="submit" className="p-3 bg-purple-600 text-white border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                 <Send size={20} strokeWidth={3} />
              </button>
           </form>
        </div>

      </div>
    </div>
  );
}