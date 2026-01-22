"use client";
import { useEffect, useRef } from "react";
import { Camera } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    
    // CONFIGURAÇÃO COM VARIÁVEIS DE AMBIENTE
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      sources: ['local', 'camera', 'url'], // De onde vem a foto
      multiple: false,
      folder: 'users_avatars',
      language: "pt",
      text: {
        "pt": {
          "or": "Ou",
          "menu": { "files": "Meus Arquivos" },
          "local": { "browse": "Escolher arquivo" }
        }
      },
      styles: {
        palette: {
          window: "#FFFFFF",
          windowBorder: "#000000",
          tabIcon: "#000000",
          menuIcons: "#000000",
          textDark: "#000000",
          textLight: "#FFFFFF",
          link: "#8B5CF6",
          action: "#8B5CF6",
          inactiveTabIcon: "#555555",
          error: "#F44235",
          inProgress: "#0078FF",
          complete: "#20B832",
          sourceBg: "#F4F4F5"
        }
      }
    }, function(error: any, result: any) {
      if (!error && result && result.event === "success") {
        console.log("Upload com sucesso:", result.info.secure_url);
        onUpload(result.info.secure_url);
      }
    });
  }, [onUpload]);

  return (
    <div className="flex flex-col items-center">
      <div 
        onClick={() => widgetRef.current.open()}
        className="relative group cursor-pointer w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gray-100 shadow-lg hover:scale-105 transition-transform"
      >
        {currentImage ? (
          <img src={currentImage} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <Camera className="w-10 h-10" />
          </div>
        )}
        
        {/* Overlay Escuro ao passar o mouse */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white font-bold text-xs">ALTERAR</p>
        </div>
      </div>
      <p className="text-xs font-bold text-gray-500 mt-2 cursor-pointer hover:underline" onClick={() => widgetRef.current.open()}>
        Toque para mudar a foto
      </p>
    </div>
  );
}
