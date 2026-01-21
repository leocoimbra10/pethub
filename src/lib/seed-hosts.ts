'use client';

import { collection, addDoc, Firestore } from 'firebase/firestore';

const hostsData = [
  {
    nome: 'Tia Juju',
    foto: 'https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=1080&auto=format&fit=crop',
    preco: 150,
    cidade: 'São Paulo',
    avaliacao: 4.9,
    descricao: 'Amor e carinho de sobra para seu pet. Quintal grande e seguro.'
  },
  {
    nome: 'Cantinho do Bob',
    foto: 'https://images.unsplash.com/photo-1594283255808-ee728c775ba6?q=80&w=1080&auto=format&fit=crop',
    preco: 120,
    cidade: 'Rio de Janeiro',
    avaliacao: 4.8,
    descricao: 'Ambiente familiar e tranquilo. Passeios diários na praia.'
  },
  {
    nome: 'Gato Feliz',
    foto: 'https://images.unsplash.com/photo-1668656379942-920e753667b3?q=80&w=1080&auto=format&fit=crop',
    preco: 130,
    cidade: 'Curitiba',
    avaliacao: 5.0,
    descricao: 'Especialista em gatos. Um paraíso de arranhadores e brinquedos.'
  },
  {
    nome: 'Dog Aventuras',
    foto: 'https://images.unsplash.com/photo-1535890696255-dd5bcd79e6df?q=80&w=1080&auto=format&fit=crop',
    preco: 180,
    cidade: 'Belo Horizonte',
    avaliacao: 4.7,
    descricao: 'Para cães cheios de energia! Trilhas e muita diversão.'
  },
  {
    nome: 'Lar Doce Pet',
    foto: 'https://images.unsplash.com/photo-1689343074357-0c724bdd93ec?q=80&w=1080&auto=format&fit=crop',
    preco: 145,
    cidade: 'Porto Alegre',
    avaliacao: 4.9,
    descricao: 'Seu pet como parte da nossa família. Conforto e segurança.'
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
