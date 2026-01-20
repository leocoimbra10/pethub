import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Listing, User } from '@/lib/types';
import { Star, Verified } from 'lucide-react';

interface HostCardProps {
  listing: Listing;
  host: User;
}

export default function HostCard({ listing, host }: HostCardProps) {
  return (
    <Link href={`/hosts/${listing.id}`}>
      <Card className="w-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={listing.mainImage}
              alt={listing.title}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="cozy house"
            />
            <Badge variant="secondary" className="absolute top-3 right-3">
              R$ {listing.price.toFixed(2).replace('.', ',')} / noite
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-headline truncate group-hover:text-primary transition-colors">
            {listing.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{listing.city}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={host.photo} alt={host.name} data-ai-hint="person pet" />
              <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <span className="text-sm font-medium">{host.name}</span>
              {host.isVerified && <Verified className="h-4 w-4 ml-1 text-primary" />}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-bold">4.9</span>
            <span>(28)</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
