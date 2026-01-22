"use client";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { LogOut, User, LayoutDashboard, PawPrint } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [user, loading] = useAuthState(auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await signOut(auth);
      toast({ title: "Você foi desconectado." });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
    }
  };

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="font-black text-3xl tracking-tighter hover:rotate-2 transition-transform cursor-pointer">
          PetHub
        </Link>

        {/* LINKS CENTRAIS (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/search" className="font-bold text-black px-4 py-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all">
            Buscar cuidador
          </Link>
          <Link href="/#como-funciona" className="font-bold text-black px-4 py-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all">
            Como funciona
          </Link>
          <Link href="/#seguranca" className="font-bold text-black px-4 py-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all">
            Segurança
          </Link>
        </div>

        {/* ÁREA DO USUÁRIO */}
        <div className="flex items-center gap-4">
          
          {/* Botão Quero Cuidar (Sempre visível) */}
          <Link 
            href="/quero-cuidar"
            className="hidden md:block bg-[#F472B6] text-black font-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            Quero cuidar
          </Link>

          {loading ? (
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse border-2 border-black"></div>
          ) : user ? (
            // === USUÁRIO LOGADO (Dropdown) ===
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-12 h-12 rounded-full bg-black border-2 border-black flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-black text-lg">
                    {user.displayName?.charAt(0).toUpperCase() || <User />}
                  </span>
                )}
              </button>

              {/* Menu Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 overflow-hidden">
                  
                  <div className="px-4 py-3 border-b-2 border-gray-100 mb-2">
                    <p className="text-sm font-bold text-gray-500">Olá,</p>
                    <p className="font-black truncate">{user.displayName || "Usuário"}</p>
                  </div>

                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  
                  <Link 
                    href="/perfil" 
                    className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-5 h-5" /> Meu Perfil
                  </Link>

                   {/* Link Temporário para facilitar testes */}
                  <Link 
                    href="/meus-pets" 
                    className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <PawPrint className="w-5 h-5" /> Meus Pets
                  </Link>

                  <div className="border-t-2 border-gray-100 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-3 font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" /> Sair da Toca
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // === USUÁRIO DESLOGADO ===
            <Link 
              href="/login"
              className="font-bold text-black hover:underline"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
