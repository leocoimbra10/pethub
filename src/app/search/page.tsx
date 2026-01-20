import HostCard from "@/components/HostCard";
import { Input } from "@/components/ui/input";
import { listings, users } from "@/lib/placeholder-data";
import type { Listing, User } from "@/lib/types";

export default function SearchPage() {
  const allListings = listings;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Anfitriões disponíveis</h1>
        <p className="text-muted-foreground mt-2">Encontramos {allListings.length} lugares incríveis para seu pet.</p>
        {/* We could add filters here in the future */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allListings.map((listing: Listing) => {
          const host = users.find((user: User) => user.uid === listing.hostId);
          if (!host) return null;
          return <HostCard key={listing.id} listing={listing} host={host} />;
        })}
      </div>
    </div>
  );
}
