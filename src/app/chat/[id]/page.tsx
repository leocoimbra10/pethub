'use client';

import { useAuth, firestore } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where } from 'firebase/firestore';
import { ArrowLeft, Loader, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Message, Chat } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  const { toast } = useToast();

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(true);

  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [loadingChatsList, setLoadingChatsList] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.uid) return; // Trava de segurança

    console.log("Buscando chats para:", user.uid); // Debug
    setLoadingChatsList(true);
    const q = query(
      collection(firestore, "chats"),
      where("participants", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userChats: Chat[] = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();
          userChats.push({ id: doc.id, updatedAt, ...data } as Chat);
      });
      // Client-side sort to replace the removed orderBy
      userChats.sort((a,b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
      console.log("Chats carregados:", userChats); // Debug
      setChatsList(userChats);
      setLoadingChatsList(false);
    }, (error) => {
      console.error("Erro na Sidebar:", error);
      toast({ variant: 'destructive', title: 'Erro ao carregar conversas.' });
      setLoadingChatsList(false);
    });
    return () => unsubscribe();
  }, [user, toast]);
  
  useEffect(() => {
    if (user && chatId) {
      setLoadingChat(true);
      const chatDocRef = doc(firestore, 'chats', chatId);
      const messagesColRef = collection(chatDocRef, 'messages');

      const unsubscribeChat = onSnapshot(chatDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const chatData = docSnap.data() as Omit<Chat, 'id'>;
          if (!chatData.participants.includes(user.uid)) {
            toast({ variant: 'destructive', title: 'Acesso Negado' });
            router.push('/chat');
            return;
          }
          setChat({ id: docSnap.id, ...chatData });
        } else {
            toast({ variant: 'destructive', title: 'Chat não encontrado' });
            router.push('/chat');
        }
        setLoadingChat(false);
      });

      const q = query(messagesColRef, orderBy('createdAt'));
      const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(msgs);
      }, (error) => {
        console.error("Error fetching messages:", error);
        toast({ variant: 'destructive', title: 'Erro ao carregar mensagens' });
      });

      return () => {
        unsubscribeChat();
        unsubscribeMessages();
      };
    }
  }, [user, chatId, router, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    const text = newMessage;
    setNewMessage('');

    try {
        const messagesColRef = collection(firestore, 'chats', chatId, 'messages');
        await addDoc(messagesColRef, {
            text,
            senderId: user.uid,
            createdAt: serverTimestamp(),
        });
        
        const chatDocRef = doc(firestore, 'chats', chatId);
        await updateDoc(chatDocRef, {
            lastMessage: text,
            updatedAt: serverTimestamp()
        });

    } catch (error) {
        console.error('Error sending message:', error);
        toast({ variant: 'destructive', title: 'Erro ao enviar mensagem' });
        setNewMessage(text);
    }
  };

  const getOtherParticipantName = (c: Chat) => {
    if (!user) return 'Desconhecido';
    const otherId = c.participants.find(p => p !== user.uid);
    return otherId ? c.participantNames[otherId] : 'Desconhecido';
  };
    
  const getOtherParticipantDetails = (c: Chat) => {
      if (!user) return { name: 'Desconhecido', photo: '' };
      const otherId = c.participants.find(p => p !== user.uid);
      if (!otherId) return { name: 'Desconhecido', photo: '' };
      
      return {
          name: c.participantNames[otherId] || 'Cuidador',
          photo: '', // A foto não está disponível no documento do chat
          id: otherId
      };
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const otherParticipant = chat ? getOtherParticipantDetails(chat) : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] bg-card border-2 border-black rounded-2xl shadow-neo flex overflow-hidden">
            <div className="w-1/3 border-r-2 border-black flex flex-col">
                <header className="p-4 border-b-2 border-black">
                    <h2 className="text-2xl font-bold font-headline">Minhas Conversas</h2>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {loadingChatsList ? (
                        <div className="p-4 text-center">
                            <Loader className="h-6 w-6 animate-spin mx-auto" />
                        </div>
                    ) : chatsList.length > 0 ? (
                        <nav className="p-2 space-y-1">
                            {chatsList.map(c => (
                                <Link href={`/chat/${c.id}`} key={c.id}>
                                    <div className={cn(
                                        "p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors",
                                        c.id === chatId && "bg-secondary"
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
                {loadingChat || !chat ? (
                    <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                       <Loader className="h-16 w-16 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <header className="flex items-center p-3 border-b-2 border-black bg-card">
                            <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarImage src={otherParticipant?.photo} alt={otherParticipant?.name} />
                                <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-xl font-bold font-headline ml-3">{otherParticipant?.name}</h1>
                        </header>

                        <main className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={cn(
                                    "flex items-end gap-2",
                                    msg.senderId === user.uid ? 'justify-end' : 'justify-start'
                                )}>
                                    <div className={cn(
                                        "max-w-md p-3 rounded-lg shadow-sm",
                                        msg.senderId === user.uid 
                                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                                            : 'bg-muted text-foreground rounded-bl-none border border-black/10'
                                    )}>
                                        <p className="text-sm font-medium">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </main>

                        <footer className="p-4 border-t-2 border-black bg-card">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    autoComplete="off"
                                    className="bg-background"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                    <Send />
                                </Button>
                            </form>
                        </footer>
                    </>
                )}
            </div>
        </div>
    </div>
  );
}
