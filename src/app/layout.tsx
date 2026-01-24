import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- Importe aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PetHub - Viaje sem Culpa",
  description: "O Airbnb para pets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar /> {/* <--- Adicione aqui no topo */}
        <div className="pt-20"> {/* Padding top para o conteúdo não ficar escondido atrás da navbar fixa */}
          {children}
        </div>
      </body>
    </html>
  );
}