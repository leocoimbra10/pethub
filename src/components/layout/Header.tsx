'use client';

import Link from 'next/link';
import {
  Menu,
  Heart,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const mainNav = [
  { href: '/search', label: 'Achar um Lar' },
  { href: '/#como-funciona', label: 'Como rola?' },
];

const UserActions = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Você foi desconectado." });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
        <Link href="/login" className="font-bold text-gray-600 hover:text-primary transition-colors">
            Entrar na Toca
        </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-11 w-11 rounded-full !shadow-none active:translate-x-0 active:translate-y-0 p-0">
          <Avatar className="h-11 w-11 border-2 border-black">
            <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user-avatar/100/100"} data-ai-hint="person" alt="Avatar do usuário" />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'Usuário'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard">
          <DropdownMenuItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Minhas Reservas</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Heart className="mr-2 h-4 w-4" />
          <span>Favoritos</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-2">Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white">
      <div className="container flex h-20 items-center">
        {/* Left Side: Logo + Mobile Trigger */}
        <div className="flex flex-1 items-center justify-start">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden mr-4">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="/" className="flex items-center mb-8">
                        <span className="font-bold font-headline text-3xl">PetHub</span>
                    </Link>
                    <nav className="flex flex-col space-y-4">
                    {mainNav.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        className="transition-colors hover:text-primary font-bold text-lg"
                        >
                        {item.label}
                        </Link>
                    ))}
                    </nav>
                    <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4">
                         <Link href="/login#register" className="w-full">
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                Quero ser Anfitrião <Heart className="h-4 w-4 ml-1" />
                            </Button>
                         </Link>
                         <div className="text-center">
                           <UserActions />
                         </div>
                    </div>
                </SheetContent>
            </Sheet>
             <Link href="/" className="flex items-center">
                <span className="font-bold font-headline text-3xl">
                    PetHub
                </span>
            </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center space-x-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-bold text-gray-600 transition-colors hover:text-primary text-base"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Desktop Actions */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          <UserActions />
           <Link href="/login#register">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Quero ser Anfitrião <Heart className="h-4 w-4 ml-1" />
            </Button>
           </Link>
        </div>
      </div>
    </header>
  );
}
