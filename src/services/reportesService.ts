import { IncidentReport } from '../types';
import { INITIAL_REPORTS } from '../data/mockData';

function calcularTimeAgo(fechaIso: string): string {
  const diff = Date.now() - new Date(fechaIso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Hace 1 minuto' : `Hace ${mins} minutos`;
  const horas = Math.floor(mins / 60);
  if (horas < 24) return horas === 1 ? 'Hace 1 hora' : `Hace ${horas} horas`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;
}

function adaptarReporte(raw: any): IncidentReport {
  const sev = (raw.severidad ?? '').toLowerCase();
  let severity: IncidentReport['severity'] = 'Baja';
  if (sev === 'critica' || sev === 'alta') severity = 'Alta';
  else if (sev === 'media') severity = 'Media';

  const catNombre: string = raw.categoria?.nombre ?? '';
  let category: IncidentReport['category'] = 'Residuos';
  if (catNombre.includes('Contaminada')) category = 'Agua Contaminada';
  else if (catNombre.includes('Agua')) category = 'Agua';
  else if (catNombre.includes('Aire')) category = 'Calidad del Aire';

  const estadoNombre: string = raw.estado?.nombre ?? '';
  let status: IncidentReport['status'] = 'Abierto';
  if (estadoNombre === 'En Revisión') status = 'En progreso';
  else if (estadoNombre === 'Resuelto') status = 'Resuelto';

  return {
    id: String(raw.id),
    title: raw.descripcion,
    description: raw.descripcion,
    category,
    severity,
    status,
    location: `${raw.latitude}, ${raw.longitude}`,
    coordinates: `${raw.latitude} N, ${raw.longitude} W`,
    date: raw.fecha_creacion,
    timeAgo: calcularTimeAgo(raw.fecha_creacion),
    views: 0,
    imageUrl: raw.url_evidencia_foto ?? '',
    authorName: raw.usuario?.nombre_completo ?? 'Usuario',
    authorAvatar: raw.usuario?.avatar_url === ''
        ? "https://tse4.mm.bing.net/th/id/OIP.dDKYQqVBsG1tIt2uJzEJHwHaHa?cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3"
        : raw.usuario?.avatar_url,
    authorRole: 'Ciudadano',
  };
}

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
    const data = await response.json();
    return data.map(adaptarReporte);
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
    const data = await response.json();
    console.log(data);
    return adaptarReporte(data);
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