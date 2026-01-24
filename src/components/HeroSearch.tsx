"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Home, Sun, HeartHandshake, Footprints } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState("hospedagem");

  const services = [
    {
      id: "hospedagem",
      label: "Hospedagem",
      desc: "Seu pet dorme na casa do anfitrião",
      icon: <Home size={24} />,
    },
    {
      id: "creche",
      label: "Creche / Day Care",
      desc: "Passa o dia se divertindo e volta pra casa",
      icon: <Sun size={24} />,
    },
    {
      id: "petsitter",
      label: "Pet Sitter",
      desc: "O anfitrião vai até sua casa cuidar",
      icon: <HeartHandshake size={24} />,
    },
    {
      id: "passeio",
      label: "Passeios",
      desc: "Caminhadas de 30min ou 1h",
      icon: <Footprints size={24} />,
    },
  ];

  const handleSearch = () => {
    // Redireciona para a busca com o filtro aplicado
    router.push(`/search?service=${selectedService}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#f8f5f2] border-[6px] border-black rounded-[32px] p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-20 -mt-10 md:-mt-20">
      
      {/* 1. SELEÇÃO DE SERVIÇOS (TABS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`relative p-4 border-4 rounded-2xl text-left transition-all group hover:-translate-y-1 ${
              selectedService === service.id
                ? "bg-white border-purple-600 shadow-[4px_4px_0px_0px_#9333ea]"
                : "bg-white border-transparent hover:border-black shadow-sm"
            }`}
          >
            {/* Radio Circle Visual */}
            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedService === service.id ? "border-purple-600" : "border-gray-300"
            }`}>
                {selectedService === service.id && <div className="w-3 h-3 bg-purple-600 rounded-full" />}
            </div>

            <div className={`mb-2 ${selectedService === service.id ? "text-purple-600" : "text-gray-400 group-hover:text-black"}`}>
                {service.icon}
            </div>
            
            <h3 className={`font-black uppercase text-sm mb-1 ${selectedService === service.id ? "text-purple-600" : "text-gray-700"}`}>
                {service.label}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 leading-tight pr-4">
                {service.desc}
            </p>
          </button>
        ))}
      </div>

      {/* 2. INPUTS E AÇÃO */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Input Endereço */}
        <div className="flex-1 bg-white border-4 border-gray-200 focus-within:border-black rounded-xl px-4 py-4 flex items-center gap-3 transition-colors">
            <MapPin className="text-gray-400" />
            <div className="flex-1">
                <label className="block text-[10px] font-black uppercase text-gray-400">Onde?</label>
                <input type="text" placeholder="Digite seu bairro ou cidade" className="w-full font-bold outline-none text-sm placeholder:font-normal" />
            </div>
        </div>

        {/* Input Datas */}
        <div className="flex-1 bg-white border-4 border-gray-200 focus-within:border-black rounded-xl px-4 py-4 flex items-center gap-3 transition-colors">
            <Calendar className="text-gray-400" />
            <div className="flex-1">
                <label className="block text-[10px] font-black uppercase text-gray-400">Quando?</label>
                <input type="text" placeholder="Selecione as datas" className="w-full font-bold outline-none text-sm placeholder:font-normal" />
            </div>
        </div>

        {/* Botão Buscar */}
        <button 
            onClick={handleSearch}
            className="bg-purple-600 text-white border-4 border-black rounded-xl px-8 py-4 font-black uppercase text-lg hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
            <Search strokeWidth={3} size={20} />
            Encontrar Herói
        </button>
      </div>

    </div>
  );
}