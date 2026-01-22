"use client";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
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

  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Neo-Brutalista */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">🐾</span>
            <span className="text-2xl font-black text-black tracking-tighter">PetHub</span>
          </Link>

          {/* Links Centrais */}
          <div className="hidden md:flex space-x-6">
            <Link href="/search" className="text-base font-bold text-gray-700 hover:text-black hover:underline decoration-2 underline-offset-4 transition">
              Buscar cuidador
            </Link>
            <Link href="/#como-funciona" className="text-base font-bold text-gray-700 hover:text-black hover:underline decoration-2 underline-offset-4 transition">
              Como funciona
            </Link>
          </div>

          {/* Área de Ação */}
          <div className="flex items-center gap-4">
            {loading ? (
                 <div className="w-48 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            ) : user ? (
              // --- Usuário LOGADO ---
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hidden md:block font-bold text-black hover:text-primary border-2 border-transparent hover:border-b-black transition-all">
                  Meu Painel
                </Link>
                
                <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-200">
                  {/* Avatar com Borda Preta */}
                  <Link href="/perfil">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-full border-2 border-black hover:ring-2 hover:ring-primary transition"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary border-2 border-black flex items-center justify-center font-bold text-black hover:ring-2 hover:ring-primary transition">
                        {user.displayName?.charAt(0) || <User size={20}/>}
                      </div>
                    )}
                  </Link>
                  
                  {/* Botão Sair Brutalista Pequeno */}
                  <button 
                    onClick={handleLogout} 
                    className="text-sm font-bold text-black hover:bg-red-100 px-2 py-1 rounded border-2 border-transparent hover:border-black transition-all"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              // --- Usuário DESLOGADO (Estilo Neo-Brutalista) ---
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="hidden md:block font-bold text-black hover:underline decoration-2 underline-offset-4 mr-2"
                >
                  Entrar
                </Link>
                
                {/* Botão 1: Quero Cuidar (Amarelo) */}
                <Link 
                  href="/quero-cuidar" 
                  className="hidden lg:inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-lg border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                >
                  Quero cuidar
                </Link>

                {/* Botão 2: Criar Conta (Roxo) */}
                <Link 
                  href="/register" 
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-lg border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
