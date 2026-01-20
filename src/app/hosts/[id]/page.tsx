import Image from 'next/image';
import { notFound } from 'next/navigation';
import { listings, users } from '@/lib/placeholder-data';
import type { Listing, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, MapPin, Star, Verified } from 'lucide-react';

export default function HostDetailPage({ params }: { params: { id: string } }) {
  const listing = listings.find((l) => l.id === params.id);
  
  if (!listing) {
    notFound();
  }

  const host = users.find((u) => u.uid === listing.hostId);

  if (!host) {
    notFound();
  }

  const amenities = listing.amenities;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{listing.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">4.9</span>
                <span>(28 avaliações)</span>
            </div>
            <span className="text-muted-foreground">·</span>
            <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{listing.city}</span>
            </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-2 h-[50vh] rounded-3xl overflow-hidden mb-8 shadow-lg">
          <div className="relative md:row-span-2">
            <Image src={listing.mainImage} alt={listing.title} fill style={{objectFit: "cover"}} className="hover:scale-105 transition-transform duration-300" data-ai-hint="cozy livingroom"/>
          </div>
          <div className="relative hidden md:block">
            <Image src={listing.gallery[0]} alt={listing.title} fill style={{objectFit: "cover"}} className="hover:scale-105 transition-transform duration-300" data-ai-hint="happy dog"/>
          </div>
          <div className="relative hidden md:block">
            <Image src={listing.gallery[1]} alt={listing.title} fill style={{objectFit: "cover"}} className="hover:scale-105 transition-transform duration-300" data-ai-hint="cat playing"/>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="flex justify-between items-start pb-6 border-b -mt-16">
            <div className="pt-16">
              <h2 className="text-2xl font-bold font-headline">Hospedado por {host.name}</h2>
              <p className="text-muted-foreground">Anfitrião desde 2021</p>
            </div>
            <Avatar className="h-32 w-32 border-8 border-background shadow-lg">
              <AvatarImage src={host.photo} alt={host.name} data-ai-hint="person happy"/>
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <Separator className="my-8" />
          
          {/* Description */}
          <div className="">
            <h3 className="text-xl font-bold mb-2">Sobre o espaço</h3>
            <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
          </div>

          <Separator className="my-8" />

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-bold mb-4">Comodidades</h3>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle className="flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-bold">R$ {listing.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-base text-muted-foreground font-normal"> / noite</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="font-bold text-foreground">4.9</span>
                  <span>(28)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-2">
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                />
              </div>
              <Button className="w-full mt-4" size="lg">Reservar</Button>
              <p className="text-center text-sm text-muted-foreground mt-2">Você não será cobrado ainda</p>
            
              <div className="space-y-2 mt-4 text-muted-foreground">
                <div className="flex justify-between">
                    <span>R$ {listing.price.toFixed(2).replace('.', ',')} x 5 noites</span>
                    <span>R$ {(listing.price * 5).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxa de serviço</span>
                    <span>R$ 75,00</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {(listing.price * 5 + 75).toFixed(2).replace('.', ',')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
