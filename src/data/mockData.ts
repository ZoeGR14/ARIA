/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IncidentReport, Contributor } from '../types';

export const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: 'c1',
    rank: 1,
    name: 'EcoGuardian123',
    points: 2450,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    verified: true,
  },
  {
    id: 'c2',
    rank: 2,
    name: 'VerdeMX',
    points: 1870,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    verified: true,
  },
  {
    id: 'c3',
    rank: 3,
    name: 'AnaAmbiental',
    points: 1560,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    verified: true,
  },
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'ENV-2023-8472',
    title: 'Acumulación de Residuos Industriales',
    category: 'Acumulación de Basura',
    severity: 'Alta',
    status: 'En Revisión',
    location: 'Sector Industrial Norte, Ribera del Río Seco, Distrito 4',
    coordinates: '34°05\'22.0"N 118°14\'37.0"W',
    date: '12 Oct 2023',
    timeAgo: 'Hace 3 días',
    views: 142,
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Dra. Elena Vargas',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    authorRole: 'Investigadora Independiente',
    severityIndex: 8.5,
    impactedUsers: 124,
    description: 'Se ha detectado una acumulación significativa de residuos presuntamente industriales en la ribera del Río Seco.',
    detailedDescription: `Se ha detectado una acumulación significativa de residuos presuntamente industriales en la ribera del Río Seco, cerca del sector industrial norte. Los materiales incluyen contenedores plásticos, restos metálicos y sustancias no identificadas que podrían presentar un riesgo de filtración hacia el cauce del río.

Vecinos del área han reportado olores fuertes durante las horas de la tarde. Este reporte requiere atención inmediata por parte de las autoridades ambientales para evaluación de toxicidad y posterior limpieza del área afectada para prevenir contaminación hídrica severa.`,
    timeline: {
      received: { date: '12 Oct, 09:45 AM', checked: true },
      reviewing: { note: 'Actual: Inspección en curso', checked: true },
      resolved: { checked: false },
    },
    comments: [
      {
        id: 'comm-1',
        authorName: 'Agencia de Protección Ambiental',
        authorAvatar: 'https://plus.unsplash.com/premium_photo-1661632128795-3ca7bf3d9bc3?auto=format&fit=crop&w=150&q=80',
        authorRole: 'Oficial',
        isOfficial: true,
        timeAgo: 'Hace 1 día',
        content: 'Equipo de inspección ha sido despachado al lugar. Los resultados preliminares estarán disponibles en 48 horas. Se ha acordonado la zona por precaución.'
      }
    ]
  },
  {
    id: 'ENV-2023-7412',
    title: 'Vertedero Clandestino en Sector Norte',
    category: 'Acumulación de Basura',
    severity: 'Alta',
    status: 'Recibido',
    location: 'Zona Industrial, Cuadrante A',
    date: '12 Oct 2023',
    timeAgo: 'Hace 2 horas',
    views: 32,
    imageUrl: 'https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?auto=format&fit=crop&w=600&q=80',
    authorName: 'EcoGuardian123',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    authorRole: 'Guardián de Residuos Vecinales',
    description: 'Acumulación masiva de plásticos, bolsas y materiales no biodegradables arrojados clandestinamente.',
    detailedDescription: 'Acumulación masiva de plásticos, bolsas y materiales no biodegradables arrojados clandestinamente en un solar vacío adjunto al sector urbano del sector norte.',
    severityIndex: 7.8,
    impactedUsers: 95,
    timeline: {
      received: { date: '12 Oct, 07:15 AM', checked: true },
      reviewing: { note: 'Pendiente de inicio de inspección', checked: false },
      resolved: { checked: false },
    },
    comments: []
  },
  {
    id: 'ENV-2023-9002',
    title: 'Contaminación Química en Río Seco',
    category: 'Fuga de Agua',
    severity: 'Media',
    status: 'En Revisión',
    location: 'Desembocadura Río Seco',
    date: '10 Oct 2023',
    timeAgo: 'Hace 5 horas',
    views: 89,
    imageUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=600&q=80',
    authorName: 'VerdeMX',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    authorRole: 'Protector de Sanidad del Agua',
    description: 'Sustancia líquida oscura con reflejos oleosos visualizada fluyendo de la tubería de descarga industrial.',
    detailedDescription: 'Sustancia líquida oscura con reflejos oleosos visualizada fluyendo de la tubería de descarga industrial hacia el tramo central de Río Seco.',
    severityIndex: 5.6,
    impactedUsers: 240,
    timeline: {
      received: { date: '10 Oct, 02:30 PM', checked: true },
      reviewing: { note: 'Toma de muestras enviada a laboratorio', checked: true },
      resolved: { checked: false },
    },
    comments: []
  },
  {
    id: 'ENV-2023-1120',
    title: 'Emisiones Excesivas Fábrica Textil',
    category: 'Contaminación del Aire',
    severity: 'Baja',
    status: 'Atendido',
    location: 'Parque Industrial Sur',
    date: '05 Sep 2023',
    timeAgo: 'Hace 1 mes',
    views: 204,
    imageUrl: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=600&q=80',
    authorName: 'AnaAmbiental',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    authorRole: 'Centinela de Calidad del Aire',
    description: 'Columnas de humo oscuro denso emitidas de forma continua durante un período de 6 horas el día 5 de septiembre.',
    detailedDescription: 'Columnas de humo oscuro denso emitidas de forma continua durante un período de 6 horas el día 5 de septiembre. La fábrica instaló nuevos filtros de carbono tras la denuncia comunitaria.',
    severityIndex: 3.2,
    impactedUsers: 310,
    timeline: {
      received: { date: '05 Sep, 08:00 AM', checked: true },
      reviewing: { note: 'Inspeccionado por la autoridad', checked: true },
      resolved: { date: '08 Sep, 04:00 PM', checked: true },
    },
    comments: [
      {
        id: 'comm-2',
        authorName: 'Fábrica Textil La Unión',
        authorAvatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80',
        authorRole: 'Representante',
        timeAgo: 'Hace 3 semanas',
        content: 'Confirmamos la finalización de los trabajos de mantenimiento de nuestros extractores y la instalación de filtros de carbón activado mejorados certificados por el organismo regulador.'
      }
    ]
  },
  {
    id: 'ENV-2023-8898',
    title: 'Vertido Industrial Anómalo',
    category: 'Acumulación de Basura',
    severity: 'Alta',
    status: 'En Revisión',
    location: 'Río Tunjuelo, Sector Sur',
    date: '14 Oct 2023',
    timeAgo: 'Hace 2 horas',
    views: 12,
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    authorName: 'Carlos Mendoza',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    authorRole: 'Investigador Nivel 3',
    description: 'Vertido anómalo detectado en las inmediaciones del Río Tunjuelo.',
    detailedDescription: 'Vertido anómalo detectado en las inmediaciones del Río Tunjuelo.',
    severityIndex: 8.2,
    impactedUsers: 45,
    timeline: {
      received: { date: '14 Oct, 11:30 AM', checked: true },
      reviewing: { note: 'Personal en camino', checked: true },
      resolved: { checked: false },
    },
    comments: []
  },
  {
    id: 'ENV-2023-8411',
    title: 'Tala Ilegal Reportada',
    category: 'Tala Ilegal / Áreas Verdes',
    severity: 'Alta',
    status: 'Atendido',
    location: 'Reserva Forestal Oriental',
    date: '14 Oct 2023',
    timeAgo: '14 Oct 2023',
    views: 47,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    authorName: 'Carlos Mendoza',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    authorRole: 'Investigador Nivel 3',
    actionTaken: 'Acción tomada',
    description: 'Denuncia por tala ilegal de especies forestales protegidas en los Cerros Orientales.',
    detailedDescription: 'Denuncia ciudadana reportando la tala clandestina de árboles nativos y movimiento de tierra sin autorización especial dentro de la franja de reserva forestal.',
    severityIndex: 9.0,
    impactedUsers: 155,
    timeline: {
      received: { date: '14 Oct, 09:00 AM', checked: true },
      reviewing: { note: 'Guardaparques alertados', checked: true },
      resolved: { date: '15 Oct, 02:00 PM', checked: true },
    },
    comments: []
  },
  {
    id: 'ENV-2023-8399',
    title: 'Calidad de Aire Crítica',
    category: 'Contaminación del Aire',
    severity: 'Media',
    status: 'En Revisión',
    location: 'Zona Industrial Centro',
    date: '10 Oct 2023',
    timeAgo: '10 Oct 2023',
    views: 74,
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80',
    authorName: 'Carlos Mendoza',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    authorRole: 'Investigador Nivel 3',
    description: 'Emisiones persistentes y estancamiento del humo en horas sin viento para el sector centro industrial.',
    detailedDescription: 'Emisiones persistentes y estancamiento del humo en horas sin viento para el sector centro industrial.',
    severityIndex: 6.8,
    impactedUsers: 560,
    timeline: {
      received: { date: '10 Oct, 06:15 AM', checked: true },
      reviewing: { note: 'Esperando datos de la estación de monitoreo oficial', checked: true },
      resolved: { checked: false },
    },
    comments: []
  }
];

export const MAP_PINS = [
  {
    id: 'p1',
    title: 'Basura acumulada',
    severity: 'Alta',
    category: 'Acumulación de Basura',
    location: 'Col. Roma Norte',
    timeAgo: 'Hace 2 horas',
    lat: 40,
    lng: 40,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661962386121-7221f7ed43ff?auto=format&fit=crop&w=600&q=80',
    description: 'Gran cantidad de basura en la calle, genera mal olor y contamina el ambiente.',
  },
  {
    id: 'p2',
    title: 'Fuga de agua potable',
    severity: 'Media',
    category: 'Fuga de Agua',
    location: 'Col. Del Valle',
    timeAgo: 'Hace 1 hora',
    lat: 60,
    lng: 25,
    imageUrl: 'https://images.unsplash.com/photo-1488415038284-96cf41b4e228?auto=format&fit=crop&w=600&q=80',
    description: 'Fuga de agua potable de alto caudal brotando desde el pavimento dañado.',
  },
  {
    id: 'p3',
    title: 'Humo de fábrica nocivo',
    severity: 'Alta',
    category: 'Contaminación del Aire',
    location: 'Col. Industrial',
    timeAgo: 'Hace 4 horas',
    lat: 25,
    lng: 70,
    imageUrl: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=600&q=80',
    description: 'Emisiones de gases de alta densidad y olor penetrante en horario residencial.',
  }
];
