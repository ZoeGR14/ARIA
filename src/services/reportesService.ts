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
  // Mapping to DB types directly with fallbacks
  const severity: IncidentReport['severity'] = raw.severidad || 'Baja';
  const category: IncidentReport['category'] = raw.categoria?.nombre || 'Acumulación de Basura';
  const status: IncidentReport['status'] = raw.estado?.nombre || 'Recibido';

  // Format short date for title (e.g. 15/06)
  let fechaFormateada = '';
  if (raw.fecha_creacion) {
    const d = new Date(raw.fecha_creacion);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    fechaFormateada = `${day}/${month}`;
  } else {
    fechaFormateada = 'Hoy';
  }

  // Format location briefly
  const latStr = raw.latitude ? Number(raw.latitude).toFixed(4) : '';
  const lngStr = raw.longitude ? Number(raw.longitude).toFixed(4) : '';
  const locationStr = (latStr && lngStr) ? `${latStr}, ${lngStr}` : '';

  return {
    id: String(raw.id),
    title: `${category} - ${fechaFormateada}`,
    description: raw.descripcion,
    category,
    severity,
    status,
    location: locationStr,
    coordinates: `${raw.latitude} N, ${raw.longitude} W`,
    date: raw.fecha_creacion,
    timeAgo: raw.fecha_creacion ? calcularTimeAgo(raw.fecha_creacion) : '',
    views: 0, // Retained for compatibility but will be removed from UI
    imageUrl: raw.url_evidencia_foto ?? '',
    authorName: raw.usuario?.nombre_completo ?? 'Usuario',
    authorAvatar: raw.usuario?.avatar_url === ''
      ? "https://tse4.mm.bing.net/th/id/OIP.dDKYQqVBsG1tIt2uJzEJHwHaHa?cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3"
      : raw.usuario?.avatar_url,
    authorRole: raw.usuario?.rol || 'Ciudadano',
    authorLevel: raw.usuario?.nivel_ranking || 'Novato',
    latitude: raw.latitude,
    longitude: raw.longitude,
    puntos_asignados: raw.puntos_asignados || 0,
    estado_puntos: raw.estado_puntos || 'Pendiente'
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

  return await response.json();
}

export async function actualizarReporte(
  id: string,
  updateData: {
    estado_id?: number;
    estado_puntos?: 'Pendiente' | 'Otorgado' | 'Rechazado';
    puntos_asignados?: number;
  },
  token: string
) {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return null;

  const response = await fetch(`${apiUrl}/reportes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar el reporte: ${response.status}`);
  }

  return await response.json();
}