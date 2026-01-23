"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Host {
  id: string;
  name: string;
  bio: string;
  price: number;
  homeType: string;
  hasPets: boolean;
  state: string;
  city: string;
  neighborhood: string;
  mainImage: string;
}

export default function HostProfilePage() {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchHost = async () => {
        try {
          const docRef = doc(db, "hosts", id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setHost({ id: docSnap.id, ...docSnap.data() } as Host);
          } else {
            setError("Cuidador não encontrado.");
          }
        } catch (err) {
          setError("Falha ao buscar dados do cuidador.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchHost();
    }
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut && host) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      if (date2 > date1) {
        const timeDiff = date2.getTime() - date1.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setTotalPrice(daysDiff * host.price);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, host]);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-black text-2xl uppercase">Carregando Perfil...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-black text-red-500 text-2xl">{error}</div>;
  }

  if (!host) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
            <Link href="/search" className="font-black p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 uppercase">
                ← Voltar para Busca
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_#000]">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">{host.name}</h1>
                <p className="font-black text-lg text-gray-500 uppercase mb-6">{host.city}, {host.neighborhood}</p>

                <div className="border-t-4 border-black pt-6 space-y-4">
                    <h2 className="text-2xl font-black uppercase">SOBRE O HERÓI</h2>
                    <p className="text-lg font-medium leading-relaxed whitespace-pre-line">{host.bio}</p>
                </div>

                <div className="border-t-4 border-black pt-6 mt-8 space-y-4">
                     <h2 className="text-2xl font-black uppercase">Acomodação</h2>
                     <div className="flex flex-wrap gap-4">
                        <div className="p-4 border-2 border-black bg-gray-100 font-bold">TIPO: {host.homeType}</div>
                        <div className="p-4 border-2 border-black bg-gray-100 font-bold">TEM PETS? {host.hasPets ? 'SIM' : 'NÃO'}</div>
                     </div>
                </div>
            </div>
          </div>

          {/* Sticky Reservation Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-10">
              <div className="border-4 border-black bg-yellow-400 p-8 shadow-[8px_8px_0px_#000]">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-4xl font-black">R${host.price}</span>
                  <span className="font-bold uppercase">/ Diária</span>
                </div>
                
                <div className="space-y-4 border-t-4 border-black pt-4">
                  <div>
                    <label className="block font-black uppercase text-sm mb-1">Check-in</label>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full p-3 border-4 border-black font-bold"/>
                  </div>
                  <div>
                    <label className="block font-black uppercase text-sm mb-1">Check-out</label>
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full p-3 border-4 border-black font-bold"/>
                  </div>
                </div>

                {totalPrice > 0 && (
                    <div className="mt-6 pt-4 border-t-4 border-dashed border-black">
                        <div className="flex justify-between items-center font-black text-xl">
                            <span>TOTAL:</span>
                            <span>R${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <button className="w-full mt-6 bg-purple-600 text-white font-black text-2xl py-5 border-4 border-black shadow-[6px_6px_0px_#000] hover:bg-purple-700 active:shadow-none active:translate-y-1 transition-all">
                  RESERVAR AGORA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
