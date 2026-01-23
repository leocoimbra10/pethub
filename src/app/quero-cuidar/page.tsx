"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function OnboardingHost() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Estados de Localização
  const [estados, setEstados] = useState<{ sigla: string; nome: string }[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: "",
    homeType: "Casa",
    customHomeType: "",
    state: "",
    city: "",
    neighborhood: "",
    facilities: [] as string[],
  });

  const facilitiesList = ["Quintal Cercado", "Ar-Condicionado", "Monitoramento 24h", "Medicamentos", "Primeiros Socorros", "Sem outros pets", "Perto de Parques"];

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then(res => res.json())
      .then(data => setEstados(data.map((e: any) => ({ sigla: e.sigla, nome: e.nome }))));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/login");
      const snap = await getDoc(doc(db, "hosts", user.uid));
      if (snap.exists()) setFormData({ ...formData, ...snap.data(), name: user.displayName || "" });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (formData.state) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
        .then(res => res.json())
        .then(data => setCidades(data.map((c: any) => c.nome)));
    }
  }, [formData.state]);

  const toggleFacility = (fac: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(fac) ? prev.facilities.filter(f => f !== fac) : [...prev.facilities, fac]
    }));
  };

  const save = async () => {
    if (!auth.currentUser) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "hosts", auth.currentUser.uid), {
        ...formData,
        uid: auth.currentUser.uid,
        updatedAt: serverTimestamp(),
        active: true,
        homeType: formData.homeType === "Outros" ? formData.customHomeType : formData.homeType
      }, { merge: true });
      alert("PERFIL PUBLICADO COM SUCESSO! 🚀");
      router.push("/dashboard");
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-4xl italic animate-pulse">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans selection:bg-purple-300">
      <div className="max-w-4xl mx-auto">
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-4 flex-1 border-4 border-black transition-all ${step >= i ? 'bg-purple-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100'}`} />
          ))}
        </div>

        <div className="border-[6px] border-black p-8 md:p-12 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] bg-white">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-5xl font-black uppercase italic leading-none border-b-8 border-black pb-4">📍 ONDE VOCÊ ESTÁ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-black uppercase text-xs">Estado</label>
                  <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-4 border-4 border-black font-black bg-white outline-none">
                    <option value="">Selecione...</option>
                    {estados.map(e => <option key={e.sigla} value={e.sigla}>{e.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-xs">Cidade</label>
                  <select disabled={!formData.state} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 border-4 border-black font-black bg-white outline-none disabled:opacity-30">
                    <option value="">Selecione...</option>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-black uppercase text-xs">Bairro</label>
                <input type="text" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full p-4 border-4 border-black font-black outline-none placeholder:text-gray-300" placeholder="EX: CENTRO" />
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-black text-white font-black py-6 text-2xl uppercase hover:bg-purple-600 transition-all">PRÓXIMO PASSO →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-5xl font-black uppercase italic leading-none border-b-8 border-black pb-4">🏠 SEU ESPAÇO</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-black uppercase text-xs">Tipo de Residência</label>
                  <select value={formData.homeType} onChange={e => setFormData({...formData, homeType: e.target.value})} className="w-full p-4 border-4 border-black font-black bg-white">
                    <option value="Casa">CASA</option>
                    <option value="Apartamento">APARTAMENTO</option>
                    <option value="Outros">OUTROS (SÍTIO, HOTEL, ETC)</option>
                  </select>
                  {formData.homeType === "Outros" && (
                    <input type="text" value={formData.customHomeType} onChange={e => setFormData({...formData, customHomeType: e.target.value})} placeholder="DIGITE O TIPO..." className="w-full p-4 border-4 border-black font-black bg-purple-50 mt-2" />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-xs">O que você oferece?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {facilitiesList.map(f => (
                      <button key={f} onClick={() => toggleFacility(f)} className={`p-4 border-4 border-black font-black text-left transition-all ${formData.facilities.includes(f) ? 'bg-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}>
                        {formData.facilities.includes(f) ? '✓ ' : '+ '} {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/3 border-4 border-black font-black uppercase">Voltar</button>
                <button onClick={() => setStep(3)} className="w-2/3 bg-black text-white font-black py-6 text-2xl uppercase hover:bg-purple-600 transition-all">ÚLTIMO PASSO →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-5xl font-black uppercase italic leading-none border-b-8 border-black pb-4">💰 VALORES & BIO</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-black uppercase text-xs">Preço da Diária (R$)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 border-4 border-black font-black text-4xl outline-none" placeholder="00" />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-xs">Sua Bio Profissional</label>
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-4 border-4 border-black font-bold h-40 resize-none" placeholder="CONTE SUA EXPERIÊNCIA COM ANIMAIS..." />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/3 border-4 border-black font-black uppercase">Voltar</button>
                <button onClick={save} disabled={isSubmitting} className="w-2/3 bg-green-500 text-black font-black py-6 text-2xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  {isSubmitting ? "PUBLICANDO..." : "PUBLICAR PERFIL 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}