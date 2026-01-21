'use client';

import { useAuth, firestore } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { Chat } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ChatListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const { toast } = useToast();

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
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userChats: Chat[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();
            userChats.push({ id: doc.id, updatedAt, ...data } as Chat);
        });
        setChats(userChats);
        setLoadingChats(false);
      }, (error) => {
        console.error("Error fetching chats list:", error);
        toast({ variant: 'destructive', title: 'Erro ao carregar conversas.' });
        setLoadingChats(false);
      });
      return () => unsubscribe();
    }
  }, [user, toast]);

  const getOtherParticipantName = (chat: Chat) => {
    if (!user) return 'Desconhecido';
    const otherId = chat.participants.find(p => p !== user.uid);
    return otherId ? chat.participantNames[otherId] : 'Desconhecido';
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] bg-card border-2 border-black rounded-2xl shadow-neo flex overflow-hidden">
            <div className="w-1/3 border-r-2 border-black flex flex-col">
                <header className="p-4 border-b-2 border-black">
                    <h2 className="text-2xl font-bold font-headline">Minhas Conversas</h2>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {loadingChats ? (
                        <div className="p-4 text-center">
                            <Loader className="h-6 w-6 animate-spin mx-auto" />
                        </div>
                    ) : chats.length > 0 ? (
                        <nav className="p-2 space-y-1">
                            {chats.map(c => (
                                <Link href={`/chat/${c.id}`} key={c.id}>
                                    <div className={cn(
                                        "p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                                    )}>
                                        <h3 className="font-bold font-headline truncate">{getOtherParticipantName(c)}</h3>
                                        <p className="text-sm text-muted-foreground truncate">{c.lastMessage || 'Nenhuma mensagem.'}</p>
                                        <p className="text-xs text-right font-bold text-muted-foreground mt-1">
                                            {c.updatedAt ? formatDistanceToNow(c.updatedAt, { addSuffix: true, locale: ptBR }) : ''}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </nav>
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2"/>
                            <p className="font-bold">Nenhuma conversa.</p>
                        </div>
                    )}
                </div>
                 <div className="p-2 border-t-2 border-black">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="w-2/3 flex flex-col bg-background">
                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                    <div>
                        <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                        <h2 className="text-xl font-bold">Selecione uma conversa</h2>
                        <p>Escolha uma conversa na lista ao lado para ver as mensagens.</p>
                   </div>
                </div>
            </div>
        </div>
    </div>
  );
}
