'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, PawPrint, PlusCircle, Dog, Cat, Bird } from 'lucide-react';
import type { Pet } from '@/lib/types';

const PetIcon = ({ tipo, className }: { tipo: string; className?: string }) => {
    switch (tipo) {
        case 'Cachorro':
            return <Dog className={className} />;
        case 'Gato':
            return <Cat className={className} />;
        default:
            return <Bird className={className} />;
    }
}

export default function MeusPetsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setLoadingPets(true);
      const q = query(
        collection(firestore, 'pets'),
        where('ownerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userPets: Pet[] = [];
        querySnapshot.forEach((doc) => {
          userPets.push({ id: doc.id, ...doc.data() } as Pet);
        });
        setPets(userPets);
        setLoadingPets(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (authLoading || !user) {
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
            Meus Pets
          </h1>
          <Link href="/meus-pets/novo">
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Novo Pet
            </Button>
          </Link>
        </div>

        {loadingPets ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="font-bold ml-4">Carregando seus pets...</p>
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="bg-card">
                <CardHeader>
                    <div className='flex justify-between items-start'>
                        <CardTitle className='font-headline'>{pet.nome}</CardTitle>
                        <PetIcon tipo={pet.tipo} className="h-6 w-6 text-muted-foreground" />
                    </div>
                  <CardDescription className='font-bold'>{pet.raca || 'Sem raça definida'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm"><b>Idade:</b> {pet.idade ? `${pet.idade} anos` : 'Não informada'}</p>
                  {pet.observacoes && <p className="text-sm mt-2"><b>Obs:</b> {pet.observacoes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border-2 border-dashed border-black rounded-xl">
            <PawPrint className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold">Nenhum pet cadastrado.</h2>
            <p className="text-muted-foreground mb-4">Adicione seu primeiro companheiro!</p>
            <Link href="/meus-pets/novo">
              <Button>Adicionar Pet</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
