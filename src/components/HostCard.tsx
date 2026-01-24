import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// The data structure from the search result.
interface Host {
  id: string;
  name: string; // This is the listing title, e.g., "Cantinho Aconchegante no Leblon"
  city: string;
  neighborhood: string;
  price: string; // Price is a string in Firestore
  photoUrl: string; // The main photo for the listing/host
}

interface HostCardProps {
  host: Host;
}

export default function HostCard({ host }: HostCardProps) {
  // Convert price to number for formatting. Handle potential errors.
  const price = Number(host.price) || 0;

  return (
    // The link now correctly points to the detailed host page
    <Link href={`/cuidadores/${host.id}`}>
      <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 group bg-white hover:shadow-[8px_8px_0px_#8B5CF6] active:shadow-none border-4 border-black rounded-lg hover:-translate-y-1 hover:-translate-x-1">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={host.photoUrl || '/default-image.jpg'} // Use a fallback image if photoUrl is missing
              alt={host.name}
              fill
              style={{ objectFit: 'cover' }}
              className="border-b-4 border-black"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-black uppercase truncate group-hover:text-purple-600 transition-colors">
            {host.name}
          </CardTitle>
          <p className="text-sm font-bold mt-1 flex items-center gap-1 text-gray-600">
             <MapPin size={14}/> {host.neighborhood}, {host.city}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
            <span className="text-xs font-bold text-gray-500">DIÁRIA DESDE</span>
            <div className="bg-yellow-400 border-2 border-black rounded-md px-3 py-1 shadow-[3px_3px_0px_#000]">
                <span className="font-black text-black text-lg">
                R${price.toFixed(0)}
                </span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
