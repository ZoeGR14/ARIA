import { Contributor } from '../types';
import { INITIAL_CONTRIBUTORS } from '../data/mockData';

function adaptarContribuidor(raw: any, index: number): Contributor {
  return {
    id: String(raw.id),
    rank: index + 1,
    name: raw.nombre_completo,
    points: raw.puntos_totales ?? 0,
    avatar: "",
    verified: raw.email_verificado ?? false,
  };
}

export async function getContributores(): Promise<Contributor[]> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return INITIAL_CONTRIBUTORS;
  }

  try {
    const response = await fetch(`${apiUrl}/ranking/contributors`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.map(adaptarContribuidor);
  } catch {
    return INITIAL_CONTRIBUTORS;
  }
}
