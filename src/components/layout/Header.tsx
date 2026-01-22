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
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">PetHub</span>
          </Link>

          {/* Links Centrais (Escondidos no Mobile) */}
          <div className="hidden md:flex space-x-8">
            <Link href="/search" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Buscar cuidador
            </Link>
            <Link href="/#como-funciona" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Como funciona
            </Link>
          </div>

          {/* Área do Usuário (Direita) */}
          <div className="flex items-center gap-4">
            {loading ? (
                 <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            ): user ? (
              // --- Usuário LOGADO ---
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hidden md:block text-sm font-medium text-gray-700 hover:text-primary">
                  Meu Painel
                </Link>
                <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                  {user.photoURL ? (
                    <Link href="/perfil">
                        <img 
                          src={user.photoURL} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full border border-gray-300 hover:ring-2 hover:ring-primary transition"
                        />
                    </Link>
                  ) : (
                    <Link href="/perfil">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border-2 border-primary/20 hover:ring-2 hover:ring-primary transition">
                          {user.displayName?.charAt(0) || <User size={14}/>}
                        </div>
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              // --- Usuário DESLOGADO ---
              <div className="flex items-center gap-3">
                <Link 
                  href="/quero-cuidar" 
                  className="hidden md:block text-sm font-bold text-gray-600 hover:text-primary transition-colors"
                >
                  Quero ser cuidador
                </Link>
                
                <div className="h-5 w-px bg-gray-200 mx-1 hidden md:block"></div>

                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
