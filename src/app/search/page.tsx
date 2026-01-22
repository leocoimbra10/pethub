"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { firestore } from "@/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { Search, MapPin, Frown } from "lucide-react";
import type { Host } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCity = searchParams.get("city") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);

  const normalize = (text: string) => 
    text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  useEffect(() => {
    async function fetchHosts() {
      setLoading(true);
      try {
        const q = query(collection(firestore, "hosts"));
        const querySnapshot = await getDocs(q);
        
        const allHosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Host[];

        const currentSearchTerm = searchParams.get("city") || "";

        const filtered = allHosts.filter((host: Host) => {
          if (!currentSearchTerm) return true; 
          const cityMatch = normalize(host.cidade).includes(normalize(currentSearchTerm));
          const nameMatch = normalize(host.nome).includes(normalize(currentSearchTerm));
          return cityMatch || nameMatch;
        });

        setHosts(filtered);
      } catch (error) {
        console.error("Erro ao buscar:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHosts();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?city=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b-4 border-black p-6 sticky top-[96px] z-40 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 border-2 border-black rounded-lg text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
              >
                <option value="">Selecione uma cidade</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
                <option value="Curitiba">Curitiba</option>
                <option value="Brasília">Brasília</option>
                <option value="Salvador">Salvador</option>
              </select>
            </div>
            <button 
              type="submit"
              className="bg-[#8B5CF6] text-white font-black px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Buscar</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-black mb-6">
          {loading ? "Farejando cuidadores..." : `${hosts.length} anfitriões encontrados`}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl border-2 border-gray-300"></div>
            ))}
          </div>
        ) : hosts.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Frown className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-bold">Poxa, ninguém nessa região ainda.</p>
            <p>Que tal ser o primeiro anfitrião daqui?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hosts.map((host) => (
              <div 
                key={host.id}
                onClick={() => router.push(`/cuidadores/${host.id}`)}
                className="group cursor-pointer bg-white border-2 border-black rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#8B5CF6] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden border-b-2 border-black">
                  {host.houseImages && host.houseImages[0] ? (
                    <img src={host.houseImages[0]} alt={host.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Sem foto</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white border-2 border-black px-2 py-1 rounded-md font-bold text-sm shadow-neo-sm">
                    R$ {host.preco}/noite
                  </div>
                </div>

                <div className="p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-xl truncate pr-2 group-hover:text-[#8B5CF6] transition-colors">{host.nome}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold bg-[#FACC15] px-2 py-1 rounded-md border-2 border-black shadow-neo-sm">
                      <span>⭐</span>
                      <span>{host.rating?.toFixed(1) || "Novo"}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4 font-bold">
                    <MapPin className="w-4 h-4" /> {host.cidade}
                  </p>
                  <div className="mt-auto">
                    <button className="w-full bg-black text-white font-bold py-3 rounded-lg border-2 border-black group-hover:bg-[#8B5CF6] transition-colors duration-200 shadow-neo">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
