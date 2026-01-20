import Link from 'next/link';
import { PawPrint, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-card border-t-2 border-black mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl font-headline">Airbnbicho</span>
            </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Plataforma</h3>
            <ul className="space-y-2 font-bold">
              <li><Link href="/search" className="hover:text-primary transition-colors">Buscar Anfitriões</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Seja um Anfitrião</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Minhas Reservas</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Suporte</h3>
            <ul className="space-y-2 font-bold">
              <li><Link href="#" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Termos de Serviço</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
          <div className="md:text-right">
             <h3 className="font-headline font-bold text-lg mb-4">Siga-nos</h3>
             <div className="flex justify-center md:justify-end gap-4">
              <Link href="#" aria-label="Instagram">
                <Button size="icon" variant="outline">
                    <Instagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="Facebook">
                <Button size="icon" variant="outline">
                    <Facebook className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="Twitter">
                <Button size="icon" variant="outline">
                    <Twitter className="h-5 w-5" />
                </Button>
              </Link>
             </div>
          </div>
        </div>
        <div className="border-t-2 border-black mt-8 pt-6 text-center text-sm font-bold">
            <p>© {new Date().getFullYear()} Airbnbicho. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
