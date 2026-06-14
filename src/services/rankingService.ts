import { Contributor } from '../types';
import { INITIAL_CONTRIBUTORS } from '../data/mockData';

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
    return (await response.json()) as Contributor[];
  } catch {
    return INITIAL_CONTRIBUTORS;
  }
}
