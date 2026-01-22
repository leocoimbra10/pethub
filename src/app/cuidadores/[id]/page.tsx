"use client";

import { useState, useEffect } from "react";
import { firestore, useAuth } from "@/lib/firebase";
import {
  doc,
  collection,
  addDoc,
  query,
  serverTimestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useRouter, notFound } from "next/navigation";
import {
  MapPin,
  Star,
  ShieldCheck,
  MessageCircle,
  Camera,
  Loader,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Host } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CuidadorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  const [loadingChat, setLoadingChat] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (checkIn && checkOut && host?.preco) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      if (d2 <= d1) {
        setTotalNights(0);
        setTotalPrice(0);
        return;
      }
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalNights(diffDays);
        setTotalPrice(diffDays * host.preco);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, host]);

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      notFound();
      return;
    }

    setLoading(true);

    const hostDocRef = doc(firestore, "hosts", params.id);
    const unsubscribeHost = onSnapshot(
      hostDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const hostData = { id: docSnap.id, ...docSnap.data() } as Host;
          setHost(hostData);
          if (hostData.houseImages && hostData.houseImages.length > 0) {
            setActiveImage(hostData.houseImages[0]);
          }
        } else {
          console.error("Anfitrião não encontrado.");
          setHost(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar anfitrião:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados do anfitrião.",
        });
        setLoading(false);
      }
    );

    const reviewsColRef = collection(firestore, "hosts", params.id, "reviews");
    const q = query(reviewsColRef, orderBy("createdAt", "desc"));
    const unsubscribeReviews = onSnapshot(
      q,
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(fetchedReviews);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar avaliações",
        });
      }
    );

    return () => {
      unsubscribeHost();
      unsubscribeReviews();
    };
  }, [params.id, router, toast]);

  const handleStartChat = async () => {
    if (!user || !host) {
      router.push("/login");
      return;
    }
    setLoadingChat(true);

    let firstMessage = "Olá! Tenho interesse na hospedagem.";
    if (totalNights > 0 && checkIn && checkOut) {
      const dateFmt = (d: string) => {
        const date = new Date(d);
        const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        return adjustedDate.toLocaleDateString('pt-BR');
      }
      firstMessage = `Olá! Gostaria de solicitar uma reserva para ${totalNights} noites (de ${dateFmt(checkIn)} até ${dateFmt(checkOut)}). O valor total estimado é de R$ ${totalPrice}. Poderia confirmar a disponibilidade?`;
    }
    
    try {
      const newChatRef = await addDoc(collection(firestore, "chats"), {
        participants: [user.uid, host.ownerId],
        participantNames: {
          [user.uid]: user.displayName || "Usuário",
          [host.ownerId]: host.nome,
        },
        lastMessage: firstMessage,
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(firestore, "chats", newChatRef.id, "messages"), {
        text: firstMessage,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });

      router.push(`/chat/${newChatRef.id}`);
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

  const handleAddReview = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Você precisa estar logado para avaliar.",
      });
      router.push("/login");
      return;
    }
    if (!newComment.trim()) {
      toast({
        variant: "destructive",
        title: "Comentário vazio",
        description: "Por favor, escreva algo sobre sua experiência.",
      });
      return;
    }
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Nota não selecionada",
        description: "Por favor, selecione de 1 a 5 estrelas.",
      });
      return;
    }

    if (!host) return;

    try {
      const reviewsColRef = collection(firestore, "hosts", host.id, "reviews");
      await addDoc(reviewsColRef, {
        comment: newComment,
        rating: rating,
        authorId: user.uid,
        authorName: user.displayName || "Anônimo",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por sua contribuição.",
      });
      setNewComment("");
      setRating(0);
      setHoverRating(0);
    } catch (error) {
      console.error("Error adding review:", error);
      toast({ variant: "destructive", title: "Erro ao enviar avaliação" });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );

  if (!host) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-0 md:px-4 max-w-5xl pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="w-full h-[400px] bg-gray-100 md:rounded-2xl border-b-4 md:border-4 border-black overflow-hidden relative shadow-neo-sm">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={host.nome}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Camera className="w-16 h-16 mb-2 opacity-50" />
                  <span className="font-bold">Sem fotos disponíveis</span>
                </div>
              )}
            </div>

            {host.houseImages && host.houseImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-4 md:px-0">
                {host.houseImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? "border-black ring-2 ring-black ring-offset-2"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 md:px-0 pt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2 leading-tight">
                  {host.nome}
                </h1>
                <p className="text-xl font-bold text-gray-500 flex items-center gap-2">
                  <MapPin className="text-black" /> {host.cidade}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full border-2 border-black bg-gray-200 overflow-hidden mb-1">
                  <div className="w-full h-full flex items-center justify-center bg-[#FACC15] font-black text-xl">
                    {host.nome?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 w-20 truncate">
                  {host.nome}
                </span>
              </div>
            </div>

            <hr className="border-t-2 border-muted my-6" />

            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-muted/50 p-4 rounded-xl border-2 border-transparent">
                <ShieldCheck className="w-8 h-8 mb-2 text-primary" />
                <h3 className="font-bold">Identidade Verificada</h3>
                <p className="text-xs text-muted-foreground">
                  Documentação checada.
                </p>
              </div>
              <div className="flex-1 bg-muted/50 p-4 rounded-xl border-2 border-transparent">
                <Star className="w-8 h-8 mb-2 text-secondary fill-secondary" />
                <h3 className="font-bold">Anfitrião Top</h3>
                <p className="text-xs text-muted-foreground">Bem avaliado.</p>
              </div>
            </div>

            <h3 className="font-black text-xl mb-3">Sobre o espaço</h3>
            <p className="text-foreground/80 leading-relaxed mb-8 whitespace-pre-line">
              {host.descricao ||
                "O anfitrião não adicionou uma descrição detalhada."}
            </p>

            <div className="bg-card border-2 border-black p-6 rounded-2xl shadow-neo sticky top-24">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-3xl font-black">R$ {host.preco}</span>
                  <span className="text-muted-foreground font-bold">
                    {" "}
                    / noite
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-sm">
                  <Star className="w-4 h-4 fill-black" />{" "}
                  {host.rating?.toFixed(1) || "Novo"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <Label htmlFor="checkin" className="block text-xs font-bold mb-1">Check-in</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-2 pl-2 border-2 border-black rounded-lg font-bold text-sm bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="checkout" className="block text-xs font-bold mb-1">Check-out</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    disabled={!checkIn}
                    className="w-full p-2 pl-2 border-2 border-black rounded-lg font-bold text-sm bg-background"
                  />
                </div>
              </div>

              {totalNights > 0 && (
                <div className="bg-muted/50 p-3 rounded-lg border-2 border-muted mb-4 space-y-2 text-sm">
                  <div className="flex justify-between font-bold">
                    <span>R$ {host.preco} x {totalNights} noites</span>
                    <span>R$ {totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary">
                    <span>Taxa PetHub</span>
                    <span>Grátis</span>
                  </div>
                  <div className="border-t-2 border-muted pt-2 flex justify-between text-lg font-black">
                    <span>Total</span>
                    <span>R$ {totalPrice}</span>
                  </div>
                </div>
              )}

              <Button
                size="lg"
                onClick={handleStartChat}
                disabled={loadingChat}
                className="w-full bg-accent text-accent-foreground font-black text-lg py-4 rounded-xl"
              >
                {loadingChat ? <Loader className="animate-spin" /> : <MessageCircle />}
                {totalNights > 0 ? "Solicitar Reserva" : "Falar com Anfitrião"}
              </Button>
               {totalNights > 0 && <p className="text-xs text-center mt-2 font-bold text-muted-foreground">Você não será cobrado ainda.</p>}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t-4 border-black pt-12 px-4 md:px-0">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Star
              className="fill-secondary text-black w-8 h-8"
              strokeWidth={2.5}
            />
            Avaliações ({reviews.length})
          </h2>

          <div className="bg-muted/50 border-2 border-black p-4 rounded-xl mb-8 shadow-neo-sm">
            <h3 className="font-bold mb-3">Avalie sua estadia:</h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= (hoverRating || rating)
                        ? "fill-secondary text-black"
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
              placeholder="Conte como foi a sua experiência..."
              className="w-full p-3 border-2 border-black rounded-lg mb-3 h-20 bg-background"
            />
            <Button onClick={handleAddReview} className="bg-black text-white font-bold">
              Enviar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground italic md:col-span-2">
                Seja o primeiro a avaliar!
              </p>
            ) : (
              reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-4 border-2 border-black rounded-xl bg-card shadow-neo-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">
                      {rev.authorName || "Anônimo"}
                    </span>
                    <div className="flex">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-secondary"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/80 text-sm">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
