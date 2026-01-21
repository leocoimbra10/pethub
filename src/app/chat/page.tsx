'use client';

import { useAuth, firestore } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { Chat } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setLoadingChats(true);
      const q = query(
        collection(firestore, "chats"),
        where("participants", "array-contains", user.uid),
        orderBy("updatedAt", "desc")
      );

      const unsubscribe = onSnapshot(q,
        (querySnapshot) => {
          const userChats: Chat[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();
            userChats.push({ id: doc.id, updatedAt, ...data } as Chat);
          });
          setChats(userChats);
          setLoadingChats(false);
        },
        (error) => {
          console.error("Erro ao buscar chats (com ordenação): ", error);
          // Fallback para query sem ordenação caso o índice não exista
          const qWithoutOrder = query(
            collection(firestore, "chats"),
            where("participants", "array-contains", user.uid)
          );
           const unsubscribeWithoutOrder = onSnapshot(qWithoutOrder, (snapshot) => {
             const userChats: Chat[] = [];
             snapshot.forEach((doc) => {
                const data = doc.data();
                const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();
                userChats.push({ id: doc.id, updatedAt, ...data } as Chat);
             });
             // Ordenação no lado do cliente
             setChats(userChats.sort((a,b) => (b.updatedAt?.getTime ? b.updatedAt.getTime() : 0) - (a.updatedAt?.getTime ? a.updatedAt.getTime() : 0)));
             setLoadingChats(false);
           }, (finalError) => {
                console.error("Erro final ao buscar chats:", finalError);
                setLoadingChats(false);
           });
           return () => unsubscribeWithoutOrder();
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const getOtherParticipantName = (chat: Chat) => {
    const otherId = chat.participants.find(p => p !== user.uid);
    return otherId ? chat.participantNames[otherId] : 'Desconhecido';
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold mb-4 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Minhas Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingChats ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="font-bold ml-4">Carregando conversas...</p>
              </div>
            ) : chats.length > 0 ? (
              <div className="space-y-4">
                {chats.map(chat => (
                  <Link href={`/chat/${chat.id}`} key={chat.id}>
                    <div className="p-4 border-2 border-black rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg font-headline">{getOtherParticipantName(chat)}</p>
                        <p className="text-xs font-bold text-muted-foreground">
                          {chat.updatedAt ? formatDistanceToNow(chat.updatedAt, { addSuffix: true, locale: ptBR }) : ''}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || 'Nenhuma mensagem ainda.'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-black rounded-xl">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-bold">Nenhuma conversa encontrada.</p>
                <p className="text-sm text-muted-foreground">Inicie uma conversa na página de um cuidador.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
