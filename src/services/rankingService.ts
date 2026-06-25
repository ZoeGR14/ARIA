import { Contributor } from '../types';
import { INITIAL_CONTRIBUTORS } from '../data/mockData';

function adaptarContribuidor(raw: any, index: number): Contributor {
  return {
    id: String(raw.id),
    rank: index + 1,
    name: raw.nombre_completo,
    points: raw.puntos_totales ?? 0,
    avatar: raw.avatar_url ?? '',
    verified: raw.email_verificado ?? false,
    nivel_ranking: raw.nivel_ranking ?? "",
    reportCount: raw._count?.reporte ?? 0,
  };
}

function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || '/api';
}

export async function getContributores(): Promise<Contributor[]> {
  const apiUrl = getApiUrl();

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
