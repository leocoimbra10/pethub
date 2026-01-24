"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { 
  Menu, User, Globe, Heart, Plane, LogOut, 
  HelpCircle, Gift, Briefcase, MessageSquare 
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Detectar Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b-4 border-gray-100 z-50 h-20 flex items-center">
      <div className="max-w-[1600px] mx-auto px-6 w-full flex justify-between items-center">
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-yellow-400 p-2 border-2 border-black group-hover:rotate-12 transition-transform">
             {/* Simples representação de pata */}
             <div className="grid grid-cols-2 gap-0.5 w-4">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="w-full h-1.5 bg-black rounded-full col-span-2 mt-0.5"></div>
             </div>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">PetHub</span>
        </Link>

        {/* 2. MENU CENTRAL (Desktop) */}
        <div className="hidden md:flex gap-6 font-bold text-sm text-gray-500">
           <Link href="/search" className="hover:text-black transition-colors">Buscar</Link>
           <Link href="/quero-cuidar" className="hover:text-black transition-colors">Seja Anfitrião</Link>
           <Link href="/como-funciona" className="hover:text-black transition-colors">Como funciona</Link>
        </div>

        {/* 3. MENU DIREITO (Hambúrguer) */}
        <div className="flex items-center gap-4">
           
           {/* Botão "Seja Anfitrião" (Só aparece se não estiver no menu móvel) */}
           <Link href="/quero-cuidar" className="hidden md:block text-sm font-bold hover:bg-gray-100 px-4 py-2 rounded-full transition-all">
              Torne-se um anfitrião
           </Link>
           
           <button className="hidden md:block hover:bg-gray-100 p-2 rounded-full transition-all">
              <Globe size={18} />
           </button>

           {/* O TRIGGER DO MENU */}
           <div className="relative" ref={menuRef}>
              <button 
                 onClick={() => setIsOpen(!isOpen)}
                 className="flex items-center gap-3 border-2 border-gray-300 rounded-full px-3 py-1.5 hover:shadow-md transition-all bg-white"
              >
                 <Menu size={18} className="text-gray-600" />
                 {user ? (
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-xs border border-gray-300">
                       {user.email?.[0].toUpperCase()}
                    </div>
                 ) : (
                    <div className="bg-gray-500 text-white rounded-full p-1">
                       <User size={18} fill="white" />
                    </div>
                 )}
              </button>

              {/* O DROPDOWN MÁGICO */}
              {isOpen && (
                 <div className="absolute top-14 right-0 w-64 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
                    {user ? (
                       <>
                          {/* Logado */}
                          <div className="px-4 py-3 border-b border-gray-100">
                             <p className="font-bold text-sm">Olá, {user.email?.split('@')[0]}</p>
                             <p className="text-xs text-gray-500">Tutor Elite</p>
                          </div>

                          <Link href="/inbox" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 font-bold text-sm text-gray-700">
                             <MessageSquare size={16}/> Mensagens
                          </Link>
                          <Link href="/dashboard" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 font-bold text-sm text-gray-700">
                             <Plane size={16}/> Minhas Viagens
                          </Link>
                          <Link href="/dashboard" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 font-bold text-sm text-gray-700">
                             <Heart size={16}/> Favoritos
                          </Link>
                          
                          <div className="border-t border-gray-100 my-1"></div>

                          <Link href="/quero-cuidar" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3">
                             <div className="flex-1">
                                <span className="font-black text-sm block">Torne-se um anfitrião</span>
                                <span className="text-[10px] text-gray-500 block">Ganhe renda extra hoje</span>
                             </div>
                             <Briefcase size={16} className="text-purple-600"/>
                          </Link>
                          <Link href="/indicar" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 font-bold text-sm text-gray-700">
                             <Gift size={16}/> Indique um amigo
                          </Link>

                          <div className="border-t border-gray-100 my-1"></div>

                          <Link href="/ajuda" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-600">
                             <HelpCircle size={16}/> Central de Ajuda
                          </Link>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600 font-bold">
                             <LogOut size={16}/> Sair da conta
                          </button>
                       </>
                    ) : (
                       <>
                          {/* Deslogado */}
                          <Link href="/login" className="px-4 py-3 hover:bg-gray-50 block font-black text-sm">
                             Entrar
                          </Link>
                          <Link href="/cadastro" className="px-4 py-3 hover:bg-gray-50 block text-sm font-bold text-gray-600">
                             Cadastrar-se
                          </Link>
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <Link href="/quero-cuidar" className="px-4 py-3 hover:bg-gray-50 block text-sm font-bold text-gray-700">
                             Hospede em sua casa
                          </Link>
                          <Link href="/ajuda" className="px-4 py-3 hover:bg-gray-50 block text-sm text-gray-600">
                             Central de Ajuda
                          </Link>
                       </>
                    )}
                 </div>
              )}
           </div>
        </div>
      </div>
    </nav>
  );
}