import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Listing, User } from '@/lib/types';
import { Star, Verified } from 'lucide-react';

interface HostCardProps {
  listing: Listing;
  host: User;
}

export default function HostCard({ listing, host }: HostCardProps) {
  return (
    <Link href={`/cuidadores/${listing.id}`}>
      <Card className="w-full overflow-hidden transition-all duration-300 group bg-card hover:shadow-[8px_8px_0px_#8B5CF6] active:shadow-neo-sm">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={listing.mainImage}
              alt={listing.title}
              fill
              style={{ objectFit: 'cover' }}
              className="border-b-2 border-black"
              data-ai-hint="cozy house"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-headline truncate group-hover:text-primary transition-colors">
            {listing.title}
          </CardTitle>
          <p className="text-sm font-bold mt-1">{listing.city}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-black">
              <AvatarImage src={host.photo} alt={host.name} data-ai-hint="person pet" />
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <span className="text-sm font-bold">{host.name}</span>
              {host.isVerified && <Verified className="h-4 w-4 ml-1 text-primary" />}
            </div>
          </div>
          <div className="bg-lime-400 border-2 border-black rounded-md px-2 py-1 shadow-neo-sm">
            <span className="font-bold text-black text-sm">
              R${listing.price.toFixed(0)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
