import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalBackButton from '@/components/GlobalBackButton';

export const metadata: Metadata = {
  title: 'PetHub | Cuidadores de Confiança para seu Pet',
  description: 'Conectamos tutores a cuidadores confiáveis. Sem improviso.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Nunito:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <GlobalBackButton />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
