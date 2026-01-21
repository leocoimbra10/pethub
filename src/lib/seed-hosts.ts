'use client';

import { collection, addDoc, Firestore } from 'firebase/firestore';

const hostsData = [
  {
    nome: 'Tia Juju',
    photo: 'https://images.unsplash.com/photo-1548532928-574c3774576e?q=80&w=1080&auto=format&fit=crop',
    preco: 135,
    cidade: 'São Paulo',
    avaliacao: 4.9,
    descricao: 'Amor e carinho de sobra para seu pet. Quintal grande e seguro para cães e gatos.',
    houseImages: [
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1588879342410-53c895b87b76?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Carlos Alberto',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1080&auto=format&fit=crop',
    preco: 120,
    cidade: 'Rio de Janeiro',
    avaliacao: 4.8,
    descricao: 'Ambiente familiar e tranquilo. Sou apaixonado por animais e ofereço passeios diários na praia.',
    houseImages: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Ana Silva',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1080&auto=format&fit=crop',
    preco: 140,
    cidade: 'São Paulo',
    avaliacao: 5.0,
    descricao: 'Especialista em gatos. Um paraíso de arranhadores e brinquedos, totalmente seguro e telado.',
    houseImages: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-7b7a67e63b60?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596203063545-728b14f8a37b?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Beto "Dog Walker"',
    photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1080&auto=format&fit=crop',
    preco: 90,
    cidade: 'Rio de Janeiro',
    avaliacao: 4.7,
    descricao: 'Para cães cheios de energia! Muitas trilhas, passeios e diversão em grupo.',
    houseImages: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567684015213-d48f7f74c7d0?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Lar Doce Pet da Sônia',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1080&auto=format&fit=crop',
    preco: 115,
    cidade: 'São Paulo',
    avaliacao: 4.9,
    descricao: 'Seu pet como parte da nossa família. Conforto, segurança e muito carinho para eles.',
    houseImages: [
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1588854337236-6889d631f1ac?q=80&w=1080&auto=format&fit=crop'
    ]
  }
];

export async function seedHosts(firestore: Firestore) {
  const hostsCollection = collection(firestore, 'hosts');
  try {
    const promises = hostsData.map(host => addDoc(hostsCollection, host));
    await Promise.all(promises);
    console.log('Hosts seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding hosts: ', error);
    throw error;
  }
}
