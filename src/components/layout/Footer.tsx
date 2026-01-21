import Link from 'next/link';
import { PawPrint, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className='md:col-span-1'>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl font-headline">PetHub</span>
            </Link>
            <p className='text-sm text-gray-400'>Seu pet em casa, mesmo longe de casa.</p>
          </div>
          <div className="grid grid-cols-2 md:col-span-2 gap-8">
            <div>
              <h3 className="font-headline font-bold text-lg mb-4">Plataforma</h3>
              <ul className="space-y-2 font-medium text-gray-300">
                <li><Link href="/search" className="hover:text-primary transition-colors">Encontrar Cuidadores</Link></li>
                <li><Link href="/quero-cuidar" className="hover:text-primary transition-colors">Seja um Cuidador</Link></li>
                <li><Link href="/#como-funciona" className="hover:text-primary transition-colors">Como Funciona</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2 font-medium text-gray-300">
                <li><Link href="#" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Termos de Serviço</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} PetHub. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
              </Link>
             </div>
        </div>
      </div>
    </footer>
  );
}
