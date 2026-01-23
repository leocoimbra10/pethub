"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

interface Host {
  id: string;
  name: string;
  bio: string;
  price: number;
  homeType: string;
  state: string;
  city: string;
  neighborhood: string;
}

export default function BuscaPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [estados, setEstados] = useState<{ sigla: string; nome: string }[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchNeighborhood, setSearchNeighborhood] = useState("");

  // Carregar Estados do IBGE
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then(res => res.json())
      .then(data => setEstados(data.map((e: any) => ({ sigla: e.sigla, nome: e.nome }))));
  }, []);

  // Carregar Cidades quando o Estado mudar
  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then(res => res.json())
        .then(data => setCidades(data.map((c: any) => c.nome)));
    } else {
      setCidades([]);
    }
  }, [selectedState]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Query básica: apenas hosts ativos
      let q = query(collection(db, "hosts"), where("active", "==", true));
      
      // Filtros do Firebase (Igualdade exata para Estado e Cidade)
      if (selectedState) q = query(q, where("state", "==", selectedState));
      if (selectedCity) q = query(q, where("city", "==", selectedCity));

      const querySnapshot = await getDocs(q);
      let results: Host[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Host);
      });

      // Filtro de Bairro (Feito no cliente para permitir busca parcial/case-insensitive)
      if (searchNeighborhood) {
        results = results.filter(h => 
          h.neighborhood?.toLowerCase().includes(searchNeighborhood.toLowerCase())
        );
      }

      setHosts(results);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black italic uppercase mb-10 tracking-tighter border-b-8 border-black pb-2">
          Encontrar Heróis 🐾
        </h1>

        {/* BARRA DE FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-yellow-400">
          <div>
            <label className="block font-black text-xs uppercase mb-2">1. Estado</label>
            <select 
              value={selectedState} 
              onChange={e => { setSelectedState(e.target.value); setSelectedCity(""); }}
              className="w-full p-3 border-4 border-black font-black outline-none bg-white"
            >
              <option value="">Brasil Inteiro</option>
              {estados.map(e => <option key={e.sigla} value={e.sigla}>{e.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-black text-xs uppercase mb-2">2. Cidade</label>
            <select 
              value={selectedCity} 
              disabled={!selectedState}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-3 border-4 border-black font-black outline-none bg-white disabled:opacity-50"
            >
              <option value="">Todas as Cidades</option>
              {cidades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-black text-xs uppercase mb-2">3. Bairro</label>
            <input 
              type="text" 
              placeholder="Ex: Copacabana"
              value={searchNeighborhood}
              onChange={e => setSearchNeighborhood(e.target.value)}
              className="w-full p-3 border-4 border-black font-black outline-none"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-full bg-black text-white font-black py-4 uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-none active:translate-y-1 transition-all"
            >
              Buscar Agora
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        {loading ? (
          <div className="text-center font-black text-3xl italic animate-pulse">Rastreando cuidadores...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hosts.map(host => (
              <div key={host.id} className="group border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-gray-50 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black uppercase italic leading-none">{host.name}</h3>
                  <div className="bg-green-400 border-4 border-black px-3 py-1 font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    R$ {host.price}
                  </div>
                </div>
                
                <p className="font-bold text-gray-700 text-sm mb-6 line-clamp-3 italic">"{host.bio}"</p>
                
                <div className="space-y-2 border-t-4 border-black pt-4 mt-auto">
                  <div className="flex items-center gap-2 font-black text-xs uppercase">
                    <span className="bg-blue-200 p-1 border-2 border-black">📍 {host.neighborhood}</span>
                    <span>{host.city} / {host.state}</span>
                  </div>
                  <div className="font-black text-[10px] uppercase text-gray-400">
                    🏠 Residência: {host.homeType}
                  </div>
                </div>

                <Link href={`/host/${host.id}`}>
                  <button className="w-full mt-8 bg-purple-500 text-white font-black py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:bg-purple-600 transition-all uppercase italic">
                    Ver Perfil Completo
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && hosts.length === 0 && (
          <div className="text-center p-20 border-4 border-dashed border-gray-300">
            <p className="font-black text-2xl text-gray-400 uppercase italic">Ainda não temos heróis nesta região. 🐾</p>
          </div>
        )}
      </div>
    </div>
  );
}