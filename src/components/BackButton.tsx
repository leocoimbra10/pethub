"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Voltar" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-black font-bold mb-6 hover:translate-x-[-4px] transition-transform"
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
}
