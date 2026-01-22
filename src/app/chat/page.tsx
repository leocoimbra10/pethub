'use client';

import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import type { Chat } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Sub-componente para item da lista de chat
const ChatListItem = ({ chat, currentUserId, onClick }: { chat: Chat, currentUserId: string, onClick: () => void }) => {
  const [otherUser, setOtherUser] = useState<any>({ name: "Carregando...", photo: null });

  useEffect(() => {
    // Proteção
    if (!chat || !currentUserId || !chat.participants) {
        setOtherUser({ name: "Chat", photo: null });
        return;
    }

    const otherId = chat.participants.find((uid: string) => uid !== currentUserId);
    
    if (!otherId) {
       setOtherUser({ name: "Chat", photo: null });
       return;
    }

    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", otherId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setOtherUser({ 
            name: data.nome || "Usuário sem nome", 
            photo: data.photoURL 
          });
        } else {
          // Fallback seguro
          const fallbackName = chat.participantNames?.[otherId] || "Usuário";
          setOtherUser({ name: fallbackName, photo: null });
        }
      } catch (error) {
        console.error("Erro ao buscar user", error);
        setOtherUser({ name: "Usuário", photo: null });
      }
    };
    fetchUser();
  }, [chat, currentUserId]);

  return (
    <div
      onClick={onClick}
      style={{
          border: "2px solid black",
          backgroundColor: "white",
          boxShadow: "4px 4px 0px 0px black",
          color: "black"
      }}
      className="relative flex items-center gap-3 p-4 cursor-pointer rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]"
    >
      <div 
        className="w-12 h-12 shrink-0 flex items-center justify-center rounded-lg font-black text-lg overflow-hidden"
        style={{
            border: "2px solid black",
            backgroundColor: "#FACC15",
            color: "black"
        }}
      >
        {otherUser.photo ? (
          <img src={otherUser.photo} alt={otherUser.name} className="w-full h-full object-cover" />
        ) : (
          (otherUser.name || '?').charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate text-base">{otherUser.name}</h3>
        <p className="text-xs truncate font-medium text-gray-500">
          {chat.lastMessage || "Toque para conversar"}
        </p>
      </div>
    </div>
  );
};


export default function ChatListPage() {
  const [user, loading] = useAuthState(auth);
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
        collection(db, "chats"),
        where("participants", "array-contains", user.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userChats: Chat[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
        
        userChats.sort((a, b) => {
            const getMillis = (d: any) => d?.toMillis ? d.toMillis() : 0;
            return getMillis(b.updatedAt) - getMillis(a.updatedAt);
        });

        setChats(userChats);
        setLoadingChats(false);
      }, (error) => {
        console.error("Error fetching chats list:", error);
        toast({ variant: 'destructive', title: 'Erro ao carregar conversas.' });
        setLoadingChats(false);
      });
      return () => unsubscribe();
    } else if (!loading) {
        setLoadingChats(false);
    }
  }, [user, loading, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex gap-6">
            
            <div className="w-full md:w-1/3 flex flex-col h-full bg-card border-2 border-black rounded-2xl shadow-neo overflow-hidden">
                <header className="p-4 border-b-2 border-black">
                    <h2 className="text-2xl font-bold font-headline">Minhas Conversas</h2>
                </header>
                
                <div className="flex-1 overflow-y-auto">
                    {loadingChats ? (
                        <div className="p-8 text-center">
                            <Loader className="h-8 w-8 animate-spin text-primary mx-auto" />
                            <p className='font-bold mt-2'>Carregando...</p>
                        </div>
                    ) : chats.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4"/>
                            <p className="font-bold text-lg">Nenhuma conversa.</p>
                            <p className="text-sm">Inicie uma conversa na página de um cuidador.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 p-2 mt-4">
                            {chats.map((c) => (
                              <ChatListItem
                                key={c.id}
                                chat={c}
                                currentUserId={user!.uid}
                                onClick={() => router.push(`/chat/${c.id}`)}
                              />
                            ))}
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

            <div className="hidden md:flex w-2/3 flex-1 flex-col items-center justify-center border-2 border-black rounded-3xl bg-secondary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center border-2 border-black mb-6 shadow-neo">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-headline mb-2">Selecione uma conversa</h3>
                <p className="text-secondary-foreground font-bold max-w-xs">
                    Escolha uma conversa na lista ao lado para ver as mensagens e combinar a hospedagem.
                </p>
            </div>
        </div>
    </div>
  );
}
