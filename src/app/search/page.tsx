'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Home, MapPin, Star } from 'lucide-react';

interface Host {
  id: string;
  name: string;
  bio: string;
  price: number;
  city: string;
  state?: string;
  neighborhood?: string;
  photoUrl?: string;
  facilities?: string[];
}

export default function BuscaPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(false);

  const [estados, setEstados] = useState<{ sigla: string; nome: string }[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchNeighborhood, setSearchNeighborhood] = useState('');

  // 1. Carregar Estados do IBGE
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((res) => res.json())
      .then((data) => setEstados(data.map((e: any) => ({ sigla: e.sigla, nome: e.nome }))));
  }, []);

  // 2. Carregar Cidades quando o Estado mudar
  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then((res) => res.json())
        .then((data) => setCidades(data.map((c: any) => c.nome)));
    } else {
      setCidades([]);
    }
  }, [selectedState]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'hosts'));

      if (selectedCity) {
        q = query(q, where('city', '==', selectedCity));
      }

      const querySnapshot = await getDocs(q);
      let results: Host[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Host);
      });

      if (searchNeighborhood) {
        results = results.filter((h) => h.neighborhood?.toLowerCase().includes(searchNeighborhood.toLowerCase()));
      }

      setHosts(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black font-sans selection:bg-purple-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b-[10px] border-black pb-6">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
            ENCONTRAR <br />
            <span className="text-purple-600">ANFITRIÃO</span>
          </h1>
          <p className="font-black uppercase text-sm tracking-[0.2em] mt-4 bg-black text-white w-fit px-2 py-1">
            SISTEMA DE BUSCA POR LOCALIDADE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] bg-white mb-20 overflow-hidden">
          <div className="p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <label className="block font-black text-xs uppercase mb-2 text-gray-400">01. ESTADO</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
              className="w-full font-black text-xl outline-none bg-transparent cursor-pointer appearance-none"
            >
              <option value="">BRASIL</option>
              {estados.map((e) => (
                <option key={e.sigla} value={e.sigla}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <label className="block font-black text-xs uppercase mb-2 text-gray-400">02. CIDADE</label>
            <select
              value={selectedCity}
              disabled={!selectedState}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full font-black text-xl outline-none bg-transparent cursor-pointer appearance-none disabled:opacity-30"
            >
              <option value="">TODAS</option>
              {cidades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <label className="block font-black text-xs uppercase mb-2 text-gray-400">03. BAIRRO (OPCIONAL)</label>
            <input
              type="text"
              placeholder="DIGITE AQUI..."
              value={searchNeighborhood}
              onChange={(e) => setSearchNeighborhood(e.target.value)}
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

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="w-20 h-20 border-[10px] border-black border-t-purple-600 animate-spin mb-4"></div>
            <p className="font-black uppercase text-2xl italic">Rastreando Localidade...</p>
          </div>
        ) : (
          <div>
            {hosts.map((host) => (
              <div
                key={host.id}
                className="border-[6px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col md:flex-row overflow-hidden mb-8"
              >
                {/* IMAGEM DO ESPAÇO */}
                <div className="md:w-2/5 h-64 md:h-auto bg-gray-100 border-b-[6px] md:border-b-0 md:border-r-[6px] border-black relative">
                  {host.photoUrl ? (
                    <img src={host.photoUrl} alt={host.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50">
                      <Home size={64} className="text-purple-200" />
                      <span className="text-[10px] font-black uppercase text-purple-300 mt-2">Sem foto do espaço</span>
                    </div>
                  )}
                  {/* BADGE DE PREÇO SOBRE A FOTO */}
                  <div className="absolute top-4 left-4 bg-yellow-400 border-4 border-black px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    R${host.price}
                  </div>
                </div>

                {/* INFORMAÇÕES */}
                <div className="md:w-3/5 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-3xl font-black uppercase italic leading-none">{host.name}</h3>
                      <span className="flex items-center gap-1 font-black text-xs bg-green-400 border-2 border-black px-2 py-0.5">
                        <Star size={12} fill="currentColor" /> 5.0
                      </span>
                    </div>
                    <p className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                      <MapPin size={14} /> {host.neighborhood || 'Bairro não informado'}, {host.city}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-gray-600 line-clamp-2 italic">
                    "{host.bio || 'Este anfitrião ainda não adicionou uma descrição detalhada...'}"
                  </p>

                  {/* TAGS DE DIFERENCIAIS */}
                  <div className="flex flex-wrap gap-2">
                    {host.facilities?.slice(0, 3).map((f: string) => (
                      <span key={f} className="text-[9px] font-black border-2 border-black px-2 py-1 uppercase bg-gray-50">
                        + {f}
                      </span>
                    )) || (
                      <span className="text-[9px] font-black border-2 border-black px-2 py-1 uppercase bg-gray-50 opacity-50">
                        Perfil Verificado
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/host/${host.id}`}
                    className="w-full bg-black text-white text-center py-4 font-black uppercase text-sm border-4 border-black hover:bg-purple-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    Ver Perfil Detalhado
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
