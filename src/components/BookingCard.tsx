import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MessageSquare, MapPin } from 'lucide-react';
import type { Booking, Listing, User } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingCardProps {
  booking: Booking;
  listing: Listing;
  host: User;
}

export default function BookingCard({ booking, listing, host }: BookingCardProps) {
  const startDate = format(booking.startDate, "dd 'de' MMM", { locale: ptBR });
  const endDate = format(booking.endDate, "dd 'de' MMM, yyyy", { locale: ptBR });

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <div className="relative h-48 w-full md:w-48">
            <Image
              src={listing.mainImage}
              alt={listing.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              data-ai-hint="cozy livingroom"
            />
          </div>
        </div>
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {listing.city}
              </p>
              <Link href={`/hosts/${listing.id}`}>
                <h3 className="text-xl font-bold font-headline hover:text-primary transition-colors">{listing.title}</h3>
              </Link>
              <p className="text-muted-foreground">Anfitrião: {host.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">
                R$ {booking.totalPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>{startDate} - {endDate}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              <Link href={`/hosts/${listing.id}`}>
                <Button>Ver Detalhes</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
