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
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { PawPrint } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === '#register') {
      setIsLogin(false);
    }
  }, []);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login realizado com sucesso!" });
        router.push('/dashboard');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Conta criada com sucesso!" });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error.message,
      });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm bg-secondary">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="p-4 bg-primary rounded-lg border-2 border-black">
              <PawPrint className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline">{isLogin ? 'Acesse sua conta' : 'Crie sua conta'}</CardTitle>
          <CardDescription className="font-bold text-black">
            {isLogin ? 'Bem-vindo de volta! Entre para gerenciar suas reservas.' : 'Cadastre-se para encontrar o melhor anfitrião para seu pet.'}
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
          <Button className="w-full" onClick={handleAuth}>{isLogin ? 'Entrar' : 'Cadastrar'}</Button>
          <div className="text-center text-sm font-bold">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="underline hover:text-primary">
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
