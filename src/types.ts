/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ReportCategory = 'Residuos' | 'Agua Contaminada' | 'Calidad del Aire' | 'Agua';

export type SeverityLevel = 'Alta' | 'Media' | 'Baja' | 'Alta Severidad' | 'Media Severidad' | 'Baja Severidad';

export type ReportStatus = 'Abierto' | 'En progreso' | 'En Progreso' | 'Resuelto' | 'Validando';

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
  date: string;
  timeAgo: string;
  views: number;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
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
