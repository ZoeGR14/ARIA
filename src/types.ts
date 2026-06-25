/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ReportCategory = 'Acumulación de Basura' | 'Fuga de Agua' | 'Tala Ilegal / Áreas Verdes' | 'Contaminación del Aire';

export type SeverityLevel = 'Baja' | 'Media' | 'Alta' | 'Critica';

export type ReportStatus = 'Recibido' | 'En Revisión' | 'Atendido' | 'Descartado';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  isOfficial?: boolean;
  timeAgo: string;
  content: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  category: ReportCategory;
  severity: SeverityLevel;
  status: ReportStatus;
  location: string;
  coordinates?: string;
  latitude?: number;
  longitude?: number;
  puntos_asignados?: number;
  estado_puntos?: 'Pendiente' | 'Otorgado' | 'Rechazado';
  date: string;
  timeAgo: string;
  views: number;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorLevel?: string;
  actionTaken?: string;
  severityIndex?: number;
  impactedUsers?: number;
  timeline?: {
    received: { date: string; checked: boolean };
    reviewing: { note: string; checked: boolean };
    resolved: { date?: string; checked: boolean };
  };
  comments?: Comment[];
}

export interface Contributor {
  id: string;
  rank: number;
  name: string;
  points: number;
  avatar: string;
  verified: boolean;
  nivel_ranking: string;
  reportCount: number;
}
