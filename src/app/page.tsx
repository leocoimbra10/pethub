import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import HostCard from '@/components/HostCard';
import { listings, users } from '@/lib/placeholder-data';
import type { Listing, User } from '@/lib/types';

export default function Home() {
  const featuredListings = listings.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="text-center py-12 md:py-24 bg-card rounded-3xl shadow-md">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
          Airbnbicho
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
          Seu pet em boas mãos. Encontre o anfitrião perfeito para seu melhor amigo.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto px-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Busque por cidade..."
              className="pl-12 w-full"
            />
          </div>
          <Link href="/search" className="w-full sm:w-auto">
            <Button className="w-full" size="lg">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold font-headline text-center">Anfitriões em Destaque</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredListings.map((listing: Listing) => {
            const host = users.find((user: User) => user.uid === listing.hostId);
            if (!host) return null;
            return <HostCard key={listing.id} listing={listing} host={host} />;
          })}
        </div>
        <div className="text-center mt-12">
          <Link href="/search">
            <Button variant="secondary" size="lg">Ver todos os anfitriões</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
