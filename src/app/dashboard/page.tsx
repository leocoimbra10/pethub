"use client";

import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader, PawPrint, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Você foi desconectado.' });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: error.message,
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4 sm:mb-0">
              Olá, {user.displayName || user.email}!
            </h1>
            <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/meus-pets">
                <Card className="bg-card hover:border-primary hover:shadow-[8px_8px_0px_hsl(var(--primary))] transition-all h-full flex flex-col justify-between cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                           <PawPrint className="w-10 h-10 text-primary" />
                           Meus Pets
                        </CardTitle>
                        <CardDescription>Cadastre e gerencie as informações dos seus animais de estimação.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Button>Gerenciar Pets</Button>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/quero-cuidar">
                <Card className="bg-card hover:border-secondary hover:shadow-[8px_8px_0px_hsl(var(--secondary))] transition-all h-full flex flex-col justify-between cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Home className="w-10 h-10 text-secondary" />
                            Área do Cuidador
                        </CardTitle>
                        <CardDescription>Ofereça seus serviços e comece a gerar uma renda extra com o que você ama.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary">Seja um anfitrião</Button>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
