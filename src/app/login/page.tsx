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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader, PawPrint, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user && !loading) {
      console.log("Usuário logado! Redirecionando...");
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Erro de autenticação:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos.');
      } else {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="font-bold text-lg ml-4">Verificando...</p>
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
      <Card className="w-full max-w-sm bg-secondary">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="p-4 bg-primary rounded-lg border-2 border-black">
              <PawPrint className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline">Entrar</CardTitle>
          <CardDescription className="font-bold text-black">
            Acesse sua conta para gerenciar suas reservas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           {error && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Erro de Autenticação</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
          <Button className="w-full" onClick={handleLogin}>Entrar</Button>
          <div className="text-center text-sm font-bold pt-2">
            Não tem uma conta?{' '}
            <Link href="/register" className="underline hover:text-primary">
              Crie uma
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
