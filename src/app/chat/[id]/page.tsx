"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc, orderBy } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { Send, ArrowLeft, Phone, ShieldAlert, Loader, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Message, Chat } from '@/lib/types';
import { cn } from "@/lib/utils";
import Link from "next/link";

// === SUB-COMPONENTE INTELIGENTE (COM PROTEÇÃO) ===
const ChatListItem = ({ chat, currentUserId, isActive, onClick }: { chat: Chat, currentUserId: string, isActive: boolean, onClick: () => void }) => {
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
        console.error("Erro silencioso ao buscar user:", error);
        setOtherUser({ name: "Usuário", photo: null });
      }
    };
    fetchUser();
  }, [chat, currentUserId]);

  const baseStyle = "relative flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 rounded-xl !border-2 !border-solid !border-black";
  const activeStyle = "!bg-[#8B5CF6] !text-white translate-x-[2px] translate-y-[2px]";
  const inactiveStyle = "!bg-white !text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div onClick={onClick} className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}>
      <div className={`
        w-12 h-12 shrink-0 flex items-center justify-center rounded-lg !border-2 !border-black font-black text-lg overflow-hidden
        ${isActive ? '!bg-white !text-[#8B5CF6]' : '!bg-[#FACC15] !text-black'}
      `}>
        {otherUser.photo ? (
          <img src={otherUser.photo} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          (otherUser.name || "?").charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className={`font-bold truncate text-base ${isActive ? '!text-white' : '!text-black'}`}>
            {otherUser.name}
          </h3>
        </div>
        <p className={`text-xs truncate font-medium ${isActive ? '!text-purple-100' : '!text-gray-500'}`}>
          {chat.lastMessage || "Conversa iniciada"}
        </p>
      </div>
    </div>
  );
};


// === PÁGINA PRINCIPAL DO CHAT ===
export default function ChatPage() {
  const [user, loadingUser] = useAuthState(auth);
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  const { toast } = useToast();

  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [otherParticipant, setOtherParticipant] = useState<any>(null);
  const [loadingSidebar, setLoadingSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Busca Lista de Conversas
  useEffect(() => {
    if (!user) return;
    setLoadingSidebar(true);
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      
      // Ordenação Segura
      chats.sort((a, b) => {
          const getMillis = (d: any) => d?.toMillis ? d.toMillis() : 0;
          return getMillis(b.updatedAt) - getMillis(a.updatedAt);
      });
      
      setChatsList(chats);
      
      const current = chats.find(c => c.id === chatId);
      setActiveChat(current || null);
      setLoadingSidebar(false);
    });

    return () => unsubscribe();
  }, [user, chatId]);

  // 2. Busca Detalhes do "Outro Participante" para o Header
  useEffect(() => {
    if (activeChat && user) {
        const otherId = activeChat.participants.find((uid: string) => uid !== user.uid);
        if (!otherId) {
            setOtherParticipant(null);
            return;
        };

        const fetchUser = async () => {
            const userDoc = await getDoc(doc(db, "users", otherId));
            if (userDoc.exists()) {
                setOtherParticipant(userDoc.data());
            } else {
                // Fallback com o nome salvo no chat
                setOtherParticipant({ nome: activeChat.participantNames?.[otherId] || "Usuário" });
            }
        };
        fetchUser();
    }
  }, [activeChat, user]);

  // 3. Busca Mensagens do Chat Ativo
  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (error) => {
        console.error("Erro ao carregar mensagens:", error);
        toast({ variant: 'destructive', title: 'Erro ao carregar mensagens.' });
    });

    return () => unsubscribe();
  }, [chatId, toast]);

  // 4. Enviar Mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });

      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        lastMessage: newMessage,
        updatedAt: serverTimestamp()
      });

      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      toast({ variant: "destructive", title: "Erro ao enviar mensagem" });
    }
  };

  if (loadingUser) return (
      <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] bg-card border-2 border-black rounded-2xl shadow-neo flex overflow-hidden">
        
        {/* === SIDEBAR (LISTA DE CONVERSAS) === */}
        <div className="w-1/3 border-r-2 border-black flex flex-col bg-muted/30">
          <header className="p-4 border-b-2 border-black">
            <h2 className="text-2xl font-bold font-headline">Minhas Conversas</h2>
          </header>
          <div className="flex-1 overflow-y-auto p-3">
            {loadingSidebar ? (
                <div className="p-4 text-center"><Loader className="h-6 w-6 animate-spin mx-auto" /></div>
            ) : chatsList.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground"><MessageSquare className="h-8 w-8 mx-auto mb-2"/><p className="font-bold">Nenhuma conversa.</p></div>
            ) : (
              <div className="flex flex-col gap-3 p-2 mt-4">
                {chatsList.map((c) => (
                  <ChatListItem 
                    key={c.id}
                    chat={c}
                    currentUserId={user!.uid}
                    isActive={c.id === chatId}
                    onClick={() => router.push(`/chat/${c.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t-2 border-black">
            <Link href="/dashboard"><Button variant="ghost" className="w-full justify-start"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard</Button></Link>
          </div>
        </div>

        {/* === ÁREA DO CHAT (DIREITA) === */}
        <div className="w-2/3 flex flex-col bg-background">
          {!chatId || !activeChat ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                 <MessageSquare className="h-16 w-16 mb-4" />
                 <h3 className="text-xl font-bold">Selecione uma conversa</h3>
                 <p>Escolha alguém na lista ao lado para ver as mensagens.</p>
              </div>
          ) : (
            <>
              {/* HEADER DO CHAT */}
              <header className="p-4 border-b-2 border-black bg-card flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <button onClick={() => router.push('/chat')} className="md:hidden p-2"><ArrowLeft size={20}/></button>
                    <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarImage src={otherParticipant?.photoURL} />
                        <AvatarFallback>{otherParticipant?.nome?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                   <div>
                      <h3 className="font-black text-lg">{otherParticipant?.nome || "Usuário"}</h3> 
                      <p className="text-xs text-green-500 font-bold flex items-center gap-1">● Online</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <Button variant="ghost" size="icon"><Phone size={20}/></Button>
                   <Button variant="ghost" size="icon"><ShieldAlert size={20} className="text-destructive"/></Button>
                 </div>
              </header>

              {/* LISTA DE MENSAGENS */}
              <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.uid ? 'justify-end' : 'justify-start')}>
                    <div className={cn("max-w-md p-3 rounded-lg shadow-sm", msg.senderId === user?.uid ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none border border-black/10')}>
                      <p className="text-sm font-medium">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </main>

              {/* INPUT AREA */}
              <footer className="p-4 border-t-2 border-black bg-card">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        autoComplete="off"
                        className="bg-background"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send /></Button>
                </form>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
