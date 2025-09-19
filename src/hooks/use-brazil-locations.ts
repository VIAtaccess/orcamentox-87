import { useEffect, useMemo, useState } from 'react';

export type UF = { sigla: string; nome: string };
export type City = { id: number; nome: string };

export function useBrazilLocations() {
  const [states, setStates] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStates() {
      try {
        setLoadingStates(true);
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        if (!res.ok) throw new Error('Falha ao carregar estados');
        const data: UF[] = await res.json();
        // Ordenar por nome
        data.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        setStates(data);
      } catch (e: any) {
        setError(e.message ?? 'Erro ao carregar estados');
      } finally {
        setLoadingStates(false);
      }
    }
    fetchStates();
  }, []);

  const fetchCities = async (ufSigla: string) => {
    if (!ufSigla) return;
    try {
      setLoadingCities(true);
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios`);
      if (!res.ok) throw new Error('Falha ao carregar cidades');
      const data: City[] = await res.json();
      data.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      setCities(data);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar cidades');
    } finally {
      setLoadingCities(false);
    }
  };

  return {
    states,
    cities,
    loadingStates,
    loadingCities,
    error,
    fetchCities,
  };
}
