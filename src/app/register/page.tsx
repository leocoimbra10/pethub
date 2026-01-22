"use client";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Loader, PawPrint, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleRegister = async () => {
    setError(null);
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (!nome) {
      setError("Por favor, insira seu nome.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nome });
      router.push('/dashboard');
    } catch (err: any) {
       if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso.');
      } else {
        setError(err.message);
      }
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRegister();
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
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="font-bold text-lg ml-4">Logado! Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm bg-card border-2 border-black shadow-neo">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
             <div className="flex justify-center items-center">
                <div className="p-4 bg-primary rounded-lg border-2 border-black shadow-neo-sm">
                  <PawPrint className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
          </Link>
          <CardTitle className="text-3xl font-headline">Crie sua conta</CardTitle>
          <CardDescription className="font-bold">
            É rápido e fácil. Vamos começar!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           {error && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Erro de Cadastro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="nome" className="font-bold">Seu Nome</Label>
            <Input id="nome" type="text" placeholder="Como podemos te chamar?" required className="bg-background" value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={handleKeyDown}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required className="bg-background" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-bold">Senha</Label>
            <Input id="password" type="password" placeholder="Mínimo 6 caracteres" required className="bg-background" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleRegister}>Criar minha conta</Button>
          <div className="text-center text-sm font-bold pt-2">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Entre
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
