'use client';

import { useAuth, auth, firestore } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { seedHosts } from '@/lib/seed-hosts';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  console.log("Dashboard: User status", user);

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

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedHosts(firestore);
      alert("✅ 5 Cuidadores criados! Vá para a busca.");
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-10">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="font-bold text-lg ml-4">Carregando sua Toca...</p>
      </div>
    );
  }

  if (!user) {
    // Briefly show a loader before the redirect kicks in
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4">
          Bem-vindo, {user.displayName || user.email}!
        </h1>
        <p className="text-lg font-bold mb-8">Este é o seu painel PetHub.</p>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Minhas Reservas</CardTitle>
            <CardDescription>Acompanhe suas próximas e passadas estadias.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-center p-8 border-2 border-dashed border-black rounded-xl">
              Você ainda não tem reservas.
            </p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2">
            <Link href="/search" className="w-full sm:w-auto">
              <Button className="w-full">Buscar Cuidador</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
              Sair da Toca
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-card mt-8">
            <CardHeader>
                <CardTitle>Ferramentas de Desenvolvimento</CardTitle>
                <CardDescription>Use este botão para popular o banco de dados com cuidadores de teste.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSeed} variant="secondary" disabled={isSeeding}>
                   {isSeeding ? '⏳ Criando...' : '🛠️ Gerar Cuidadores Teste'}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
