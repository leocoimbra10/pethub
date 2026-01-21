'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, firestore } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader, Dice5, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function QueroCuidarPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [houseImages, setHouseImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleGenerateImages = () => {
    const keywords = ['living-room', 'backyard', 'cozy-corner'];
    const newImages = keywords.map(
      (kw) => `https://picsum.photos/seed/${kw}-${Math.random()}/400/300`
    );
    setHouseImages(newImages);
    toast({
      title: 'Fotos geradas!',
      description: 'Novas imagens de exemplo foram carregadas.',
    });
  };

  const handleSaveHost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !preco || !cidade || !descricao) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos do formulário.',
      });
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(collection(firestore, 'hosts'), {
        ownerId: user.uid,
        nome,
        preco: Number(preco),
        cidade,
        descricao,
        photo: `https://picsum.photos/seed/${user.uid}/200/200`,
        houseImages: houseImages.length > 0 ? houseImages : ['https://picsum.photos/seed/default/400/300'],
        rating: 5.0,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Cadastro realizado!',
        description: 'Você agora é um anfitrião PetHub. Parabéns!',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar anfitrião:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: 'Ocorreu um erro ao salvar seu cadastro. Tente novamente.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold mb-6 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Dashboard
        </Link>
        
        <div className='text-center mb-8'>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Bora faturar com o PetHub?</h1>
            <p className="text-lg font-medium text-muted-foreground mt-2">
                Complete seu perfil para começar a receber hóspedes.
            </p>
        </div>

        <form onSubmit={handleSaveHost} className="space-y-6 bg-card border-2 border-black rounded-2xl p-6 md:p-8 shadow-neo">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-lg font-bold">Nome do seu Espaço</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Cantinho da Tia Juju"
              className="p-3 text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preco" className="text-lg font-bold">Preço por Noite (R$)</Label>
              <Input
                id="preco"
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex: 120"
                className="p-3 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-lg font-bold">Sua Cidade</Label>
              <Input
                id="cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: São Paulo"
                className="p-3 text-base"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-lg font-bold">Descreva seu espaço e amor por pets</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Fale sobre o ambiente, sua experiência, rotina de passeios, etc."
              className="p-3 text-base min-h-[120px]"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-bold">Fotos do seu Espaço</Label>
            <div className="p-4 border-2 border-dashed border-black rounded-lg text-center">
              {houseImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {houseImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-md overflow-hidden border-2 border-black shadow-neo-sm">
                      <Image src={img} alt={`Foto do espaço ${i + 1}`} fill style={{objectFit: 'cover'}} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground font-medium">Use o botão mágico para gerar fotos de exemplo!</p>
              )}
            </div>
             <Button type="button" variant="secondary" onClick={handleGenerateImages} className="w-full">
              <Dice5 className="mr-2" />
              Gerar Fotos do Espaço
            </Button>
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full bg-[#8B5CF6] hover:bg-[#7c4ee3]" disabled={isSaving}>
              {isSaving ? (
                <><Loader className="mr-2 h-5 w-5 animate-spin" /> Salvando Perfil...</>
              ) : (
                <><CheckCircle className="mr-2 h-5 w-5" /> Finalizar e Salvar Perfil</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
