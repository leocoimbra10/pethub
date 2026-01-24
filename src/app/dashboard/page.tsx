"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Plane, Calendar, MapPin, MessageCircle, Heart, Plus, 
  Settings, ShieldCheck, Clock, Star, History, DollarSign, Briefcase, ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardHibridoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [hostData, setHostData] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'trips' | 'pets' | 'favorites'>('trips');
  const [loading, setLoading] = useState(true);

  // MOCK DATA (Tutor)
  const trips = [
    {
      id: "TRIP-992",
      hostName: "Lar da Tia Juju",
      hostPhoto: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
      dates: "Hoje - 18 Out",
      status: "live",
      address: "Rua Harmonia, 123 - Vila Madalena",
      price: 240
    },
    {
      id: "TRIP-881",
      hostName: "Resort do Totó",
      hostPhoto: "https://images.unsplash.com/photo-1596230529625-7ee541366115?q=80&w=2670&auto=format&fit=crop",
      dates: "20 Dez - 27 Dez",
      status: "confirmed",
      address: "Av. Paulista, 2000 - Bela Vista",
      price: 890
    }
  ];

  const myPets = [
    { id: 1, name: "Paçoca", breed: "Golden Retriever", age: "3 anos", vaccines: "Em dia", photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2824&auto=format&fit=crop" },
    { id: 2, name: "Luna", breed: "SRD", age: "1 ano", vaccines: "Pendente", photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2874&auto=format&fit=crop" }
  ];

  const favorites = [
    { id: 1, name: "DogHero Pro", rating: 5.0, price: 90, photo: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=200" }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        
        // VERIFICA SE É ANFITRIÃO
        const q = query(collection(db, "hosts"), where("ownerId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            setIsHost(true);
            setHostData(snapshot.docs[0].data());
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase">Carregando Seu Mundo...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-yellow-200">
      
      {/* HEADER HÍBRIDO */}
      <header className="bg-black text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-white bg-gray-800 rounded-full flex items-center justify-center text-4xl font-black">
                  {user?.email?.[0].toUpperCase()}
               </div>
               <div>
                  <h1 className="text-2xl md:text-3xl font-black uppercase italic">Olá, {user?.displayName || "Márcio"}</h1>
                  <p className="text-gray-400 text-sm font-bold">Gerencie pets e viagens.</p>
                  
                  {/* BOTÃO RÁPIDO ADD PET */}
                  <Link href="/meus-pets/novo" className="mt-2 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1 rounded text-xs font-black uppercase transition-all">
                     <Plus size={14} /> Adicionar Novo Pet
                  </Link>
               </div>
            </div>

            {/* WIDGET DO ANFITRIÃO (A PONTE ENTRE OS MUNDOS) */}
            <div className="w-full md:w-auto">
               {isHost ? (
                  <Link href="/painel-host" className="group block bg-yellow-400 text-black border-4 border-white p-4 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 transition-all">
                     <div className="flex items-center justify-between gap-8">
                        <div>
                           <span className="text-[10px] font-black uppercase flex items-center gap-1"><Briefcase size={12}/> Modo Anfitrião</span>
                           <span className="block text-2xl font-black">R$ 1.450,00</span>
                        </div>
                        <div className="bg-black text-white p-2 group-hover:bg-white group-hover:text-black transition-colors">
                           <ChevronRight />
                        </div>
                     </div>
                     <span className="text-[10px] font-bold opacity-70 mt-1 block">Clique para gerenciar reservas</span>
                  </Link>
               ) : (
                  <Link href="/quero-cuidar" className="block bg-purple-600 text-white border-4 border-white p-4 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:bg-purple-700 transition-all">
                     <div className="flex items-center gap-4">
                        <DollarSign size={24} />
                        <div>
                           <span className="font-black uppercase text-sm block">Ganhe Dinheiro</span>
                           <span className="text-[10px] font-bold block opacity-80">Torne-se um Anfitrião hoje</span>
                        </div>
                     </div>
                  </Link>
               )}
            </div>
          </div>

        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        
        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex overflow-x-auto gap-2 border-b-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] mb-8">
           <button onClick={() => setActiveTab('trips')} className={`flex-1 py-4 px-6 font-black uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'trips' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}>
              <Plane size={20}/> Viagens
           </button>
           <button onClick={() => setActiveTab('pets')} className={`flex-1 py-4 px-6 font-black uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'pets' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}>
              <Settings size={20}/> Meus Pets
           </button>
           <button onClick={() => setActiveTab('favorites')} className={`flex-1 py-4 px-6 font-black uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'favorites' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}>
              <Heart size={20}/> Favoritos
           </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           {/* === ABA VIAGENS === */}
           {activeTab === 'trips' && (
             <div className="space-y-8">
                {/* Live Trips */}
                {trips.filter(t => t.status === 'live').map(trip => (
                   <div key={trip.id} className="border-[6px] border-black bg-green-400 p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                      <div className="absolute top-4 right-4 flex gap-2">
                         <span className="bg-red-600 text-white px-3 py-1 font-black text-xs uppercase animate-pulse border-2 border-black">Ao Vivo</span>
                      </div>
                      <h3 className="font-black text-sm uppercase mb-4 flex items-center gap-2"><Clock size={16}/> Acontecendo Agora</h3>
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                         <img src={trip.hostPhoto} className="w-24 h-24 border-4 border-black object-cover rounded-full bg-white" />
                         <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-black uppercase italic leading-none">{trip.hostName}</h2>
                            <p className="font-bold text-sm mt-1">{trip.dates} • <span className="underline">{trip.address}</span></p>
                         </div>
                         <div className="flex flex-col gap-2 w-full md:w-auto">
                            <button className="bg-white text-black border-4 border-black px-6 py-3 font-black uppercase text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                               <MessageCircle size={16} /> Chat
                            </button>
                         </div>
                      </div>
                   </div>
                ))}
                
                {/* Listagem */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {trips.filter(t => t.status !== 'live').map(trip => (
                      <div key={trip.id} className="border-[4px] border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start mb-4">
                               <span className={`px-2 py-1 font-black text-[10px] uppercase border-2 border-black ${trip.status === 'confirmed' ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                                  {trip.status === 'confirmed' ? 'Confirmado' : 'Finalizado'}
                               </span>
                               <span className="font-black text-sm">R$ {trip.price}</span>
                            </div>
                            <h4 className="text-xl font-black uppercase">{trip.hostName}</h4>
                            <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1"><Calendar size={12}/> {trip.dates}</p>
                         </div>
                         <div className="mt-6">
                            <button className="w-full bg-black text-white py-2 font-black uppercase text-xs border-2 border-black hover:bg-white hover:text-black">
                               Ver Detalhes
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* === ABA PETS (AGORA ACESSÍVEL) === */}
           {activeTab === 'pets' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/meus-pets/novo" className="border-[4px] border-black border-dashed p-8 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-black hover:bg-white hover:border-solid transition-all group min-h-[250px]">
                   <div className="w-16 h-16 rounded-full border-4 border-gray-300 group-hover:border-black flex items-center justify-center group-hover:bg-yellow-400 transition-all">
                      <Plus size={32} />
                   </div>
                   <span className="font-black uppercase">Adicionar Novo Pet</span>
                </Link>

                {myPets.map(pet => (
                   <div key={pet.id} className="border-[4px] border-black bg-white p-0 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                      <div className="h-32 bg-gray-200 border-b-4 border-black relative">
                         <img src={pet.photo} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 flex-1">
                         <h3 className="text-2xl font-black uppercase leading-none">{pet.name}</h3>
                         <p className="text-sm font-bold text-gray-500 uppercase">{pet.breed}, {pet.age}</p>
                         <Link href={`/meus-pets/${pet.id}`} className="mt-4 block text-center w-full bg-black text-white py-2 font-black uppercase text-xs border-2 border-black hover:bg-purple-600 transition-all">
                            Carteirinha
                         </Link>
                      </div>
                   </div>
                ))}
             </div>
           )}

           {/* === ABA FAVORITOS === */}
           {activeTab === 'favorites' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {favorites.map(fav => (
                   <Link href={`/host/${fav.id}`} key={fav.id} className="border-[4px] border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] hover:-translate-y-1 transition-all group">
                      <div className="flex gap-4 items-center">
                         <img src={fav.photo} className="w-16 h-16 border-2 border-black object-cover" />
                         <div>
                            <h4 className="font-black uppercase group-hover:underline">{fav.name}</h4>
                            <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                               <Star size={12} fill="currentColor"/> {fav.rating}
                            </div>
                            <p className="text-xs font-bold mt-1">R${fav.price}</p>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
           )}

        </div>
      </main>
    </div>
  );
}