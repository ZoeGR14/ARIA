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
export async function getReportePorId(id: string): Promise<IncidentReport | null> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return INITIAL_REPORTS.find(r => String(r.id) === String(id)) ?? null;
  }

  try {
    const response = await fetch(`${apiUrl}/reportes/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as IncidentReport;
  } catch {
    return INITIAL_REPORTS.find(r => String(r.id) === String(id)) ?? null;
  }
}

export async function crearReporte(formData: FormData, token: string) {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const response = await fetch(`${apiUrl}/reportes`, {
        method: 'POST',
        headers: {
            // Nota: Aquí no lleva Content-Type, el navegador lo pone solo
            'Authorization': `Bearer ${token}` 
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error al enviar el reporte: ${response.status}`);
    }

    return await response.json();
}