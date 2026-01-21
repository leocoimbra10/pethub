'use client';

import { useAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "@/components/BookingCard";
import { bookings, listings, users } from "@/lib/placeholder-data";
import type { Booking, Listing, User } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // In a real app, you'd fetch this based on the logged in user's ID
      // For this demo, we're using a static user 'tutor1'
      const filteredBookings = bookings.filter(b => b.tutorId === 'tutor1');
      setUserBookings(filteredBookings);
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-10">
        <Loader className="h-16 w-16 animate-spin text-primary" />
        <p className="font-bold text-lg ml-4">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    // Briefly show a loader before the redirect kicks in
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = userBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-5xl font-bold font-headline mb-8">
        Minhas Reservas
      </h1>
      
      <Tabs defaultValue="proximas">
        <TabsList>
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="anteriores">Anteriores</TabsTrigger>
        </TabsList>
        <TabsContent value="proximas" className="mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-6">
              {upcomingBookings.map(booking => {
                const listing = listings.find(l => l.id === booking.listingId);
                const host = users.find(u => u.uid === booking.hostId);
                if (!listing || !host) return null;
                return <BookingCard key={booking.id} booking={booking} listing={listing} host={host} />;
              })}
            </div>
          ) : (
            <p className="font-bold text-center mt-8 p-8 border-2 border-dashed border-black rounded-xl">Você não tem nenhuma reserva futura.</p>
          )}
        </TabsContent>
        <TabsContent value="anteriores" className="mt-6">
          {pastBookings.length > 0 ? (
            <div className="space-y-6">
              {pastBookings.map(booking => {
                const listing = listings.find(l => l.id === booking.listingId);
                const host = users.find(u => u.uid === booking.hostId);
                if (!listing || !host) return null;
                return <BookingCard key={booking.id} booking={booking} listing={listing} host={host} />;
              })}
            </div>
          ) : (
            <p className="font-bold text-center mt-8 p-8 border-2 border-dashed border-black rounded-xl">Você não tem nenhuma reserva anterior.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
