'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import type { Host } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, MapPin, Star, MessageSquare, Loader, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth, firestore } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where, serverTimestamp, doc, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function CuidadorDetailPage({ params }: { params: { id: string } }) {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHost() {
      if (!params.id) {
        setLoading(false);
        return;
      };
      
      setLoading(true);
      try {
        const docRef = doc(firestore, "hosts", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHost({ id: docSnap.id, ...docSnap.data() } as Host);
        } else {
          console.warn("Host não encontrado por ID, tentando fallback...");
          const q = query(collection(firestore, "hosts"), where("id", "==", parseInt(params.id as string) || params.id));
          const querySnap = await getDocs(q);
          
          if (!querySnap.empty) {
            const docData = querySnap.docs[0];
            setHost({ id: docData.id, ...docData.data() } as Host);
          } else {
            console.error("Host não encontrado em nenhuma das buscas");
            setHost(null);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        setHost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHost();
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;

    const reviewsColRef = collection(firestore, "hosts", params.id, "reviews");
    const q = query(reviewsColRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(fetchedReviews);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar avaliações",
      });
    });

    return () => unsubscribe();
  }, [params.id, toast]);

  const handleAddReview = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Você precisa estar logado para avaliar.' });
      router.push('/login');
      return;
    }
    if (!newComment.trim()) {
      toast({ variant: 'destructive', title: 'Comentário vazio', description: 'Por favor, escreva algo sobre sua experiência.' });
      return;
    }
    if (rating === 0) {
      toast({ variant: 'destructive', title: 'Nota não selecionada', description: 'Por favor, selecione de 1 a 5 estrelas.' });
      return;
    }

    if (!host) return;

    try {
      const reviewsColRef = collection(firestore, "hosts", host.id, "reviews");
      await addDoc(reviewsColRef, {
        comment: newComment,
        rating: rating,
        authorId: user.uid,
        authorName: user.displayName || 'Anônimo',
        createdAt: serverTimestamp(),
      });

      toast({ title: 'Avaliação enviada!', description: 'Obrigado por sua contribuição.' });
      setNewComment('');
      setRating(0);
    } catch (error) {
      console.error("Error adding review:", error);
      toast({ variant: 'destructive', title: 'Erro ao enviar avaliação' });
    }
  };

  const handleReserve = async () => {
    if (!user || !host) {
      router.push('/login');
      return;
    }
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Data não selecionada",
        description: "Por favor, escolha uma data para a reserva.",
      });
      return;
    }

    try {
      await addDoc(collection(firestore, "reservas"), {
        userId: user.uid,
        hostId: host.ownerId,
        hostName: host.nome,
        hostPhoto: host.photo,
        listingTitle: host.nome,
        listingCity: host.cidade,
        date: `Fevereiro ${selectedDate}, 2026`,
        price: host.preco + 15, // Price + service fee
        status: "confirmada",
        createdAt: new Date()
      });
      toast({
        title: "Reserva Realizada!",
        description: "Sua estadia foi confirmada com sucesso.",
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Erro ao criar reserva: ", error);
      toast({
        variant: "destructive",
        title: "Erro na reserva",
        description: "Ocorreu um erro ao realizar a reserva. Tente novamente.",
      });
    }
  };

  const handleStartChat = async () => {
    if (!user || !host) {
      router.push('/login');
      return;
    }
    
    setLoadingChat(true);
    try {
      const q = query(
        collection(firestore, "chats"),
        where("participants", "array-contains", user.uid)
      );

      const querySnapshot = await getDocs(q);
      let existingChatId: string | null = null;
      querySnapshot.forEach(doc => {
        if (doc.data().participants.includes(host.ownerId)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        router.push(`/chat/${existingChatId}`);
      } else {
        const newChatRef = await addDoc(collection(firestore, "chats"), {
          participants: [user.uid, host.ownerId],
          participantNames: {
              [user.uid]: user.displayName || 'Usuário',
              [host.ownerId]: host.nome
          },
          lastMessage: "",
          updatedAt: serverTimestamp()
        });
        router.push(`/chat/${newChatRef.id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o chat.",
      });
    } finally {
        setLoadingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!host) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 pb-8 md:pb-12">
      <div className="mb-6 pt-8 md:pt-0">
        <h1 className="text-3xl md:text-5xl font-bold font-headline">{host.nome}</h1>
        <div className="flex items-center gap-4 font-bold mt-2">
            <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent" />
                <span className="font-bold">{host.rating.toFixed(1)}</span>
                <span>(28 avaliações)</span>
            </div>
            <span className="">·</span>
            <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{host.cidade}</span>
            </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh] rounded-xl overflow-hidden mb-8 border-2 border-black shadow-neo">
          <div className="relative md:row-span-2">
            <Image src={host.houseImages[0]} alt={host.nome} fill style={{objectFit: "cover"}} data-ai-hint="cozy livingroom"/>
          </div>
          <div className="relative hidden md:block">
            <Image src={host.houseImages[1]} alt={host.nome} fill style={{objectFit: "cover"}} data-ai-hint="happy dog"/>
          </div>
          <div className="relative hidden md:block">
            <Image src={host.houseImages[2]} alt={host.nome} fill style={{objectFit: "cover"}} data-ai-hint="cat playing"/>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-black -mt-16">
            <div className="pt-16">
              <h2 className="text-3xl font-bold font-headline">Cuidador: {host.nome}</h2>
              <p className="font-bold">Cuidador desde 2021</p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <Avatar className="h-32 w-32 border-4 border-black shadow-neo">
                <AvatarImage src={host.photo} alt={host.nome} data-ai-hint="person happy"/>
                <AvatarFallback>{host.nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleStartChat} disabled={loadingChat}>
                {loadingChat ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                Enviar Mensagem
              </Button>
            </div>
          </div>
          
          <Separator className="my-8 border-black" />
          
          {/* Description */}
          <div className="">
            <h3 className="text-xl font-bold font-headline mb-2">Sobre o local</h3>
            <p className="whitespace-pre-line">{host.descricao}</p>
          </div>

          <Separator className="my-8 border-black" />

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-bold font-headline mb-4">O que o local oferece (Exemplo)</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Quintal Grande', 'Aceita Gatos', 'Passeios Diários', 'Brinquedos Disponíveis'].map(amenity => (
                <div key={amenity} className="flex items-center gap-2 font-bold">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* === SEÇÃO DE AVALIAÇÕES === */}
          <div className="mt-8 border-t-4 border-black pt-8">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Star className="fill-[#FACC15] text-black w-8 h-8" strokeWidth={2.5} />
              Avaliações ({reviews.length})
            </h2>

            {/* 1. Formulário de Avaliar (Para teste rápido) */}
            <div className="bg-gray-50 border-2 border-black p-4 rounded-xl mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-bold mb-3">Deixe seu review:</h3>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-200 ${
                        star <= (hoverRating || rating)
                          ? "fill-[#FACC15] text-black"
                          : "text-gray-300 fill-transparent"
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Como foi a hospedagem? (Conte detalhes...)"
                className="w-full p-3 border-2 border-black rounded-lg mb-3 min-h-[80px]"
              />
              <button
                onClick={handleAddReview}
                className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-[#8B5CF6] transition-colors"
              >
                Enviar Avaliação
              </button>
            </div>

            {/* 2. Lista de Reviews */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">Seja o primeiro a avaliar este cuidador!</p>
              ) : (
                reviews.map((rev: any, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border-2 border-black rounded-xl bg-white">
                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-black flex items-center justify-center font-bold shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">Usuário PetHub</span>
                        <div className="flex">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#FACC15] text-black" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{rev.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 bg-secondary">
            <CardHeader>
              <CardTitle className="flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-bold">R$ {host.preco.toFixed(2).replace('.', ',')}</span>
                  <span className="text-base font-normal"> / noite</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="font-bold">{host.rating.toFixed(1)}</span>
                  <span>(28)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="mb-4 font-bold text-center">Fevereiro 2026</div>
                {/* Cabeçalho dos dias */}
                <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-gray-500">
                  <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                {/* Grade dos dias - Forçando o GRID */}
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {/* Dias vazios para alinhar (exemplo) */}
                  <div className="p-2"></div><div className="p-2"></div>
                  {/* Dias reais */}
                  {[...Array(28)].map((_, i) => {
                    const day = i + 1;
                    return (
                    <div 
                      key={i} 
                      className={`p-2 text-center rounded hover:bg-gray-100 cursor-pointer ${day === selectedDate ? 'bg-[#FF007F] text-white font-bold' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {day}
                    </div>
                  )})}
                </div>
              </div>
              <Button className="w-full mt-4" size="lg" disabled={!selectedDate} onClick={handleReserve}>Reservar estadia</Button>
              <p className="text-center text-sm font-bold mt-2">A cobrança não será feita agora.</p>
            
              <div className="space-y-2 mt-4 font-bold">
                <div className="flex justify-between">
                    <span>R$ {host.preco.toFixed(2).replace('.', ',')} x 1 noite</span>
                    <span>R$ {(host.preco).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxa de serviço</span>
                    <span>R$ 15,00</span>
                </div>
              </div>
              <Separator className="my-4 border-black" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {(host.preco + 15).toFixed(2).replace('.', ',')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    