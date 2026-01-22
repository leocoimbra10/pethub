// FORCAR ATUALIZACAO AGORA VAI
import { db } from "@/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import type { Host } from '@/lib/types';
import SearchClientPage from './SearchClientPage';

export const dynamic = "force-dynamic";

const normalize = (text: string) => 
  text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

async function fetchHosts(searchTerm: string): Promise<Host[]> {
  try {
    const q = query(collection(db, "hosts"));
    const querySnapshot = await getDocs(q);
    
    const allHosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Host[];

    if (!searchTerm) return allHosts;

    const filtered = allHosts.filter((host: Host) => {
      const cityMatch = host.cidade ? normalize(host.cidade).includes(normalize(searchTerm)) : false;
      const nameMatch = host.nome ? normalize(host.nome).includes(normalize(searchTerm)) : false;
      return cityMatch || nameMatch;
    });

    return filtered;
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams?: { city?: string } }) {
  const searchTerm = searchParams?.city || "";
  const hosts = await fetchHosts(searchTerm);

  return <SearchClientPage initialHosts={hosts} initialCity={searchTerm} />;
}
