import Link from "next/link";
import { Home as HomeIcon, TreePalm, Shield } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* --- Banner Hero Impactante --- */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24 md:py-32 px-6 text-center overflow-hidden">
        {/* Efeito de fundo sutil */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>

        <div className="container mx-auto relative z-10">
          {/* Título Gigante */}
          <h1 className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tight leading-tight drop-shadow-lg font-headline">
            O melhor amigo do <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              seu melhor amigo.
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow font-medium font-body">
            Hospedagem familiar, passeios divertidos e muito amor. <br className="hidden md:block" />
            Conecte-se com cuidadores de confiança perto de você.
          </p>

          {/* Botões de Ação Estilizados */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/search"
              className="w-full sm:w-auto px-10 py-5 bg-white text-blue-900 font-extrabold rounded-full text-xl shadow-2xl hover:bg-yellow-50 hover:scale-105 transition-all transform font-headline"
            >
              🔍 Encontrar um Cuidador
            </Link>
            <Link
              href="/quero-cuidar"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border-4 border-white text-white font-extrabold rounded-full text-xl hover:bg-white hover:text-blue-900 transition-all font-headline"
            >
              💙 Quero ser Cuidador
            </Link>
          </div>
        </div>
        
        {/* Onda de Transição no rodapé do banner */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
           <svg viewBox="0 0 1440 320" className="relative block w-full h-[100px] md:h-[150px] text-gray-50 fill-current" preserveAspectRatio="none">
              <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* --- Seção de Vantagens (Cards Modernos) --- */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
           <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16 font-headline">Por que escolher o PetHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-3 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-3 bg-blue-500 group-hover:h-full transition-all duration-700 opacity-5"></div>
              <div className="text-blue-500 mb-8 bg-blue-100 w-28 h-28 flex items-center justify-center rounded-full mx-auto shadow-sm relative z-10 group-hover:scale-110 transition-transform">
                <HomeIcon className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-4 text-center relative z-10 font-headline">Lar Longe de Casa</h3>
              <p className="text-gray-600 text-center leading-relaxed text-lg relative z-10 font-body">Hospedagem em ambiente familiar, sem gaiolas, com a rotina e o conforto que seu pet merece.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-3 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-3 bg-green-500 group-hover:h-full transition-all duration-700 opacity-5"></div>
              <div className="text-green-500 mb-8 bg-green-100 w-28 h-28 flex items-center justify-center rounded-full mx-auto shadow-sm relative z-10 group-hover:scale-110 transition-transform">
                <TreePalm className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-4 text-center relative z-10 font-headline">Diversão Garantida</h3>
              <p className="text-gray-600 text-center leading-relaxed text-lg relative z-10 font-body">Passeios e brincadeiras supervisionadas para gastar energia e manter a saúde do seu amigo em dia.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-3 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-3 bg-purple-500 group-hover:h-full transition-all duration-700 opacity-5"></div>
              <div className="text-purple-500 mb-8 bg-purple-100 w-28 h-28 flex items-center justify-center rounded-full mx-auto shadow-sm relative z-10 group-hover:scale-110 transition-transform">
                <Shield className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-4 text-center relative z-10 font-headline">Total Segurança</h3>
              <p className="text-gray-600 text-center leading-relaxed text-lg relative z-10 font-body">Cuidadores verificados, atualizações com fotos e suporte dedicado para sua tranquilidade.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
