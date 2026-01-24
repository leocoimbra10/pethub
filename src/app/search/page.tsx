"use client";

import { useState } from "react";
import { 
  Search, Heart, Star, MapPin, Filter, 
  Home, Building, Trees, Waves, Dog, Cat 
} from "lucide-react";
import Link from "next/link";

export default function SearchAirbnbStylePage() {
  const [liked, setLiked] = useState<number[]>([]);

  // Categorias (Filtros Rápidos)
  const categories = [
    { name: "Casas", icon: <Home size={20}/> },
    { name: "Apartamentos", icon: <Building size={20}/> },
    { name: "Sítios", icon: <Trees size={20}/> },
    { name: "Com Piscina", icon: <Waves size={20}/> },
    { name: "Aceita Gatos", icon: <Cat size={20}/> },
    { name: "Aceita Gigantes", icon: <Dog size={20}/> },
  ];

  // Mock Data (Resultados)
  const listings = [
    {
      id: 1,
      host: "Lar da Tia Juju",
      location: "Vila Madalena, SP",
      rating: 4.98,
      distance: "3 km de você",
      dates: "12-17 Dez",
      price: 120,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
      superHost: true
    },
    {
      id: 2,
      host: "Resort do Totó",
      location: "Copacabana, RJ",
      rating: 4.85,
      distance: "Frente ao mar",
      dates: "05-10 Jan",
      price: 250,
      image: "https://images.unsplash.com/photo-1596230529625-7ee541366115?q=80&w=2670&auto=format&fit=crop",
      superHost: false
    },
    {
      id: 3,
      host: "Cantinho da Paz",
      location: "Belo Horizonte, MG",
      rating: 5.0,
      distance: "Bairro tranquilo",
      dates: "Disponível hoje",
      price: 90,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop",
      superHost: true
    },
    {
      id: 4,
      host: "Hotelzinho VIP",
      location: "Brasília, DF",
      rating: 4.7,
      distance: "Área nobre",
      dates: "Fim de semana",
      price: 180,
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2874&auto=format&fit=crop",
      superHost: false
    },
    {
      id: 5,
      host: "Sítio dos Peludos",
      location: "Interior, SP",
      rating: 4.95,
      distance: "Muita grama",
      dates: "Natal e Ano Novo",
      price: 300,
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2824&auto=format&fit=crop",
      superHost: true
    },
    {
      id: 6,
      host: "Apto Telado Seguro",
      location: "Curitiba, PR",
      rating: 4.88,
      distance: "Centro Cívico",
      dates: "Livre agora",
      price: 75,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2843&auto=format&fit=crop",
      superHost: false
    },
    {
      id: 7,
      host: "Casa de Vó",
      location: "Recife, PE",
      rating: 5.0,
      distance: "Perto da praia",
      dates: "Janeiro",
      price: 110,
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2333&auto=format&fit=crop",
      superHost: true
    },
    {
      id: 8,
      host: "Refúgio Pet",
      location: "Porto Alegre, RS",
      rating: 4.9,
      distance: "Moinhos de Vento",
      dates: "Fev 10-15",
      price: 140,
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2594&auto=format&fit=crop",
      superHost: false
    }
  ];

  const toggleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(i => i !== id));
    } else {
      setLiked([...liked, id]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      
      {/* === 1. HEADER FLUTUANTE (SEARCH PILL) === */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-gray-100 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
           
           {/* A Pílula de Busca */}
           <div className="flex items-center bg-white border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer w-full max-w-3xl overflow-hidden">
              
              <div className="flex-1 px-6 py-3 border-r-2 border-gray-200 hover:bg-gray-50">
                 <p className="text-[10px] font-black uppercase">Onde</p>
                 <input type="text" placeholder="Buscar destinos" className="w-full text-sm font-bold outline-none bg-transparent placeholder:text-gray-400" />
              </div>
              
              <div className="hidden md:block flex-1 px-6 py-3 border-r-2 border-gray-200 hover:bg-gray-50">
                 <p className="text-[10px] font-black uppercase">Quando</p>
                 <p className="text-sm font-bold text-gray-400">Insira as datas</p>
              </div>
              
              <div className="flex-1 px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                 <div>
                    <p className="text-[10px] font-black uppercase">Quem</p>
                    <p className="text-sm font-bold text-gray-400">Adicionar pets</p>
                 </div>
                 <div className="bg-purple-600 text-white p-3 rounded-full hover:bg-black transition-colors">
                    <Search size={18} strokeWidth={3} />
                 </div>
              </div>

           </div>

           {/* Categorias (Ícones) */}
           <div className="w-full flex gap-8 overflow-x-auto pb-2 no-scrollbar justify-start md:justify-center border-t border-gray-100 pt-4">
              {categories.map((cat, i) => (
                 <button key={i} className="flex flex-col items-center gap-2 min-w-[60px] opacity-60 hover:opacity-100 hover:border-b-2 border-black pb-2 transition-all group">
                    <div className="group-hover:scale-110 transition-transform">{cat.icon}</div>
                    <span className="text-[10px] font-bold uppercase whitespace-nowrap">{cat.name}</span>
                 </button>
              ))}
              <button className="flex flex-col items-center gap-2 min-w-[60px] ml-auto md:ml-0 opacity-60 hover:opacity-100">
                 <div className="border-2 border-black p-1 rounded-lg"><Filter size={16}/></div>
                 <span className="text-[10px] font-bold uppercase whitespace-nowrap">Filtros</span>
              </button>
           </div>

        </div>
      </div>

      {/* === 2. GRID DE RESULTADOS (AIRBNB STYLE) === */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
         
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map(item => (
               <Link href={`/host/${item.id}`} key={item.id} className="group cursor-pointer">
                  
                  {/* IMAGEM CARD */}
                  <div className="relative aspect-square overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all bg-gray-100 mb-3 rounded-2xl">
                     <img src={item.image} alt={item.host} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     
                     {/* Overlay: Super Host */}
                     {item.superHost && (
                        <div className="absolute top-3 left-3 bg-white border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase shadow-sm">
                           Preferido dos hóspedes
                        </div>
                     )}

                     {/* Overlay: Like */}
                     <button 
                        onClick={(e) => { e.preventDefault(); toggleLike(item.id); }}
                        className="absolute top-3 right-3 text-white hover:scale-110 transition-transform"
                     >
                        <Heart size={24} fill={liked.includes(item.id) ? "red" : "rgba(0,0,0,0.5)"} stroke={liked.includes(item.id) ? "red" : "white"} strokeWidth={2} />
                     </button>
                  </div>

                  {/* INFO CARD */}
                  <div className="space-y-1">
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[15px] leading-tight truncate pr-2">{item.location}</h3>
                        <div className="flex items-center gap-1 text-[14px]">
                           <Star size={12} fill="black" />
                           <span>{item.rating}</span>
                        </div>
                     </div>
                     
                     <p className="text-gray-500 text-[14px] leading-tight truncate">{item.distance}</p>
                     <p className="text-gray-500 text-[14px] leading-tight">{item.dates}</p>
                     
                     <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-black text-[16px]">R$ {item.price}</span>
                        <span className="text-sm">noite</span>
                     </div>
                  </div>

               </Link>
            ))}
         </div>

      </main>

    </div>
  );
}