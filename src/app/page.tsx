import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Camera, Star, HeartPulse, ShieldCheck } from 'lucide-react';
import HostCard from '@/components/HostCard';
import { listings, users } from '@/lib/placeholder-data';
import type { Listing, User } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const featuredListings = listings.slice(0, 4);

  const testimonials = [
    {
      name: 'Mariana P.',
      role: 'Tutora do Paçoca',
      avatar: 'https://picsum.photos/seed/test1/100/100',
      avatarHint: 'person happy',
      fallback: 'M',
      text: '"Deixei meu dog com a Ana e foi incrível! Recebi fotos todos os dias e ele parecia super feliz. Recomendo muito!"'
    },
    {
      name: 'João V.',
      role: 'Tutor da Mel',
      avatar: 'https://picsum.photos/seed/test2/100/100',
      avatarHint: 'person outside',
      fallback: 'J',
      text: '"Primeira vez usando e amei. O Bruno foi super atencioso com minha gatinha idosa. O ambiente era super calmo."'
    },
    {
      name: 'Lúcia R.',
      role: 'Tutora do Thor',
      avatar: 'https://picsum.photos/seed/test3/100/100',
      avatarHint: 'woman smiling',
      fallback: 'L',
      text: '"A Carla tem uma piscina pra cachorro!!! Meu golden retriever nunca foi tão feliz. Serviço 5 estrelas, com certeza!"'
    }
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <section 
          className="relative text-center py-12 md:py-20 rounded-xl border-2 border-black shadow-[8px_8px_0px_#000] bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
          <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tight text-white [text-shadow:_4px_4px_0_rgb(0_0_0_/_1)]">
              Pode ir tranquilo. O PetHub fica.
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white font-bold [text-shadow:_2px_2px_0_rgb(0_0_0_/_0.8)]">
              Quem fica quando você não pode. Conectamos tutores a cuidadores confiáveis. Sem improviso.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto">
              <Button className="w-full max-w-sm bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                  Encontrar alguém
              </Button>
              <div className="flex items-center gap-2 text-white w-full max-w-sm">
                  <div className="flex-grow border-t-2 border-white/50"></div>
                  <span className="text-sm font-bold">OU</span>
                  <div className="flex-grow border-t-2 border-white/50"></div>
              </div>
              <form className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-sm">
                  <Input
                    type="text"
                    placeholder="Digite a cidade..."
                    className="w-full bg-card"
                  />
                  <Link href="/search" className="w-full sm:w-auto">
                      <Button type="submit" className="w-full bg-primary" size="lg">
                          <Search className="h-5 w-5" />
                      </Button>
                  </Link>
              </form>
            </div>
          </div>
        </section>
      </div>

      <section id="como-funciona" className="py-16 bg-background">
          <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold font-headline text-center mb-12">Como funciona?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <Card className="bg-card">
                      <CardHeader>
                          <div className="mx-auto bg-primary p-4 rounded-lg border-2 border-black inline-block shadow-neo">
                              <Badge variant="secondary" className='text-xl'>1</Badge>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <h3 className="text-2xl font-bold font-headline">Zero Improviso</h3>
                          <p className="font-medium mt-2">Aqui, alguém assume a responsabilidade.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader>
                          <div className="mx-auto bg-accent p-4 rounded-lg border-2 border-black inline-block shadow-neo">
                              <Badge variant="secondary" className='text-xl'>2</Badge>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <h3 className="text-2xl font-bold font-headline">Segurança Total</h3>
                          <p className="font-medium mt-2">Pessoas avaliadas para cuidar de quem importa.</p>
                      </CardContent>
                  </Card>
                  <Card className="bg-card">
                      <CardHeader>
                         <div className="mx-auto bg-secondary p-4 rounded-lg border-2 border-black inline-block shadow-neo">
                              <Badge variant="secondary" className='text-xl'>3</Badge>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <h3 className="text-2xl font-bold font-headline">Você vai, a gente fica</h3>
                          <p className="font-medium mt-2">Seu pet bem cuidado, mesmo quando você não está.</p>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground border-y-2 border-black">
          <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold font-headline text-center mb-12">Por que escolher a PetHub?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="flex flex-col items-center">
                      <HeartPulse className="h-16 w-16 mb-4" />
                      <h3 className="text-2xl font-bold font-headline">Garantia Veterinária</h3>
                      <p className="font-medium mt-2 max-w-xs">Cobertura para emergências durante a estadia. A segurança do seu pet em primeiro lugar.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <ShieldCheck className="h-16 w-16 mb-4" />
                      <h3 className="text-2xl font-bold font-headline">Cuidadores Verificados</h3>
                      <p className="font-medium mt-2 max-w-xs">Todos os nossos cuidadores passam por um processo de verificação de identidade.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <Camera className="h-16 w-16 mb-4" />
                      <h3 className="text-2xl font-bold font-headline">Fotos Diárias</h3>
                      <p className="font-medium mt-2 max-w-xs">Receba fotos e vídeos do seu melhor amigo todos os dias para matar a saudade.</p>
                  </div>
              </div>
          </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-headline text-center">Cuidadores em Destaque</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredListings.map((listing: Listing) => {
              const host = users.find((user: User) => user.uid === listing.hostId);
              if (!host) return null;
              return <HostCard key={listing.id} listing={listing} host={host} />;
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/search">
              <Button variant="secondary" size="lg">Ver todos os cuidadores</Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold font-headline text-center mb-12">O que os tutores dizem</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                      <Card key={index}>
                          <CardContent className="pt-6">
                              <div className="flex mb-2">
                                  {[...Array(5)].map((_, i) => (
                                      <Star key={i} className="text-secondary fill-secondary" />
                                  ))}
                              </div>
                              <p className="font-medium italic">{testimonial.text}</p>
                              <div className="flex items-center gap-4 mt-4">
                                  <Avatar className="h-12 w-12 border-2 border-black">
                                      <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.avatarHint} />
                                      <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-bold">{testimonial.name}</p>
                                      <p className="text-sm font-medium">{testimonial.role}</p>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      </section>

      <section id="quero-ser-cuidador" className="py-16 bg-secondary border-y-2 border-black">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-black max-w-2xl mx-auto">Ama animais? Gere renda cuidando deles.</h2>
              <p className="mt-4 text-lg text-black font-medium max-w-xl mx-auto">Faça parte da nossa comunidade de cuidadores e ofereça um espaço seguro para pets.</p>
              <div className="mt-8">
                  <Link href="/register">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Quero cuidar</Button>
                  </Link>
              </div>
          </div>
      </section>
    </>
  );
}
