'use client';

import BookingCard from "@/components/BookingCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { bookings, listings, users } from "@/lib/placeholder-data";
import type { Booking, Listing, User } from "@/lib/types";
import { useAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const now = new Date();
  const upcomingBookings = bookings.filter(b => b.endDate >= now);
  const pastBookings = bookings.filter(b => b.endDate < now);

  const renderBookingList = (bookingList: Booking[]) => {
    if (bookingList.length === 0) {
      return <p className="font-bold text-center py-8">Nenhuma reserva encontrada.</p>;
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
  
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-5xl font-bold font-headline mb-8 text-center">
        Minhas Reservas
      </h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto">
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
