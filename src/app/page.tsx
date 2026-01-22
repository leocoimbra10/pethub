import Link from "next/link";
import { Button } from '@/components/ui/button';
import { PawPrint, Home as HomeIcon, TreePalm, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-50 border-b-2 border-black">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold text-foreground tracking-tight font-headline">PetHub</span>
          </Link>
          <div className="space-x-4">
            <Link href="/login" className="text-foreground hover:text-primary font-medium transition">
              Entrar
            </Link>
            <Button asChild className="hidden md:inline-block">
              <Link href="/register">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1">
        <div className="container mx-auto px-6 py-16 md:py-24 text-center">
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight leading-tight font-headline">
            O melhor amigo do <br className="hidden md:block" />
            <span className="text-primary">seu melhor amigo.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-bold">
            Conectamos donos amorosos a cuidadores de confiança. 
            Hospedagem, passeios e muito carinho para o seu pet enquanto você viaja ou trabalha.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg">
              <Link href="/search">
                🔍 Encontrar Cuidador
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto text-lg">
               <Link href="/quero-cuidar">
                💙 Quero ser Cuidador
              </Link>
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader className="items-center">
                <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full border-2 border-black">
                  <HomeIcon className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl font-headline">Hospedagem</CardTitle>
                <p className="text-muted-foreground mt-2">Seu pet fica na casa de um anfitrião amoroso, sem gaiolas e com todo conforto.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="items-center">
                <div className="bg-secondary/20 w-16 h-16 flex items-center justify-center rounded-full border-2 border-black">
                  <TreePalm className="h-8 w-8 text-secondary-foreground" />
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl font-headline">Passeios</CardTitle>
                <p className="text-muted-foreground mt-2">Passeadores verificados para gastar a energia do seu cãozinho com segurança.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="items-center">
                <div className="bg-accent/10 w-16 h-16 flex items-center justify-center rounded-full border-2 border-black">
                   <Shield className="h-8 w-8 text-accent" />
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl font-headline">Segurança</CardTitle>
                <p className="text-muted-foreground mt-2">Cuidadores avaliados, fotos diárias e suporte 24h para sua tranquilidade.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card py-8 border-t-2 border-black mt-10">
        <div className="text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} PetHub. Feito com amor por Leo Coimbra.</p>
        </div>
      </footer>
    </div>
  );
}
