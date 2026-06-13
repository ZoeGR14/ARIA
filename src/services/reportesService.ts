import { IncidentReport } from '../types';
import { INITIAL_REPORTS } from '../data/mockData';

export async function getReportesActivos(): Promise<IncidentReport[]> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return INITIAL_REPORTS;
  }

  try {
    const response = await fetch(`${apiUrl}/reportes/activos`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as IncidentReport[];
  } catch {
    return INITIAL_REPORTS;
  }
}
