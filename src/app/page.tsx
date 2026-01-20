import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import HostCard from '@/components/HostCard';
import { listings, users } from '@/lib/placeholder-data';
import type { Listing, User } from '@/lib/types';

export default function Home() {
  const featuredListings = listings.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="text-center py-12 md:py-20 bg-secondary rounded-xl border-2 border-black shadow-[8px_8px_0px_#000]">
        <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tight text-black">
          Airbnbicho
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-black font-medium">
          Seu pet em boas mãos. Encontre o anfitrião perfeito para seu melhor amigo.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto px-4">
          <Button className="w-full max-w-sm bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
              <MapPin className="mr-2 h-5 w-5" />
              Encontrar Hosts Perto de Mim
          </Button>
          <div className="flex items-center gap-2 text-black w-full max-w-sm">
              <div className="flex-grow border-t-2 border-black"></div>
              <span className="text-sm font-bold">OU</span>
              <div className="flex-grow border-t-2 border-black"></div>
          </div>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-sm">
              <Input
                type="text"
                placeholder="Digite a cidade..."
                className="w-full bg-card"
              />
              <Link href="/search" className="w-full sm:w-auto">
                  <Button type="submit" className="w-full bg-primary" size="lg">
                      <Search className="h-5 w-5" />
                  </Button>
              </Link>
          </form>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-4xl font-bold font-headline text-center">Anfitriões em Destaque</h2>
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
