'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { listings, users } from '@/lib/placeholder-data';
import type { Listing, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth, firestore } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function CuidadorDetailPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const listing = listings.find((l) => l.id === params.id);
  
  if (!listing) {
    notFound();
  }

  const host = users.find((u) => u.uid === listing.hostId);

  if (!host) {
    notFound();
  }

  const amenities = listing.amenities;

  const handleReserve = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Data não selecionada",
        description: "Por favor, escolha uma data para a reserva.",
      });
      return;
    }

    try {
      await addDoc(collection(firestore, "reservas"), {
        userId: user.uid,
        hostId: host.uid,
        hostName: host.name,
        hostPhoto: host.photo,
        listingTitle: listing.title,
        listingCity: listing.city,
        date: `Fevereiro ${selectedDate}, 2026`,
        price: listing.price + 15, // Price + service fee
        status: "confirmada",
        createdAt: new Date()
      });
      toast({
        title: "Reserva Realizada!",
        description: "Sua estadia foi confirmada com sucesso.",
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Erro ao criar reserva: ", error);
      toast({
        variant: "destructive",
        title: "Erro na reserva",
        description: "Ocorreu um erro ao realizar a reserva. Tente novamente.",
      });
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-3xl md:text-5xl font-bold font-headline">{listing.title}</h1>
        <div className="flex items-center gap-4 font-bold mt-2">
            <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent" />
                <span className="font-bold">4.9</span>
                <span>(28 avaliações)</span>
            </div>
            <span className="">·</span>
            <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{listing.city}</span>
            </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh] rounded-xl overflow-hidden mb-8 border-2 border-black shadow-neo">
          <div className="relative md:row-span-2">
            <Image src={listing.mainImage} alt={listing.title} fill style={{objectFit: "cover"}} data-ai-hint="cozy livingroom"/>
          </div>
          <div className="relative hidden md:block">
            <Image src={listing.gallery[0]} alt={listing.title} fill style={{objectFit: "cover"}} data-ai-hint="happy dog"/>
          </div>
          <div className="relative hidden md:block">
            <Image src={listing.gallery[1]} alt={listing.title} fill style={{objectFit: "cover"}} data-ai-hint="cat playing"/>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-black -mt-16">
            <div className="pt-16">
              <h2 className="text-3xl font-bold font-headline">Cuidador: {host.name}</h2>
              <p className="font-bold">Cuidador desde 2021</p>
            </div>
            <Avatar className="h-32 w-32 border-4 border-black shadow-neo">
              <AvatarImage src={host.photo} alt={host.name} data-ai-hint="person happy"/>
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <Separator className="my-8 border-black" />
          
          {/* Description */}
          <div className="">
            <h3 className="text-xl font-bold font-headline mb-2">Sobre o local</h3>
            <p className="whitespace-pre-line">{listing.description}</p>
          </div>

          <Separator className="my-8 border-black" />

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-bold font-headline mb-4">O que o local oferece</h3>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-2 font-bold">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 bg-secondary">
            <CardHeader>
              <CardTitle className="flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-bold">R$ {listing.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-base font-normal"> / noite</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="font-bold">4.9</span>
                  <span>(28)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="mb-4 font-bold text-center">Fevereiro 2026</div>
                {/* Cabeçalho dos dias */}
                <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-gray-500">
                  <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                {/* Grade dos dias - Forçando o GRID */}
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {/* Dias vazios para alinhar (exemplo) */}
                  <div className="p-2"></div><div className="p-2"></div>
                  {/* Dias reais */}
                  {[...Array(28)].map((_, i) => {
                    const day = i + 1;
                    return (
                    <div 
                      key={i} 
                      className={`p-2 text-center rounded hover:bg-gray-100 cursor-pointer ${day === selectedDate ? 'bg-[#FF007F] text-white font-bold' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </div>
                  )})}
                </div>
              </div>
              <Button className="w-full mt-4" size="lg" disabled={!selectedDate} onClick={handleReserve}>Reservar estadia</Button>
              <p className="text-center text-sm font-bold mt-2">A cobrança não será feita agora.</p>
            
              <div className="space-y-2 mt-4 font-bold">
                <div className="flex justify-between">
                    <span>R$ {listing.price.toFixed(2).replace('.', ',')} x 1 noite</span>
                    <span>R$ {(listing.price).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxa de serviço</span>
                    <span>R$ 15,00</span>
                </div>
              </div>
              <Separator className="my-4 border-black" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {(listing.price + 15).toFixed(2).replace('.', ',')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
