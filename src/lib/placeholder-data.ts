import type { User, Listing, Booking } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const users: User[] = [
  {
    uid: 'host1',
    role: 'host',
    name: 'Ana Silva',
    photo: findImage('user1'),
    isVerified: true,
  },
  {
    uid: 'host2',
    role: 'host',
    name: 'Bruno Costa',
    photo: findImage('user2'),
    isVerified: false,
  },
  {
    uid: 'host3',
    role: 'host',
    name: 'Carla Dias',
    photo: findImage('user3'),
    isVerified: true,
  },
  {
    uid: 'host4',
    role: 'host',
    name: 'Daniel Farias',
    photo: findImage('user4'),
    isVerified: true,
  },
  {
    uid: 'tutor1',
    role: 'tutor',
    name: 'Fernanda Lima',
    photo: findImage('user5'),
    isVerified: true,
  },
];

export const listings: Listing[] = [
  {
    id: 'listing1',
    hostId: 'host1',
    title: 'Cantinho Aconchegante para seu Pet',
    description: 'Um lar cheio de amor e um quintal espaçoso para seu amigo correr e brincar. Temos experiência com cães de todos os portes e gatos.\nSeu pet será tratado como parte da família, com passeios diários, muitas brincadeiras e carinho.',
    price: 120,
    city: 'São Paulo',
    amenities: ['Quintal Grande', 'Aceita Gatos', 'Passeios Diários', 'Brinquedos Disponíveis'],
    mainImage: findImage('listing1_main'),
    gallery: [findImage('listing1_gallery1'), findImage('listing1_gallery2')],
  },
  {
    id: 'listing2',
    hostId: 'host2',
    title: 'Apartamento Pet-Friendly com Vista',
    description: 'Seu pet vai adorar a vista da nossa varanda telada! Somos um casal que ama animais e garantimos um ambiente seguro e tranquilo.\nOferecemos companhia constante e um ambiente calmo, ideal para pets mais tímidos ou idosos.',
    price: 150,
    city: 'Rio de Janeiro',
    amenities: ['Varanda Telada', 'Ambiente Calmo', 'Aceita Cães Pequenos', 'Ar Condicionado'],
    mainImage: findImage('listing2_main'),
    gallery: [findImage('listing2_gallery1'), findImage('listing2_gallery2')],
  },
  {
    id: 'listing3',
    hostId: 'host3',
    title: 'Casa com Piscina para Cães',
    description: 'Aqui a diversão é garantida! Temos uma piscina exclusiva para os doguinhos se refrescarem nos dias de calor.\nSou adestradora e posso ajudar com treinos básicos durante a estadia. A socialização com outros cães é sempre supervisionada.',
    price: 180,
    city: 'Belo Horizonte',
    amenities: ['Piscina para Cães', 'Adestradora no Local', 'Socialização Supervisionada', 'Quintal Espaçoso'],
    mainImage: findImage('listing3_main'),
    gallery: [findImage('listing3_gallery1'), findImage('listing3_gallery2')],
  },
  {
    id: 'listing4',
    hostId: 'host4',
    title: 'Refúgio Tranquilo para Gatos',
    description: 'Um paraíso para felinos! Nossa casa é 100% telada e cheia de arranhadores, tocas e brinquedos para entreter seu gatinho.\nNão hospedamos cães, garantindo um ambiente livre de estresse para os gatos mais sensíveis. Experiência com dietas especiais.',
    price: 130,
    city: 'Curitiba',
    amenities: ['Exclusivo para Gatos', 'Casa Telada', 'Arranhadores e Tocas', 'Dieta Especial'],
    mainImage: findImage('listing4_main'),
    gallery: [findImage('listing4_gallery1'), findImage('listing4_gallery2')],
  },
  {
    id: 'listing5',
    hostId: 'host1',
    title: 'Lar Doce Lar no Campo',
    description: 'Uma chácara com muito espaço verde para seu cão explorar. Ideal para pets com muita energia que amam a natureza.\nAmbiente familiar com crianças e outros animais. Seu pet precisa ser sociável.',
    price: 110,
    city: 'São Paulo',
    amenities: ['Área Rural', 'Muito Espaço Verde', 'Ambiente Familiar', 'Aceita Cães Grandes'],
    mainImage: findImage('listing5_main'),
    gallery: [findImage('listing5_gallery1'), findImage('listing5_gallery2')],
  }
];

export const bookings: Booking[] = [
  {
    id: 'booking1',
    tutorId: 'tutor1',
    hostId: 'host1',
    listingId: 'listing1',
    status: 'completed',
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-15'),
    totalPrice: 675,
  },
  {
    id: 'booking2',
    tutorId: 'tutor1',
    hostId: 'host3',
    listingId: 'listing3',
    status: 'confirmed',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    totalPrice: 975,
  },
    {
    id: 'booking3',
    tutorId: 'tutor1',
    hostId: 'host4',
    listingId: 'listing4',
    status: 'confirmed',
    startDate: new Date(new Date().setDate(new Date().getDate() + 20)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 25)),
    totalPrice: 725,
  },
];
