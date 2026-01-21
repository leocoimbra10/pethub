"use client";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Paths where the back button should NOT be displayed
  const hiddenPaths = ['/', '/login', '/register', '/dashboard'];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black font-bold hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
    </div>
  );
}
