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
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader, PawPrint, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro de autenticação:", err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Email ou senha inválidos.");
      } else {
        setError(err.message);
      }
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
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
          <CardTitle className="text-3xl font-headline">Bem-vindo!</CardTitle>
          <CardDescription className="font-bold">
            Acesse sua conta para continuar.
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
            <Label htmlFor="email" className="font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-bold">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              required
              className="bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin}>
            Entrar
          </Button>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-black" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 font-bold">
                Ou
              </span>
            </div>
          </div>

          <p className="text-center text-sm font-bold">
            Não tem uma conta?{" "}
            <Link href="/register" className="underline hover:text-primary">
              Crie uma
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
