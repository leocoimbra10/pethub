import BookingCard from "@/components/BookingCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { bookings, listings, users } from "@/lib/placeholder-data";
import type { Booking, Listing, User } from "@/lib/types";

export default function DashboardPage() {
  const now = new Date();
  const upcomingBookings = bookings.filter(b => b.endDate >= now);
  const pastBookings = bookings.filter(b => b.endDate < now);

  const renderBookingList = (bookingList: Booking[]) => {
    if (bookingList.length === 0) {
      return <p className="text-muted-foreground text-center py-8">Nenhuma reserva encontrada.</p>;
    }

    return (
      <div className="space-y-6">
        {bookingList.map((booking) => {
          const listing = listings.find((l: Listing) => l.id === booking.listingId);
          const host = users.find((u: User) => u.uid === booking.hostId);
          if (!listing || !host) return null;
          return <BookingCard key={booking.id} booking={booking} listing={listing} host={host} />;
        })}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        Minhas Reservas
      </h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Anteriores</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {renderBookingList(upcomingBookings)}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {renderBookingList(pastBookings)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
