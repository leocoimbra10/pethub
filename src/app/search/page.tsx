'use client';

import React, { useState } from 'react';
import HostCard from "@/components/HostCard";
import { listings, users } from "@/lib/placeholder-data";
import type { Listing, User } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';

const amenitiesList = [
  'Quintal Grande',
  'Aceita Gatos',
  'Passeios Diários',
  'Brinquedos Disponíveis',
  'Piscina para Cães',
  'Adestradora no Local'
];

export default function SearchPage() {
  const [priceRange, setPriceRange] = useState([180]);
  const allListings = listings;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Anfitriões disponíveis</h1>
        <p className="text-muted-foreground mt-2">Encontramos {allListings.length} lugares incríveis para seu pet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
        <aside className="hidden md:block">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-bold">Preço</Label>
                <div className="p-2">
                  <Slider
                    defaultValue={priceRange}
                    max={300}
                    step={10}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="text-center text-muted-foreground">
                  Até R$ {priceRange[0]},00 / noite
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-bold">Comodidades</Label>
                <div className="space-y-2">
                  {amenitiesList.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox id={amenity} />
                      <Label htmlFor={amenity} className="font-normal text-muted-foreground">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg">Aplicar Filtros</Button>
            </CardContent>
          </Card>
        </aside>

        <main>
          <div className="relative mb-8 md:hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Busque por cidade..."
              className="pl-12 w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {allListings.map((listing: Listing) => {
              const host = users.find((user: User) => user.uid === listing.hostId);
              if (!host) return null;
              return <HostCard key={listing.id} listing={listing} host={host} />;
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
