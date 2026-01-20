'use client';

import Link from 'next/link';
import {
  PawPrint,
  Menu,
  Search,
  LayoutDashboard,
  Heart,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  LogIn,
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
  { href: '/search', label: 'Buscar Anfitriões' },
  { href: '/dashboard', label: 'Minhas Reservas' },
];

const UserNav = () => {
  const { setTheme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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
    return <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />;
  }
  
  if (!user) {
    return (
      <Link href="/login">
        <Button>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-11 w-11 rounded-full !shadow-none active:translate-x-0 active:translate-y-0">
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
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Heart className="mr-2 h-4 w-4" />
          <span>Favoritos</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Perfil</span>
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
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-background">
      <div className="container flex h-20 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-2xl">
              Airbnbicho
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-bold">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary text-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">Airbnbicho</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-primary font-bold text-lg"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <Button variant="outline" className="hidden md:flex w-full justify-start text-sm text-muted-foreground bg-card">
                <Search className="mr-2 h-4 w-4" />
                Buscar anfitriões...
             </Button>
          </div>
          <nav className="flex items-center">
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
