export type User = {
  uid: string;
  role: 'host' | 'tutor';
  name: string;
  photo: string;
  isVerified: boolean;
};

export type Listing = {
  id: string;
  hostId: string;
  title: string;
  description: string;
  price: number; // price per night
  city: string;
  amenities: string[];
  mainImage: string;
  gallery: string[];
};

export type Booking = {
  id:string;
  tutorId: string;
  hostId: string;
  listingId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startDate: Date;
  endDate: Date;
  totalPrice: number;
};

export type Message = {
  id: string;
  bookingId: string;
  content: string;
  senderId: string;
  timestamp: Date;
};
