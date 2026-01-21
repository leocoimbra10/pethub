'use client';

import { collection, addDoc, Firestore } from 'firebase/firestore';

const hostsData = [
  {
    nome: 'Tia Juju',
    foto: 'https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=1080&auto=format&fit=crop',
    preco: 150,
    cidade: 'São Paulo',
    avaliacao: 4.9,
    descricao: 'Amor e carinho de sobra para seu pet. Quintal grande e seguro.',
    houseImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542882583-363e8a0ef245?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615875605825-5eb9bb5fea22?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Cantinho do Bob',
    foto: 'https://images.unsplash.com/photo-1594283255808-ee728c775ba6?q=80&w=1080&auto=format&fit=crop',
    preco: 120,
    cidade: 'Rio de Janeiro',
    avaliacao: 4.8,
    descricao: 'Ambiente familiar e tranquilo. Passeios diários na praia.',
    houseImages: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Gato Feliz',
    foto: 'https://images.unsplash.com/photo-1668656379942-920e753667b3?q=80&w=1080&auto=format&fit=crop',
    preco: 130,
    cidade: 'Curitiba',
    avaliacao: 5.0,
    descricao: 'Especialista em gatos. Um paraíso de arranhadores e brinquedos.',
    houseImages: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-7b7a67e63b60?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574163277703-4e0d5a0a383a?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Dog Aventuras',
    foto: 'https://images.unsplash.com/photo-1535890696255-dd5bcd79e6df?q=80&w=1080&auto=format&fit=crop',
    preco: 180,
    cidade: 'Belo Horizonte',
    avaliacao: 4.7,
    descricao: 'Para cães cheios de energia! Trilhas e muita diversão.',
    houseImages: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567684015213-d48f7f74c7d0?q=80&w=1080&auto=format&fit=crop'
    ]
  },
  {
    nome: 'Lar Doce Pet',
    foto: 'https://images.unsplash.com/photo-1689343074357-0c724bdd93ec?q=80&w=1080&auto=format&fit=crop',
    preco: 145,
    cidade: 'Porto Alegre',
    avaliacao: 4.9,
    descricao: 'Seu pet como parte da nossa família. Conforto e segurança.',
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
    return false;
  }
}
