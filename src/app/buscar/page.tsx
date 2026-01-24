"use client";

import { useState } from "react";
import { collection, query, where, getDocs, Query, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Search, MapPin, Scale, Shield, Sparkles, Dog, Cat, Bird } from "lucide-react";
import HostCard from "@/components/HostCard"; // Supondo que você tenha este componente

export default function BuscarElitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // Filtros Granulares
  const [city, setCity] = useState("São Paulo");
  const [petType, setPetType] = useState<"Cachorro" | "Gato" | "Exótico">("Cachorro");
  const [petSize, setPetSize] = useState<string>("Pequeno"); // Pequeno, Médio, Grande, Gigante
  const [needs24hSupervision, setNeeds24hSupervision] = useState(false);
  const [isNeutered, setIsNeutered] = useState(true);

  // Mock
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Brasília", "Salvador", "Florianópolis"];
  const petSizes = ["Pequeno", "Médio", "Grande", "Gigante"];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      let q: Query<DocumentData> = collection(db, "hosts");

      // 1. Filtro base: CIDADE
      q = query(q, where("city", "==", city));

      // 2. Filtro por TIPO de Pet (Capacidade)
      if (petType === "Cachorro") {
        q = query(q, where("maxDogs", ">", 0));
      } else if (petType === "Gato") {
        q = query(q, where("maxCats", ">", 0));
      } else { // Exótico
        // Filtra hosts que tenham ao menos 1 animal na lista de exóticos
        q = query(q, where("acceptedExotics", "!=", []));
      }
      
      // 3. Filtro por TAMANHO de Pet
      // O host deve ter o tamanho selecionado na sua lista de portes aceitos
      q = query(q, where("acceptedSizes", "array-contains", petSize));

      // 4. Filtro por REGRAS (Booleanos)
      if (needs24hSupervision) {
        q = query(q, where("supervision24h", "==", true));
      }
      
      // Se o pet NÃO for castrado, o tutor vai procurar um host que NÃO exija castração.
      if (!isNeutered) {
        q = query(q, where("onlyNeutered", "==", false));
      }

      const querySnapshot = await getDocs(q);
      const searchResults = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setResults(searchResults);

    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Busca <span className="text-purple-600 italic">Inteligente</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-bold max-w-2xl mx-auto">
            Use os filtros avançados para encontrar o anfitrião perfeito para as necessidades do seu pet.
          </p>
        </div>

        {/* PAINEL DE FILTROS */}
        <form onSubmit={handleSearch} className="bg-white border-[8px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8 mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            
            {/* 1. LOCALIZAÇÃO */}
            <div className="space-y-2">
              <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={12}/> Onde?</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full p-4 border-4 border-black font-bold outline-none cursor-pointer text-lg">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            {/* 2. TIPO DE PET */}
            <div className="space-y-2">
              <label className="font-black uppercase text-xs">De que tipo é seu pet?</label>
              <div className="grid grid-cols-3 gap-1 border-4 border-black p-1 bg-gray-100">
                <button type="button" onClick={() => setPetType("Cachorro")} className={`flex justify-center items-center gap-2 p-3 font-bold transition-all ${petType === 'Cachorro' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}><Dog size={16}/><span>Cão</span></button>
                <button type="button" onClick={() => setPetType("Gato")} className={`flex justify-center items-center gap-2 p-3 font-bold transition-all ${petType === 'Gato' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}><Cat size={16}/><span>Gato</span></button>
                <button type="button" onClick={() => setPetType("Exótico")} className={`flex justify-center items-center gap-2 p-3 font-bold transition-all ${petType === 'Exótico' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}><Bird size={16}/><span>Outro</span></button>
              </div>
            </div>

            {/* 3. PORTE DO PET */}
            <div className="space-y-2">
              <label className="font-black uppercase text-xs flex items-center gap-1"><Scale size={12}/> Qual o porte?</label>
               <select value={petSize} onChange={e => setPetSize(e.target.value)} className="w-full p-4 border-4 border-black font-bold outline-none cursor-pointer text-lg appearance-none">
                {petSizes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            
            {/* BOTÃO SUBMIT */}
            <button type="submit" disabled={loading} className="w-full bg-green-500 text-black border-4 border-black p-4 font-black uppercase text-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
              {loading ? "Buscando..." : <><Search size={20}/> Buscar</>}
            </button>
          </div>

          {/* 4. FILTROS ADICIONAIS (CHECKBOX) */}
          <div className="pt-6 border-t-4 border-dashed space-y-4">
              <h3 className="font-black uppercase text-sm flex items-center gap-2"><Sparkles size={14}/> Preferências</h3>
              <div className="flex flex-wrap items-center gap-4">
                 <div onClick={() => setNeeds24hSupervision(!needs24hSupervision)} className={`cursor-pointer flex items-center gap-2 p-3 border-4 border-black font-bold text-xs uppercase ${needs24hSupervision ? 'bg-purple-200' : 'bg-white'}`}>
                    <div className={`w-4 h-4 border-2 border-black ${needs24hSupervision ? 'bg-black': 'bg-white'}`}/>
                    Supervisão 24h
                 </div>
                 <div onClick={() => setIsNeutered(!isNeutered)} className={`cursor-pointer flex items-center gap-2 p-3 border-4 border-black font-bold text-xs uppercase ${isNeutered ? 'bg-gray-200' : 'bg-white'}`}>
                    <div className={`w-4 h-4 border-2 border-black ${isNeutered ? 'bg-black': 'bg-white'}`}/>
                    Meu pet é castrado
                 </div>
                 <p className="text-xs text-gray-500 font-bold">ⓘ Se seu pet não for castrado, mostraremos apenas anfitriões que aceitam.</p>
              </div>
          </div>
        </form>

        {/* AREA DE RESULTADOS */}
        <div className="space-y-6">
          {loading && <div className="text-center font-bold uppercase">Procurando anfitriões...</div>}
          
          {!loading && searched && results.length === 0 && (
            <div className="text-center bg-white border-4 border-black p-10 shadow-lg">
              <h3 className="text-2xl font-black">Nenhum resultado encontrado</h3>
              <p className="text-gray-600">Tente alterar os filtros ou ampliar a sua busca.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <h2 className="text-center font-black uppercase text-gray-500">{results.length} anfitriões encontrados para <span className="text-purple-600">{city}</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map(host => <HostCard key={host.id} host={host} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
