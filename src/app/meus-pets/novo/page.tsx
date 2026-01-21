'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, firestore } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader } from 'lucide-react';

export default function NovoPetPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [observacoes, setObservacoes] = useState('');
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

  const handleSavePet = async () => {
    if (!nome || !tipo) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o nome e o tipo do seu pet.',
      });
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(collection(firestore, 'pets'), {
        ownerId: user.uid,
        nome,
        tipo,
        raca,
        idade: Number(idade) || null,
        observacoes,
        createdAt: new Date(),
      });
      toast({
        title: 'Pet salvo!',
        description: `${nome} foi adicionado à sua lista.`,
      });
      router.push('/meus-pets');
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar seu pet. Tente novamente.',
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Adicionar Novo Pet</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para cadastrar um novo companheiro.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className='font-bold'>Nome do Pet</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Paçoca"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="tipo" className='font-bold'>Tipo</Label>
                    <Select onValueChange={setTipo} value={tipo}>
                        <SelectTrigger id="tipo">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cachorro">Cachorro</SelectItem>
                            <SelectItem value="Gato">Gato</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="idade" className='font-bold'>Idade (anos)</Label>
                    <Input
                        id="idade"
                        type="number"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                        placeholder="Ex: 2"
                    />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="raca" className='font-bold'>Raça</Label>
              <Input
                id="raca"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                placeholder="Ex: Vira-lata, Siamês"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacoes" className='font-bold'>Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alergias, remédios, comportamento, etc."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePet} disabled={isSaving}>
              {isSaving ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar Pet'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
