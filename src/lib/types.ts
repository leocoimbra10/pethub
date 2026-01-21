export type User = {
  uid: string;
  role: 'cuidador' | 'tutor';
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
  houseImages: string[];
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

export type Pet = {
  id: string;
  ownerId: string;
  nome: string;
  tipo: 'Cachorro' | 'Gato' | 'Outro';
  raca: string;
  idade?: number;
  observacoes?: string;
  createdAt: Date;
};
