"use client";
import { useState } from "react";
import { Save, Loader2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface PetFormProps {
  onSave: (pet: any) => void;
  onCancel: () => void;
  saving: boolean;
}

export default function PetForm({ onSave, onCancel, saving }: PetFormProps) {
  // Estado local do formulário (O segredo para não travar a digitação)
  const [newPet, setNewPet] = useState({ 
    nome: "", 
    raca: "", 
    idade: "", 
    fotos: [] as string[], 
    obs: "" 
  });

  const handleAddPhoto = (url: string) => {
    setNewPet(prev => ({ ...prev, fotos: [...prev.fotos, url] }));
  };

  const handleRemovePhoto = (index: number) => {
    setNewPet(prev => ({ ...prev, fotos: prev.fotos.filter((_, i) => i !== index) }));
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2">
      <h2 className="font-black text-xl mb-4">Novo Aumigo (ou Miaumigo)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
        
        {/* GALERIA DE FOTOS */}
        <div>
          <label className="block text-xs font-bold mb-2">Galeria de Fotos</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {newPet.fotos.map((foto, idx) => (
              <div key={idx} className="relative aspect-square border-2 border-black rounded-lg overflow-hidden group">
                <img src={foto} alt="Pet" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Botão Adicionar */}
            <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
               <div className="transform scale-75">
                 <ImageUpload onUpload={handleAddPhoto} />
               </div>
               <span className="text-[10px] font-bold text-gray-400 mt-[-5px]">Adicionar</span>
            </div>
          </div>
        </div>

        {/* CAMPOS DE TEXTO */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-sm">Nome</label>
              <input 
                value={newPet.nome}
                onChange={e => setNewPet({...newPet, nome: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Ex: Rex"
              />
            </div>
            <div>
              <label className="font-bold text-sm">Raça</label>
              <input 
                value={newPet.raca}
                onChange={e => setNewPet({...newPet, raca: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Ex: Vira-lata"
              />
            </div>
          </div>
          
          <div>
              <label className="font-bold text-sm">Idade</label>
              <input 
                type="text"
                value={newPet.idade}
                onChange={e => setNewPet({...newPet, idade: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Ex: 2 anos"
              />
          </div>

          <div>
              <label className="font-bold text-sm">Observações</label>
              <textarea 
                value={newPet.obs}
                onChange={e => setNewPet({...newPet, obs: e.target.value})}
                className="w-full p-2 border-2 border-black rounded-lg font-bold h-20 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Descreva detalhes importantes..."
              />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onCancel} className="font-bold text-gray-500 hover:text-black">Cancelar</button>
            <button 
              onClick={() => onSave(newPet)}
              disabled={saving}
              className="bg-black text-white font-black px-6 py-3 rounded-lg border-2 border-transparent hover:bg-[#8B5CF6] hover:border-black transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
              SALVAR PET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
