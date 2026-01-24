"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Star, Wifi, Dog, Cat, MapPin, ChevronLeft, ChevronRight, 
  Heart, Share2, Calendar, User, ArrowRight 
} from 'lucide-react';

// Dados Mockados (enquanto o Firebase não vem)
const hostMockData = {
  name: "Lar da Tia Juju",
  rating: 4.9,
  reviews: 18,
  superhost: true,
  avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598875704239-076b4a1f7c32?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556228852-6d45a7d85134?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=2574&auto=format&fit=crop"
  ],
  description: "Amante de animais desde pequena, decidi transformar minha paixão em profissão. Minha casa tem um quintal enorme e seguro, perfeito para seu pet correr e brincar. Faço tudo para que eles se sintam amados e cuidados como se estivessem em seu próprio lar.",
  amenities: ["Quintal Grande", "Aceita Cães e Gatos", "Wi-Fi para os donos", "Ambiente Climatizado"],
  price: 80,
  location: "Copacabana, Rio de Janeiro"
};

const reviewsMockData = [
    { id: 1, author: "Mariana L.", rating: 5, text: "A Juju é incrível! Meu cachorro voltou super feliz e cansado de tanto brincar. Recomendo de olhos fechados!" },
    { id: 2, author: "Pedro R.", rating: 4, text: "Ótima cuidadora, mandou fotos todos os dias. Só achei um pouco longe da minha casa, mas valeu a pena." },
];


export default function HostProfilePage({ params }: { params: { id: string } }) {
  // Por enquanto, usamos o Mock. Quando o back-end estiver pronto,
  // usaremos o ID de `params.id` para buscar os dados no Firebase.
  const host = hostMockData; 

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-yellow-200">
      
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">

        {/* 1. HEADER COM NOME E AVALIAÇÃO */}
        <header className="space-y-2 border-b-4 border-black pb-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none">
                {host.name}
            </h1>
            <div className="flex items-center gap-4 font-bold uppercase text-sm">
                <div className="flex items-center gap-1 bg-yellow-400 px-2 py-1 border-2 border-black">
                    <Star size={14} fill="black" />
                    <span>{host.rating}</span>
                    <span className="hidden md:inline">({host.reviews} reviews)</span>
                </div>
                {host.superhost && <span className="bg-purple-600 text-white px-2 py-1 border-2 border-black">Superhost</span>}
                <div className="hidden md:flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{host.location}</span>
                </div>
                <div className="ml-auto flex gap-2">
                    <button className="h-10 w-10 border-4 border-black bg-white hover:bg-black hover:text-white transition-all flex justify-center items-center"><Share2 size={20}/></button>
                    <button className="h-10 w-10 border-4 border-black bg-white hover:bg-red-500 hover:text-white transition-all flex justify-center items-center"><Heart size={20}/></button>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* COLUNA PRINCIPAL (ESQUERDA) */}
            <main className="lg:col-span-2 space-y-12">
                
                {/* 2. GALERIA DE FOTOS NEO-BRUTALISTA */}
                <section className="relative border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 p-4">
                    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="col-span-2 row-span-2 relative overflow-hidden border-4 border-black">
                             <img src={host.avatar} className="w-full h-full object-cover" />
                        </div>
                    </div>
                     <div className="absolute bottom-4 right-4 flex gap-2">
                        <button className="h-12 w-12 bg-white border-4 border-black hover:bg-black hover:text-white transition-all flex justify-center items-center"><ChevronLeft/></button>
                        <button className="h-12 w-12 bg-white border-4 border-black hover:bg-black hover:text-white transition-all flex justify-center items-center"><ChevronRight/></button>
                    </div>
                </section>
                
                {/* 3. BIO DO ANFITRIÃO */}
                <section>
                    <h2 className="text-3xl font-black uppercase italic mb-4">Sobre o Anfitrião</h2>
                    <div className="bg-gray-100 border-4 border-black p-6 space-y-4">
                        <p className="font-medium leading-relaxed">{host.description}</p>
                        <div className="flex flex-wrap gap-3 pt-4">
                            {host.amenities.map(item => (
                                <span key={item} className="bg-white border-2 border-black px-3 py-1 font-bold text-xs uppercase">{item}</span>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* 4. AVALIAÇÕES */}
                <section>
                    <h2 className="text-3xl font-black uppercase italic mb-4">O que os hóspedes dizem</h2>
                    <div className="space-y-6">
                        {reviewsMockData.map(review => (
                            <div key={review.id} className="border-4 border-black p-6 bg-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-200 border-2 border-black flex items-center justify-center font-black text-xl uppercase">
                                        {review.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black uppercase">{review.author}</h4>
                                            <div className="flex items-center gap-1 text-xs font-bold bg-yellow-400 px-1 border border-black">
                                                <Star size={10} fill="black" /> {review.rating}.0
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{review.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                {/* 5. LOCALIZAÇÃO */}
                 <section>
                    <h2 className="text-3xl font-black uppercase italic mb-4">Localização</h2>
                    <div className="border-[6px] border-black h-64 bg-gray-200 flex items-center justify-center">
                        <p className="font-black text-gray-400 uppercase">[Componente de Mapa Interativo]</p>
                    </div>
                    <p className="font-bold mt-2">{host.location}</p>
                    <p className="text-sm text-gray-500">O endereço exato será fornecido após a confirmação da reserva.</p>
                </section>

            </main>

            {/* COLUNA LATERAL (DIREITA) - CARD DE RESERVA */}
            <aside className="lg:col-span-1">
                <div className="sticky top-8 border-[6px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(147,51,234,1)]">
                    <div className="p-6 space-y-6">
                        <div className="text-center">
                            <p className="font-bold">A partir de</p>
                            <p className="text-5xl font-black">R$ {host.price}<span className="text-lg font-bold">/noite</span></p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="font-black text-xs uppercase">Check-in</label>
                              <input type="text" placeholder="10/12/2024" className="w-full border-4 border-black p-2 font-bold" />
                           </div>
                           <div>
                              <label className="font-black text-xs uppercase">Check-out</label>
                              <input type="text" placeholder="15/12/2024" className="w-full border-4 border-black p-2 font-bold" />
                           </div>
                        </div>

                         <div>
                            <label className="font-black text-xs uppercase">Hóspedes Pet</label>
                            <select className="w-full border-4 border-black p-2 font-bold bg-white">
                                <option>1 Cão</option>
                                <option>2 Cães</option>
                                <option>1 Gato</option>
                            </select>
                         </div>
                        
                        <button className="w-full bg-green-500 text-black border-4 border-black py-4 font-black uppercase text-lg hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none">
                            Reservar Agora
                        </button>
                        
                        <div className="text-center text-xs font-bold text-gray-500">Você ainda não será cobrado.</div>

                    </div>
                    
                    <div className="border-t-4 border-black bg-gray-100 p-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span>R$ {host.price} x 5 noites</span>
                            <span>R$ 400,00</span>
                        </div>
                         <div className="flex justify-between items-center text-sm font-bold">
                            <span>Taxa de Serviço</span>
                            <span>R$ 40,00</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-black mt-4 pt-4 border-t-2 border-dashed border-gray-400">
                            <span>Total</span>
                            <span>R$ 440,00</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
}
