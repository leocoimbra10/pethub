'use client';

import { useAuth, auth, firestore } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader, PawPrint, Calendar, MapPin, MessageSquare, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { seedHosts } from '@/lib/seed-hosts';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Host } from '@/lib/types';

type Reserva = {
  id: string;
  hostPhoto: string;
  hostName: string;
  listingTitle: string;
  status: string;
  date: string;
  listingCity: string;
  price: number;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [hostProfile, setHostProfile] = useState<Host | null>(null);
  const [loadingHost, setLoadingHost] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      // Fetch Reservas
      setLoadingReservas(true);
      const qReservas = query(collection(firestore, "reservas"), where("userId", "==", user.uid));
      const unsubscribeReservas = onSnapshot(qReservas, 
        (querySnapshot) => {
          const userReservas: Reserva[] = [];
          querySnapshot.forEach((doc) => {
            userReservas.push({ id: doc.id, ...doc.data() } as Reserva);
          });
          setReservas(userReservas);
          setLoadingReservas(false);
        },
        (error) => {
          console.error("Erro ao buscar reservas:", error);
          toast({
            variant: "destructive",
            title: "Erro ao buscar reservas",
            description: error.message
          });
          setLoadingReservas(false);
        }
      );

      // Fetch Host Profile
      setLoadingHost(true);
      const qHost = query(collection(firestore, "hosts"), where("ownerId", "==", user.uid), limit(1));
      const unsubscribeHost = onSnapshot(qHost, (snapshot) => {
        if (!snapshot.empty) {
            const hostDoc = snapshot.docs[0];
            const hostData = { id: hostDoc.id, ...hostDoc.data() } as Host;
            console.log("Host Profile carregado:", hostData);
            setHostProfile(hostData);
        } else {
            setHostProfile(null);
        }
        setLoadingHost(false);
      }, (error) => {
        console.error("Erro ao buscar perfil de anfitrião:", error);
        toast({
            variant: "destructive",
            title: "Erro ao carregar seu perfil de anfitrião.",
        });
        setLoadingHost(false);
      });
      
      return () => {
        unsubscribeReservas();
        unsubscribeHost();
      };
    }
  }, [user, toast]);


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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-10">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="font-bold text-lg ml-4">Carregando sua Toca...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4 sm:mb-0">
              Bem-vindo, {user.displayName || user.email}!
            </h1>
            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                Sair da Toca
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-card">
            <CardHeader>
                <CardTitle>Meus Pets</CardTitle>
                <CardDescription>Gerencie as informações dos seus animais de estimação.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/meus-pets">
                    <Button>
                        <PawPrint className="mr-2 h-5 w-5" />
                        Gerenciar Meus Pets
                    </Button>
                </Link>
            </CardContent>
            </Card>
            <Card className="bg-card">
            <CardHeader>
                <CardTitle>Minhas Mensagens</CardTitle>
                <CardDescription>Veja suas conversas com os cuidadores.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/chat">
                    <Button>
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Ver Mensagens
                    </Button>
                </Link>
            </CardContent>
            </Card>
        </div>

        <Card className="bg-secondary mb-8">
            <CardHeader>
                <CardTitle>Área do Anfitrião</CardTitle>
                <CardDescription className="text-secondary-foreground font-bold">Gerencie seu perfil de cuidador e suas hospedagens.</CardDescription>
            </CardHeader>
            <CardContent>
                {loadingHost ? (
                    <div className="flex items-center">
                        <Loader className="h-6 w-6 animate-spin" />
                        <p className='ml-2 font-bold'>Verificando seu perfil de anfitrião...</p>
                    </div>
                ) : hostProfile ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-bold">Seu espaço está no ar!</p>
                            <p className="font-headline text-xl">{hostProfile.nome}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => alert("Funcionalidade de Edição em breve!")}>Editar</Button>
                            <Link href={`/cuidadores/${hostProfile.id}`}>
                                <Button className='bg-primary text-primary-foreground'>Ver meu Anúncio</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="font-bold">Tem um espacinho sobrando e ama pets? <br/>Gere uma renda extra!</p>
                        <Link href="/quero-cuidar">
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                Quero ser Anfitrião
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>


        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Minhas Reservas</CardTitle>
            <CardDescription>Acompanhe suas próximas e passadas estadias.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingReservas ? (
                 <div className="flex items-center justify-center p-8">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="font-bold ml-4">Buscando suas reservas...</p>
                 </div>
            ) : reservas.length > 0 ? (
              <div className="space-y-4">
                {reservas.map(reserva => (
                  <Card key={reserva.id} className="p-4 flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="h-20 w-20 border-2 border-black">
                      <AvatarImage src={reserva.hostPhoto} />
                      <AvatarFallback>{reserva.hostName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='w-full'>
                        <div className="flex justify-between w-full">
                            <h3 className="font-bold font-headline text-xl">{reserva.listingTitle}</h3>
                            <Badge className="bg-green-500 text-white border-green-700">{reserva.status}</Badge>
                        </div>
                        <p className="font-bold text-sm text-muted-foreground">{reserva.hostName}</p>
                        <Separator className='my-2 bg-border' />
                        <div className="flex flex-col sm:flex-row justify-between items-start text-sm font-bold mt-1">
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4' />
                            <span>{reserva.date}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            <span>{reserva.listingCity}</span>
                          </div>
                          <span>Total: R$ {Number(reserva.price).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-black rounded-xl">
                <PawPrint className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-bold">Você ainda não tem reservas.</p>
                 <Link href="/search" className="w-full sm:w-auto mt-4 inline-block">
                    <Button className="w-full">Buscar Cuidador</Button>
                </Link>
              </div>
            )}
          </CardContent>
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
