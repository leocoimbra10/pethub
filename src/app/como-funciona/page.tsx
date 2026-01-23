"use client";

import Link from 'next/link';

export default function ComoFuncionaPage() {
  return (
    <div className="bg-white text-black font-sans">
      <div className="container mx-auto max-w-5xl py-20 px-6">
        {/* Cabeçalho da Página */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
            Como Funciona
          </h1>
          <p className="text-xl font-bold text-gray-600 mt-4 max-w-2xl mx-auto">
            Sua tranquilidade é nossa prioridade. Simples, seguro e feito para quem ama pets.
          </p>
        </div>

        {/* Grade de Passos */}
        <div className="space-y-16">

          {/* Passo 1: Encontre */}
          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="text-9xl font-black text-gray-100 select-none">01</div>
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_#000] bg-white flex-1">
              <h2 className="text-4xl font-black uppercase mb-4">Encontre o Anfitrião Perfeito</h2>
              <p className="text-lg font-medium text-gray-700 leading-relaxed">
                Use nossa busca avançada para encontrar cuidadores por <strong>Estado, Cidade e até Bairro</strong>. Leia as avaliações, veja as fotos dos lares e escolha o ambiente ideal. Todos os anfitriões passam por um processo de verificação para garantir sua segurança.
              </p>
            </div>
          </div>

          {/* Passo 2: Conecte-se */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 text-center md:text-right">
             <div className="text-9xl font-black text-gray-100 select-none">02</div>
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_#000] bg-white flex-1">
              <h2 className="text-4xl font-black uppercase mb-4">Conecte-se com Segurança</h2>
              <p className="text-lg font-medium text-gray-700 leading-relaxed">
                Inicie uma conversa diretamente pela nossa plataforma segura. Tire todas as suas dúvidas sobre o espaço, a rotina e a experiência do cuidador antes de tomar uma decisão.
              </p>
            </div>
          </div>

          {/* Passo 3: Relaxe */}
           <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="text-9xl font-black text-gray-100 select-none">03</div>
            <div className="border-4 border-black p-8 shadow-[8px_8px_0px_#000] bg-white flex-1">
              <h2 className="text-4xl font-black uppercase mb-4">Hospede e Relaxe</h2>
              <p className="text-lg font-medium text-gray-700 leading-relaxed">
                Após combinar os detalhes, é só levar seu pet. Receba atualizações com fotos durante a estadia e conte com nosso <strong>suporte 24/7</strong> para qualquer eventualidade. Seu melhor amigo em boas mãos, você em paz.
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Call to Action (CTA) */}
        <div className="mt-24 text-center border-t-8 border-black pt-16">
            <h2 className="text-5xl font-black uppercase mb-8">Pronto para começar?</h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
                 <Link href="/search" className="bg-primary text-primary-foreground px-10 py-5 rounded-lg border-4 border-black font-black text-2xl shadow-[8px_8px_0px_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                    Encontrar um Cuidador
                </Link>
                <Link href="/quero-cuidar" className="bg-secondary text-secondary-foreground px-10 py-5 rounded-lg border-4 border-black font-black text-2xl shadow-[8px_8px_0px_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                    Quero ser Cuidador
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}