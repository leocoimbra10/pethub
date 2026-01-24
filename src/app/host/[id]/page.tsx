"use client";

import { useState } from "react";
import { 
  Star, Share, Heart, MapPin, ShieldCheck, 
  Wifi, Car, Tv, Wind, CheckCircle2, ChevronDown, 
  Minus, Plus, Calendar, Flag, User
} from "lucide-react";
import Link from "next/link";

export default function HostListingPage() {
  const [guestCount, setGuestCount] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // DADOS MOCK (Ricos)
  const host = {
    id: "1",
    title: "Paraíso dos Pets na Vila Madalena com Quintal Gigante",
    rating: 4.98,
    reviewsCount: 124,
    location: "Vila Madalena, São Paulo",
    hostName: "Tia Juju",
    hostAvatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
    superHost: true,
    description: "Olá! Sou a Tia Juju, veterinária apaixonada. Minha casa tem 300m² de área verde, totalmente telada e segura. Aqui seu pet dorme dentro de casa, no sofá ou na cama (se ele for mimado rs). Tenho experiência com cães idosos e que precisam de medicação.",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2670&auto=format&fit=crop", // Main
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596230529625-7ee541366115?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2333&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2594&auto=format&fit=crop"
    ],
    amenities: [
      { icon: <Wifi size={20}/>, name: "Wifi Rápido" },
      { icon: <Car size={20}/>, name: "Estacionamento" },
      { icon: <Tv size={20}/>, name: "Câmeras 24h" },
      { icon: <Wind size={20}/>, name: "Ar Condicionado" },
      { icon: <ShieldCheck size={20}/>, name: "Veterinária no local" },
    ],
    reviews: [
      { id: 1, name: "Ricardo", date: "Outubro 2023", text: "A Juju é incrível! O Thor voltou super feliz e cansado de tanto brincar.", avatar: "R" },
      { id: 2, name: "Ana Clara", date: "Setembro 2023", text: "Melhor lugar que já deixei a Luna. As fotos diárias me deixaram muito tranquila.", avatar: "A" },
      { id: 3, name: "Marcos", date: "Agosto 2023", text: "Espaço impecável e muito seguro. Recomendo de olhos fechados.", avatar: "M" },
      { id: 4, name: "Beatriz", date: "Julho 2023", text: "Ela cuidou do meu gatinho diabético com perfeição. Gratidão!", avatar: "B" },
    ]
  };

  // Cálculos do Booking Widget
  const days = 5; // Mock diff
  const subtotal = host.price * days;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      
      {/* === 1. HEADER DO ANÚNCIO === */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase italic mb-4">{host.title}</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
           <div className="flex items-center gap-2 font-bold text-sm">
              <Star size={16} fill="black"/> 
              <span className="underline">{host.rating}</span>
              <span>·</span>
              <span className="underline">{host.reviewsCount} comentários</span>
              <span>·</span>
              <span className="underline">{host.location}</span>
           </div>
           <div className="flex gap-4">
              <button className="flex items-center gap-2 font-bold text-sm hover:bg-gray-100 px-3 py-2 rounded-lg underline"><Share size={16}/> Compartilhar</button>
              <button className="flex items-center gap-2 font-bold text-sm hover:bg-gray-100 px-3 py-2 rounded-lg underline"><Heart size={16}/> Salvar</button>
           </div>
        </div>

        {/* === 2. GALERIA DE FOTOS (MOSAICO) === */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] mb-12 rounded-xl overflow-hidden relative">
           <div className="md:col-span-2 md:row-span-2 border-4 border-black h-full">
              <img src={host.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
           </div>
           <div className="hidden md:block border-4 border-black h-full">
              <img src={host.images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
           </div>
           <div className="hidden md:block border-4 border-black h-full">
              <img src={host.images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
           </div>
           <div className="hidden md:block border-4 border-black h-full">
              <img src={host.images[3]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
           </div>
           <div className="hidden md:block border-4 border-black h-full relative">
              <img src={host.images[4]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
              <button className="absolute bottom-4 right-4 bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                 Mostrar todas as fotos
              </button>
           </div>
        </div>

        {/* === 3. CONTEÚDO PRINCIPAL (COLUNA DUPLA) === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
           
           {/* === COLUNA ESQUERDA (INFO) === */}
           <div className="md:col-span-2 space-y-10">
              
              {/* Host Header */}
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-8">
                 <div>
                    <h2 className="text-2xl font-black uppercase">Hospedado por {host.hostName}</h2>
                    <p className="text-gray-500 font-bold">2 Cães · 1 Gato · Quintal Grande</p>
                 </div>
                 <div className="relative">
                    <img src={host.hostAvatar} className="w-16 h-16 rounded-full border-4 border-black object-cover" />
                    {host.superHost && (
                       <div className="absolute -bottom-2 -right-2 bg-white p-1 border-2 border-black rounded-full shadow-sm">
                          <ShieldCheck size={16} className="text-red-500" />
                       </div>
                    )}
                 </div>
              </div>

              {/* Destaques */}
              <div className="space-y-6 border-b-2 border-gray-100 pb-8">
                 <div className="flex gap-4 items-start">
                    <CheckCircle2 size={24} className="mt-1" />
                    <div>
                       <h3 className="font-black uppercase text-sm">Veterinária Experiente</h3>
                       <p className="text-sm text-gray-500">Sabe aplicar insulina e fazer curativos.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <MapPin size={24} className="mt-1" />
                    <div>
                       <h3 className="font-black uppercase text-sm">Localização Incrível</h3>
                       <p className="text-sm text-gray-500">100% dos hóspedes recentes deram 5 estrelas para a localização.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <Calendar size={24} className="mt-1" />
                    <div>
                       <h3 className="font-black uppercase text-sm">Cancelamento Gratuito</h3>
                       <p className="text-sm text-gray-500">Cancele até 48h antes do check-in para reembolso integral.</p>
                    </div>
                 </div>
              </div>

              {/* Descrição */}
              <div className="border-b-2 border-gray-100 pb-8">
                 <h3 className="text-xl font-black uppercase italic mb-4">Sobre o espaço</h3>
                 <p className="text-gray-700 leading-relaxed whitespace-pre-line">{host.description}</p>
                 <button className="mt-4 font-black underline flex items-center gap-1 uppercase text-sm">Mostrar mais <ChevronDown size={14}/></button>
              </div>

              {/* O que oferece (Amenities) */}
              <div className="border-b-2 border-gray-100 pb-8">
                 <h3 className="text-xl font-black uppercase italic mb-6">O que esse lugar oferece</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {host.amenities.map((item, i) => (
                       <div key={i} className="flex items-center gap-3">
                          {item.icon} <span className="font-medium text-sm">{item.name}</span>
                       </div>
                    ))}
                 </div>
                 <button className="mt-8 px-6 py-3 border-2 border-black font-black uppercase text-xs rounded-lg hover:bg-gray-50">
                    Mostrar todas as 25 comodidades
                 </button>
              </div>

           </div>

           {/* === COLUNA DIREITA (STICKY BOOKING WIDGET) === */}
           <div className="relative">
              <div className="sticky top-28 bg-white border-[6px] border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                 
                 <div className="flex justify-between items-end mb-6">
                    <div>
                       <span className="text-3xl font-black">R$ {host.price}</span>
                       <span className="text-sm text-gray-500"> / noite</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold">
                       <Star size={12} fill="black"/> {host.rating} · <span className="text-gray-400 underline">{host.reviewsCount} reviews</span>
                    </div>
                 </div>

                 {/* Inputs */}
                 <div className="border-4 border-black rounded-lg mb-4 overflow-hidden">
                    <div className="flex border-b-4 border-black">
                       <div className="flex-1 p-2 border-r-4 border-black hover:bg-gray-50 cursor-pointer">
                          <label className="block text-[10px] font-black uppercase">Check-in</label>
                          <input type="date" className="w-full text-xs font-bold outline-none bg-transparent uppercase" />
                       </div>
                       <div className="flex-1 p-2 hover:bg-gray-50 cursor-pointer">
                          <label className="block text-[10px] font-black uppercase">Check-out</label>
                          <input type="date" className="w-full text-xs font-bold outline-none bg-transparent uppercase" />
                       </div>
                    </div>
                    <div className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                       <div>
                          <label className="block text-[10px] font-black uppercase">Hóspedes</label>
                          <span className="text-xs font-bold">{guestCount} pet(s)</span>
                       </div>
                       <ChevronDown size={16}/>
                    </div>
                 </div>

                 <button className="w-full bg-purple-600 text-white py-4 rounded-lg font-black uppercase text-lg border-2 border-black hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                    Reservar
                 </button>
                 <p className="text-center text-[10px] font-bold text-gray-400 mt-2">Você não será cobrado ainda</p>

                 {/* Cálculos */}
                 <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                       <span className="underline">R$ {host.price} x {days} noites</span>
                       <span>R$ {subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="underline">Taxa de serviço PetHub</span>
                       <span>R$ {serviceFee}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-black text-black text-lg">
                       <span>Total</span>
                       <span>R$ {total}</span>
                    </div>
                 </div>

              </div>
              
              <div className="mt-6 flex justify-center gap-2 items-center text-gray-400 font-bold text-xs uppercase">
                 <Flag size={12}/> Denunciar este anúncio
              </div>
           </div>

        </div>

        {/* === 4. REVIEWS (ABAIXO) === */}
        <div className="border-t-2 border-gray-100 pt-12 mt-12">
           <div className="flex items-center gap-2 mb-8">
              <Star size={24} fill="black" />
              <h2 className="text-2xl font-black uppercase">{host.rating} · {host.reviewsCount} Comentários</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {host.reviews.map(review => (
                 <div key={review.id} className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-black flex items-center justify-center font-black">
                          {review.avatar}
                       </div>
                       <div>
                          <h4 className="font-black uppercase text-sm">{review.name}</h4>
                          <p className="text-xs text-gray-500 font-bold">{review.date}</p>
                       </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                 </div>
              ))}
           </div>
           
           <button className="mt-10 px-6 py-3 border-2 border-black font-black uppercase text-xs rounded-lg hover:bg-gray-50">
              Mostrar todos os 124 comentários
           </button>
        </div>

        {/* === 5. HOST PROFILE (BOTTOM) === */}
        <div className="border-t-2 border-gray-100 pt-12 mt-12 pb-12">
           <div className="flex gap-4 items-center mb-6">
              <img src={host.hostAvatar} className="w-16 h-16 rounded-full border-4 border-black object-cover" />
              <div>
                 <h2 className="text-2xl font-black uppercase">Hospedado por {host.hostName}</h2>
                 <p className="text-gray-500 font-bold text-sm">Membro desde 2018</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                  <div className="flex gap-2">
                     <Star size={16}/> <span>124 Reviews</span>
                  </div>
                  <div className="flex gap-2">
                     <ShieldCheck size={16}/> <span>Identidade verificada</span>
                  </div>
                  <div className="flex gap-2">
                     <CheckCircle2 size={16}/> <span>Superhost</span>
                  </div>
                  <p className="text-gray-700 mt-4 leading-relaxed">
                     Sou apaixonada por animais desde criança. Me formei em veterinária em 2015 e desde então dedico minha vida a cuidar deles. Minha casa é totalmente adaptada.
                  </p>
              </div>
              <div className="space-y-4">
                  <h4 className="font-black uppercase text-sm">Tia Juju é Superhost</h4>
                  <p className="text-sm text-gray-600">Superhosts são anfitriões experientes e muito bem avaliados.</p>
                  <button className="px-6 py-3 bg-black text-white font-black uppercase text-xs rounded-lg hover:bg-gray-800">
                     Falar com o anfitrião
                  </button>
                  <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1">
                     <ShieldCheck size={10}/> Para proteger seu pagamento, nunca transfira dinheiro ou se comunique fora do site ou aplicativo PetHub.
                  </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}