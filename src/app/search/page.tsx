"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

interface Host {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  cidade: string;
  state?: string;
  neighborhood?: string;
}

export default function BuscaPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [estados, setEstados] = useState<{ sigla: string; nome: string }[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchNeighborhood, setSearchNeighborhood] = useState("");

  // 1. Carregar Estados do IBGE
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then(res => res.json())
      .then(data => setEstados(data.map((e: any) => ({ sigla: e.sigla, nome: e.nome }))));
  }, []);

  // 2. Carregar Cidades quando o Estado mudar
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
      let q = query(collection(db, "hosts"));
      
      if (selectedCity) {
        q = query(q, where("cidade", "==", selectedCity));
      }

      const querySnapshot = await getDocs(q);
      let results: Host[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Host);
      });

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
    <div className="min-h-screen bg-white p-6 text-black font-sans selection:bg-purple-300">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO EXCLUSIVO PETHUB */}
        <div className="mb-12 border-b-[10px] border-black pb-6">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
            ENCONTRAR <br />
            <span className="text-purple-600">ANFITRIÃO</span>
          </h1>
          <p className="font-black uppercase text-sm tracking-[0.2em] mt-4 bg-black text-white w-fit px-2 py-1">
            SISTEMA DE BUSCA POR LOCALIDADE
          </p>
        </div>

        {/* BARRA DE FILTROS NEO-BRUTALISTA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] bg-white mb-20 overflow-hidden">
          <div className="p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <label className="block font-black text-xs uppercase mb-2 text-gray-400">01. ESTADO</label>
            <select 
              value={selectedState} 
              onChange={e => { setSelectedState(e.target.value); setSelectedCity(""); }}
              className="w-full font-black text-xl outline-none bg-transparent cursor-pointer appearance-none"
            >
              <option value="">BRASIL</option>
              {estados.map(e => <option key={e.sigla} value={e.sigla}>{e.nome}</option>)}
            </select>
          </div>

          <div className="p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <label className="block font-black text-xs uppercase mb-2 text-gray-400">02. CIDADE</label>
            <select 
              value={selectedCity} 
              disabled={!selectedState}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full font-black text-xl outline-none bg-transparent cursor-pointer appearance-none disabled:opacity-30"
            >
              <option value="">TODAS</option>
              {cidades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <label className="block font-black text-xs uppercase mb-2 text-gray-400">03. BAIRRO (OPCIONAL)</label>
            <input 
              type="text" 
              placeholder="DIGITE AQUI..."
              value={searchNeighborhood}
              onChange={e => setSearchNeighborhood(e.target.value)}
              className="w-full font-black text-xl outline-none placeholder:text-gray-300"
            />
          </div>

          <button 
            onClick={handleSearch}
            className="bg-black text-white font-black text-2xl uppercase p-6 hover:bg-purple-600 transition-all active:bg-green-500"
          >
            PESQUISAR
          </button>
        </div>

        {/* GRID DE RESULTADOS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="w-20 h-20 border-[10px] border-black border-t-purple-600 animate-spin mb-4"></div>
            <p className="font-black uppercase text-2xl italic">Rastreando Localidade...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {hosts.map(host => (
              <div key={host.id} className="border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col group hover:-translate-x-2 hover:-translate-y-2 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black uppercase leading-none break-words max-w-[70%]">{host.nome}</h3>
                  <div className="bg-yellow-300 border-4 border-black px-3 py-1 font-black text-lg">
                    R${host.preco}
                  </div>
                </div>
                
                <p className="font-bold text-gray-800 mb-8 border-l-4 border-purple-600 pl-4 h-24 overflow-hidden overflow-ellipsis">
                  {host.descricao}
                </p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex flex-wrap gap-2 uppercase font-black text-[10px]">
                    {host.neighborhood && <span className="bg-black text-white px-2 py-1">📍 {host.neighborhood}</span>}
                    <span className="border-2 border-black px-2 py-1">{host.cidade}{host.state && ` / ${host.state}`}</span>
                  </div>
                  
                  <Link href={`/cuidadores/${host.id}`}>
                    <button className="w-full bg-white text-black font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all uppercase italic text-lg">
                      Ver Perfil
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && hosts.length === 0 && (
          <div className="text-center p-32 border-[6px] border-dashed border-gray-200">
            <p className="font-black text-4xl text-gray-300 uppercase italic">Nenhum anfitrião encontrado nesta zona. 🕵️‍♂️</p>
          </div>
        )}
      </div>
    </div>
  );
}
