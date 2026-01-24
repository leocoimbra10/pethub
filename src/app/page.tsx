import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import { 
  ShieldCheck, UserCheck, CreditCard, 
  Home, Sun, HeartHandshake, Footprints, 
  Search, MessageCircle, Camera, Smartphone, Apple, Play 
} from "lucide-react";

export default function Home() {
  
  const services = [
    {
      title: "Hospedagem",
      desc: "Seu pet dorme na casa de um anfitrião amoroso. Nada de gaiolas!",
      icon: <Home size={24} />,
      img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=2594&auto=format&fit=crop"
    },
    {
      title: "Creche / Day Care",
      desc: "Ele passa o dia brincando e gastando energia enquanto você trabalha.",
      icon: <Sun size={24} />,
      img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "Pet Sitter",
      desc: "Um herói vai até sua casa cuidar, dar comida e carinho.",
      icon: <HeartHandshake size={24} />,
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop"
    },
    {
      title: "Passeios",
      desc: "Caminhadas de 30 ou 60 min para manter a saúde em dia.",
      icon: <Footprints size={24} />,
      img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2670&auto=format&fit=crop"
    }
  ];

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      
      {/* 1. HERO SECTION (Mantida) */}
      <section className="relative bg-yellow-400 pb-40 pt-16 border-b-[6px] border-black">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 z-10">
               <div className="inline-block bg-black text-white px-4 py-2 font-black text-sm uppercase -rotate-2 transform shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                  🚀 O #1 do Brasil
               </div>
               <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter">
                  Quem ama <br/> <span className="text-white text-stroke-black">Cuida.</span>
               </h1>
               <p className="text-xl font-bold max-w-md leading-relaxed">
                  Encontre heróis locais para Hospedagem, Creche e Passeios. Seu pet em família, sempre.
               </p>
            </div>

            {/* Imagem Hero */}
            <div className="relative h-[400px] md:h-[500px] hidden md:block">
               <img 
                 src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2583&auto=format&fit=crop" 
                 alt="Cachorro feliz"
                 className="w-full h-full object-cover rounded-[40px] border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(255,255,255,0.5)] rotate-2 hover:rotate-0 transition-all duration-500"
               />
            </div>
         </div>
      </section>

      {/* 2. COMPONENTE DE BUSCA (Sobreposto) */}
      <div className="px-4 relative z-20">
         <HeroSearch />
      </div>

      {/* 3. SEÇÃO DE CONFIANÇA (Amarela) */}
      <section className="bg-white py-20 mt-10">
         <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black uppercase italic mb-4">Segurança em primeiro lugar</h2>
               <p className="text-gray-500 font-bold max-w-2xl mx-auto">Nós levamos a sério a segurança do seu melhor amigo. Por isso, criamos um padrão ouro de qualidade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-yellow-100 p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all">
                  <div className="bg-black text-white w-16 h-16 flex items-center justify-center rounded-full mb-6 border-4 border-white shadow-md">
                     <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2">Garantia Veterinária</h3>
                  <p className="font-bold text-sm text-gray-600">Se acontecer qualquer emergência durante a estadia, cobrimos despesas veterinárias de até R$ 5.000.</p>
               </div>
               
               <div className="bg-blue-100 p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all">
                  <div className="bg-black text-white w-16 h-16 flex items-center justify-center rounded-full mb-6 border-4 border-white shadow-md">
                     <UserCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2">Heróis Verificados</h3>
                  <p className="font-bold text-sm text-gray-600">Apenas 15% dos candidatos são aprovados. Checamos antecedentes, documentos e fazemos testes.</p>
               </div>

               <div className="bg-green-100 p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all">
                  <div className="bg-black text-white w-16 h-16 flex items-center justify-center rounded-full mb-6 border-4 border-white shadow-md">
                     <CreditCard size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2">Pagamento Seguro</h3>
                  <p className="font-bold text-sm text-gray-600">Seu dinheiro fica protegido com a gente e só é repassado ao anfitrião após o fim do serviço.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. VITRINE DE SERVIÇOS */}
      <section className="bg-gray-50 py-24 border-y-[6px] border-black">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-12 text-center">Praticidade pra você.<br/>Diversão pro seu pet.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {services.map((service, idx) => (
                  <div key={idx} className="bg-white border-4 border-black group cursor-pointer hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                     <div className="h-48 overflow-hidden border-b-4 border-black relative">
                        <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute -bottom-5 right-4 bg-purple-600 text-white p-3 rounded-full border-4 border-white shadow-sm group-hover:bg-black group-hover:scale-110 transition-all">
                           {service.icon}
                        </div>
                     </div>
                     <div className="p-6 pt-8">
                        <h3 className="text-xl font-black uppercase mb-2 group-hover:text-purple-600 transition-colors">{service.title}</h3>
                        <p className="text-sm font-bold text-gray-500 leading-relaxed">{service.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. COMO FUNCIONA (DARK MODE) */}
      <section className="bg-black text-white py-24">
         <div className="max-w-6xl mx-auto px-6">
             <h2 className="text-4xl font-black uppercase italic mb-16 text-center text-yellow-400">Como funciona o PetHub</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Linha conectora (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-800 -z-0"></div>

                {/* Passo 1 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-black border-4 border-white rounded-full flex items-center justify-center text-4xl font-black mb-6 hover:bg-yellow-400 hover:text-black hover:border-black transition-colors cursor-default">
                      1
                   </div>
                   <h3 className="text-2xl font-black uppercase mb-2"><Search className="inline mr-2 mb-1"/>Busque</h3>
                   <p className="text-gray-400 font-bold">Use nossos filtros inteligentes para encontrar o anfitrião perfeito perto de você.</p>
                </div>

                {/* Passo 2 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-black border-4 border-white rounded-full flex items-center justify-center text-4xl font-black mb-6 hover:bg-yellow-400 hover:text-black hover:border-black transition-colors cursor-default">
                      2
                   </div>
                   <h3 className="text-2xl font-black uppercase mb-2"><MessageCircle className="inline mr-2 mb-1"/>Conheça</h3>
                   <p className="text-gray-400 font-bold">Converse pelo chat e agende um pré-encontro gratuito para ver se rola química.</p>
                </div>

                {/* Passo 3 */}
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-black border-4 border-white rounded-full flex items-center justify-center text-4xl font-black mb-6 hover:bg-yellow-400 hover:text-black hover:border-black transition-colors cursor-default">
                      3
                   </div>
                   <h3 className="text-2xl font-black uppercase mb-2"><Camera className="inline mr-2 mb-1"/>Relaxe</h3>
                   <p className="text-gray-400 font-bold">Viaje tranquilo! Você receberá fotos e vídeos diários do seu pet se divertindo.</p>
                </div>
             </div>
         </div>
      </section>

      {/* 6. APP BANNER */}
      <section className="bg-purple-600 py-20 border-t-[6px] border-black overflow-hidden relative">
         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-white space-y-6 md:w-1/2">
               <h2 className="text-5xl font-black uppercase italic leading-none">
                  O PetHub cabe <br/> no seu bolso.
               </h2>
               <p className="font-bold text-lg opacity-90">
                  Baixe nosso app para reservar, pagar e receber fotinhas de onde estiver. Disponível para iOS e Android.
               </p>
               <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white border-2 border-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                     <Apple size={24} />
                     <div className="text-left leading-none">
                        <span className="block text-[10px] uppercase font-bold">Baixar na</span>
                        <span className="block font-black text-lg">App Store</span>
                     </div>
                  </button>
                  <button className="bg-black text-white border-2 border-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                     <Play size={24} />
                     <div className="text-left leading-none">
                        <span className="block text-[10px] uppercase font-bold">Disponível no</span>
                        <span className="block font-black text-lg">Google Play</span>
                     </div>
                  </button>
               </div>
            </div>
            
            {/* Mockup Celular (CSS Pure) */}
            <div className="md:w-1/2 flex justify-center">
               <div className="w-64 h-[500px] bg-black rounded-[3rem] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)] relative overflow-hidden bg-white rotate-6 hover:rotate-0 transition-all duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-80"></div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg border-2 border-black text-center w-48">
                     <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 border-2 border-black flex items-center justify-center text-white"><ShieldCheck/></div>
                     <p className="font-black text-sm uppercase">Reserva Confirmada!</p>
                     <p className="text-xs">Tia Juju está te esperando.</p>
                  </div>
               </div>
            </div>
         </div>
         
         {/* Background Patterns */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </section>

      {/* 7. MÍDIA (Social Proof) */}
      <section className="py-16 bg-white text-center">
         <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Eles falam da gente</p>
         <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-3xl font-black font-serif">EXAME</span>
             <span className="text-3xl font-black italic">VEJA</span>
             <span className="text-3xl font-black font-serif tracking-tighter">ESTADÃO</span>
             <span className="text-3xl font-black font-sans bg-black text-white px-2">UOL</span>
             <span className="text-3xl font-black font-serif">Forbes</span>
         </div>
      </section>

      {/* FOOTER SIMPLES */}
      <footer className="bg-black text-white py-12 border-t-[8px] border-yellow-400">
         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-black uppercase tracking-tighter">PetHub</div>
            <div className="flex gap-6 text-sm font-bold text-gray-400">
               <a href="#" className="hover:text-white">Sobre</a>
               <a href="#" className="hover:text-white">Segurança</a>
               <a href="#" className="hover:text-white">Sou Anfitrião</a>
               <a href="#" className="hover:text-white">Blog</a>
            </div>
            <div className="text-xs font-bold text-gray-600">
               © 2024 PetHub Inc. Feito com amor e Next.js
            </div>
         </div>
      </footer>

    </main>
  );
}