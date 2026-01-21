'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth, useAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { Loader, PawPrint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" {...props}>
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 398.5 0 256S111.3 0 244 0c69.8 0 132 28.1 176.2 72.9l-63.7 61.9C331.4 110.1 291.1 96 244 96c-82.3 0-149.2 67.2-149.2 150.8s66.9 150.8 149.2 150.8c95.6 0 131.3-67.2 136.4-101.6H244v-75.5h236.1c2.4 12.6 3.9 26.1 3.9 40.8z"/>
  </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      console.log("Usuário logado! Redirecionando para /dashboard...");
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#register') {
      setIsLogin(false);
    }
  }, []);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login realizado com sucesso." });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Conta criada com sucesso." });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
            <Loader className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <p className="font-bold text-lg">Login aprovado! Entrando no dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm bg-secondary">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="p-4 bg-primary rounded-lg border-2 border-black">
              <PawPrint className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline">{isLogin ? 'Entrar' : 'Criar conta'}</CardTitle>
          <CardDescription className="font-bold text-black">
            {isLogin ? 'Acesse sua conta para gerenciar suas reservas.' : 'Crie uma conta para encontrar um cuidador para seu pet.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required className="bg-card" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-bold">Senha</Label>
            <Input id="password" type="password" required className="bg-card" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleAuth}>{isLogin ? 'Entrar' : 'Criar conta'}</Button>
          <div className="relative flex py-2 items-center w-full">
              <div className="flex-grow border-t-2 border-black"></div>
              <span className="flex-shrink mx-4 font-bold text-sm">OU</span>
              <div className="flex-grow border-t-2 border-black"></div>
          </div>
          <Button variant="outline" className="w-full bg-card" onClick={handleGoogleSignIn}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Entrar com Google
          </Button>
          <div className="text-center text-sm font-bold pt-2">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="underline hover:text-primary">
              {isLogin ? 'Crie uma' : 'Entre'}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
