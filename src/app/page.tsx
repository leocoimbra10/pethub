'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, ShieldCheck, Camera, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?city=${encodeURIComponent(searchTerm)}`);
  };


  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative border-b-2 border-black bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=1976&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tight [text-shadow:_4px_4px_0_rgb(0_0_0_/_0.2)]">
            Seu pet em casa,
            <br />
            mesmo longe de casa.
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto font-bold [text-shadow:_2px_2px_0_rgb(0_0_0_/_0.8)]">
            Hospedagem domiciliar com amor, segurança e fotos todo dia.
          </p>
          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Qual cidade?"
              className="bg-white/90 text-black placeholder:text-gray-600 w-full sm:flex-1 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg w-full sm:w-auto py-6">
              <Search className="mr-2 h-5 w-5" />
              Encontrar um Anfitrião
            </Button>
          </form>
        </div>
      </section>

      {/* Trust Section */}
      <section id="seguranca" className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold font-headline text-center mb-12 text-secondary-foreground">Tranquilidade em primeiro lugar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <Card className="bg-card">
                      <CardHeader className="items-center">
                          <div className="p-4 bg-primary rounded-lg border-2 border-black inline-block shadow-neo">
                              <ShieldCheck className="h-10 w-10 text-primary-foreground" />
                          </div>
                      </CardHeader>
                      <CardContent>
                          <CardTitle className="text-xl font-headline">Identidade Verificada</CardTitle>
                          <p className="font-medium mt-2">Todo cuidador passa por uma checagem de identidade para garantir um ambiente seguro.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader className="items-center">
                          <div className="p-4 bg-primary rounded-lg border-2 border-black inline-block shadow-neo">
                            <Heart className="h-10 w-10 text-primary-foreground" />
                          </div>
                      </CardHeader>
                      <CardContent>
                          <CardTitle className="text-xl font-headline">Garantia Veterinária</CardTitle>
                          <p className="font-medium mt-2">Oferecemos cobertura para despesas veterinárias emergenciais durante a estadia.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader className="items-center">
                         <div className="p-4 bg-primary rounded-lg border-2 border-black inline-block shadow-neo">
                            <Camera className="h-10 w-10 text-primary-foreground" />
                          </div>
                      </CardHeader>
                      <CardContent>
                          <CardTitle className="text-xl font-headline">Atualizações Diárias</CardTitle>
                          <p className="font-medium mt-2">Receba fotos e vídeos do seu pet todos os dias para matar a saudade e acompanhar a diversão.</p>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>
      
      {/* How it works Section */}
      <section id="como-funciona" className="py-16 bg-background">
          <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold font-headline text-center mb-12">Como funciona?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <Card className="bg-card">
                      <CardHeader>
                          <div className="mx-auto bg-primary p-4 rounded-lg border-2 border-black inline-block shadow-neo">
                              <p className='font-headline text-2xl text-primary-foreground'>1</p>
                          </div>
                          <CardTitle className='font-headline pt-2'>Busque</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="font-medium mt-2">Encontre cuidadores perto de você e veja perfis detalhados com fotos e avaliações.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader>
                           <div className="mx-auto bg-primary p-4 rounded-lg border-2 border-black inline-block shadow-neo">
                              <p className='font-headline text-2xl text-primary-foreground'>2</p>
                          </div>
                           <CardTitle className='font-headline pt-2'>Converse</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="font-medium mt-2">Converse com o anfitrião pelo chat, tire suas dúvidas e combine os detalhes da estadia.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader>
                         <div className="mx-auto bg-primary p-4 rounded-lg border-2 border-black inline-block shadow-neo">
                              <p className='font-headline text-2xl text-primary-foreground'>3</p>
                          </div>
                          <CardTitle className='font-headline pt-2'>Relaxe</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="font-medium mt-2">Faça a reserva e viaje tranquilo, sabendo que seu pet está em boas mãos e se divertindo.</p>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>

      {/* Become a host Section */}
      <section id="quero-ser-cuidador" className="py-16 bg-accent border-y-2 border-black">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-accent-foreground max-w-2xl mx-auto">Tem espaço sobrando e ama bichos? Vire um Anfitrião PetHub.</h2>
              <p className="mt-4 text-lg text-accent-foreground font-medium max-w-xl mx-auto">Faça parte da nossa comunidade, defina suas próprias regras e gere uma renda extra cuidando de pets.</p>
              <div className="mt-8">
                  <Link href="/quero-cuidar">
                    <Button size="lg" variant="secondary">Quero ser um anfitrião</Button>
                  </Link>
              </div>
          </div>
      </section>
    </>
  );
}
