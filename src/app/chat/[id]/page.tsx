'use client';

import { useAuth, firestore } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Loader, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Message, Chat } from '@/lib/types';

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
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    if (user && chatId) {
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

        scrollToBottom();

    } catch (error) {
        console.error('Error sending message:', error);
        toast({ variant: 'destructive', title: 'Erro ao enviar mensagem' });
        setNewMessage(text);
    }
  };

  if (loading || loadingChat || !user || !chat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const otherParticipantName = chat.participantNames[chat.participants.find(p => p !== user.uid)!] || 'Cuidador';

  return (
    <div className="flex flex-col h-screen bg-card">
        <header className="flex items-center p-4 border-b-2 border-black sticky top-0 bg-secondary z-10">
            <Link href="/chat">
                <Button variant="ghost" size="icon">
                    <ArrowLeft />
                </Button>
            </Link>
            <h1 className="text-xl font-bold font-headline ml-4">{otherParticipantName}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.senderId === user.uid ? 'bg-primary text-primary-foreground' : 'bg-muted border-2 border-black'}`}>
                        <p className="text-sm font-bold">{msg.text}</p>
                    </div>
                </div>
            ))}
             <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t-2 border-black sticky bottom-0 bg-background z-10">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send />
                </Button>
            </form>
        </footer>
    </div>
  );
}
