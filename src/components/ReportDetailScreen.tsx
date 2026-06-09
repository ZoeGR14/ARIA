/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PageId, IncidentReport, Comment } from '../types';
import { 
  ArrowLeft, Clock, Calendar, CheckCircle2, ShieldAlert, Users, 
  MapPin, Compass, Play, Send, Shield, User 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Real-world CDMX Coordinates representing the neighborhoods
const REPORT_COORDINATES: Record<string, [number, number]> = {
  'ENV-2023-8472': [19.4150, -99.1620], // Col. Roma Norte
  'ENV-2023-7412': [19.4750, -99.1250], // Col. Industrial (North)
  'ENV-2023-9002': [19.3800, -99.1700], // Col. Del Valle (Middle)
  'ENV-2023-1120': [19.3400, -99.1450], // South Industrial
  'ENV-2023-8898': [19.3508, -99.1630], // South Sectors
  'ENV-2023-8411': [19.3100, -99.2100], // Cerros / reserves
};

interface ReportDetailScreenProps {
  report: IncidentReport | null;
  setCurrentPage: (page: PageId) => void;
  onAddComment: (reportId: string, comment: Comment) => void;
  currentUser: {
    name: string;
    avatar: string;
    role: string;
  };
}

export default function ReportDetailScreen({
  report,
  setCurrentPage,
  onAddComment,
  currentUser,
}: ReportDetailScreenProps) {
  const [commentText, setCommentText] = useState('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!report || !mapContainerRef.current) return;

    // Get coordinates from map or fallback to CDMX center
    const coords: [number, number] = REPORT_COORDINATES[report.id] || [19.4150, -99.1620];

    // If map does not exist, build it
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: coords,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      // If it exists, just fly or transition to the target coordinates
      mapInstanceRef.current.setView(coords, 14, { animate: true });
    }

    // Set or refresh marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    let pinColor = '#DC2626'; // High severity
    let pinEmoji = '⚠️';
    if (report.category === 'Residuos') {
      pinEmoji = '🗑️';
      pinColor = '#DC2626';
    } else if (report.category === 'Agua Contaminada' || report.category === 'Agua') {
      pinEmoji = '💧';
      pinColor = '#F97316';
    } else if (report.category === 'Calidad del Aire') {
      pinEmoji = '🏭';
      pinColor = '#2563EB';
    }

    const htmlContent = `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <!-- Pulse animation -->
        <div class="absolute -inset-1.5 rounded-full bg-[${pinColor}] opacity-30 animate-ping" style="animation-duration: 2s;"></div>
        
        <!-- Outer circle marker -->
        <div class="w-8 h-8 rounded-full bg-white border-2 border-[${pinColor}] flex items-center justify-center text-xs shadow-md">
          <span>${pinEmoji}</span>
        </div>
        
        <!-- Needle pointer shadow -->
        <div class="absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-[${pinColor}]"></div>
      </div>
    `;

    const icon = L.divIcon({
      html: htmlContent,
      className: 'custom-detail-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker(coords, { icon }).addTo(mapInstanceRef.current);
    markerRef.current = marker;

    // Trigger map invalidations to fit layout after potential parent animation renders
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

  }, [report]);

  // Clean map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!report) {
    return (
      <div className="p-12 text-center bg-[#FAFDF9]">
        <p className="text-sm text-[#4F6C56]">Cargando incidencias o reporte no disponible...</p>
        <button 
          onClick={() => setCurrentPage('reportes')}
          className="mt-4 bg-[#05682C] text-white px-4 py-2 rounded-lg text-xs font-bold"
        >
          Volver a listados
        </button>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      isOfficial: currentUser.name.includes('Oficial') || currentUser.role.includes('Agencia'),
      timeAgo: 'Hace unos instantes',
      content: commentText.trim()
    };

    onAddComment(report.id, newComment);
    setCommentText('');
  };

  const getPriorityColor = (severity: string) => {
    if (severity.toLowerCase().includes('alta')) {
      return 'bg-[#DC2626] text-white';
    }
    if (severity.toLowerCase().includes('media')) {
      return 'bg-[#F97316] text-white';
    }
    return 'bg-[#10B981] text-white';
  };

  return (
    <div className="bg-[#FAFDF9] py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation back Link breadcrumb */}
        <button
          onClick={() => setCurrentPage('reportes')}
          className="text-[#4F6C56] hover:text-[#1E8344] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Reportes</span>
        </button>

        {/* Master Details Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT WIDE COLUMN (7/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title Block & badges */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-[10px] font-black tracking-wide px-3 py-1 rounded-sm uppercase ${getPriorityColor(report.severity)}`}>
                  ALTA PRIORIDAD
                </span>
                <span className="text-xs font-bold text-[#557B5E] font-mono select-all">
                  ID: #{report.id}
                </span>

                <button className="ml-auto text-xs font-bold text-[#1E8344] bg-[#EBF7EE] border border-[#CBDCD0] px-4 py-1.5 rounded-lg hover:bg-[#DCE7DD]">
                  🔔 Seguir este reporte
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[#143B20] tracking-tight leading-tight">
                {report.title}
              </h1>

              {/* Time stats */}
              <div className="flex items-center space-x-4 text-xs font-medium text-[#4F6C56]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#1E8344]" />
                  {report.date}
                </span>
                <span className="flex items-center gap-1 border-l border-[#CDE1D1] pl-4">
                  <Clock className="w-4 h-4 text-[#1E8344]" />
                  {report.timeAgo}
                </span>
              </div>
            </div>

            {/* Main Picture Frame container with verification badge (Screen 6 Large center) */}
            <div className="relative rounded-3xl overflow-hidden border border-[#DDE7DE] bg-[#EDF2EE] shadow-sm max-h-[420px] flex items-center justify-center">
              <img 
                src={report.imageUrl} 
                alt={report.title} 
                className="w-full h-full object-cover max-h-[420px]"
                referrerPolicy="no-referrer"
              />

              {/* Verification Green Ticket Label */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-[#1E8344]/30 px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                <div className="w-5 h-5 rounded-full bg-[#1E8344] flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#143B20] tracking-tight">Evidencia Verificada</span>
              </div>
            </div>

            {/* Detailed Description block with Green bookmark bar (Screen 6 middle) */}
            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 lg:p-8 shadow-xs flex gap-5">
              <div className="w-1.5 bg-[#1E8344] rounded-full self-stretch flex-shrink-0" />
              
              <div className="space-y-6 flex-1 min-w-0">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#143B20] uppercase tracking-wider flex items-center gap-1.5 label-title">
                    <Compass className="w-4 h-4 text-[#1E8344]" />
                    <span>Descripción Detallada</span>
                  </h3>
                  <p className="text-sm text-[#384C3E] leading-relaxed whitespace-pre-line">
                    {report.detailedDescription || report.description}
                  </p>
                </div>

                {/* Author User Citation Card */}
                <div className="pt-5 border-t border-[#F0F6F1] flex items-center space-x-3.5">
                  <img 
                    src={report.authorAvatar} 
                    alt={report.authorName} 
                    className="w-11 h-11 rounded-full object-cover border border-[#CDE1D1]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-black text-[#143B20] leading-none">
                      {report.authorName}
                    </h4>
                    <span className="text-[10px] text-[#557B5E] font-medium block mt-1">
                      {report.authorRole} • {report.authorName.includes('Elena') ? '42 Reportes' : 'Nivel 3'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stream Comment Thread list (Screen 6 Lower Section) */}
            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 lg:p-8 space-y-6 shadow-xs">
              <h3 className="text-xs font-bold text-[#143B20] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#1E8344]" />
                <span>Actualizaciones y Comentarios</span>
              </h3>

              {/* Feed Text Area Input Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-4">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-10 h-10 rounded-full object-cover border border-[#CDE1D1] hidden sm:block"
                />
                
                <div className="flex-1 space-y-3">
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Añadir una actualización o comentario..."
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-2xl p-4 text-xs text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#05682C] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#045524] transition-all text-xs flex items-center space-x-1.5 shadow-sm shadow-[#05682C]/10 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Comentar</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments Feed list */}
              <div className="space-y-4 pt-4 border-t border-[#F0F6F1]">
                {report.comments && report.comments.length > 0 ? (
                  report.comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className={`p-4 rounded-2xl border flex gap-4 ${
                        comment.isOfficial 
                          ? 'bg-[#F2F8F3] border-[#97D4A4] text-[#143B20]' 
                          : 'bg-white border-[#FAFDFC] text-[#557B5E]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-[#CDE1D1] flex-shrink-0 relative overflow-hidden">
                        {comment.authorAvatar ? (
                          <img src={comment.authorAvatar} alt="Comment Author" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[#143B20]">{comment.authorName}</span>
                          
                          {comment.isOfficial && (
                            <span className="bg-[#1E8344] text-white text-[9px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Shield className="w-2.5 h-2.5" />
                              OFICIAL
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400">• {comment.timeAgo}</span>
                        </div>

                        <p className="text-xs text-[#304134] leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-slate-400 py-6">No hay actualizaciones en este reporte todavía.</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Location visual card with mini map display (Screen 6 Right Top) */}
            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-[#143B20] uppercase tracking-wider">
                Ubicación
              </h3>

              {/* Coordinates graphic map */}
              <div className="relative h-44 rounded-xl border border-[#CBDCD0] overflow-hidden bg-[#FAFDF9]">
                {/* Live leaflet container */}
                <div ref={mapContainerRef} className="w-full h-full z-10" style={{ outline: 'none' }} />

                {/* Latitude Coordinate Overlay */}
                <span className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap z-20">
                  📍 {report.coordinates || '19.4150, -99.1620'}
                </span>
              </div>

              {/* Address detail description block info */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">DIRECCIÓN DETALLADA</span>
                <p className="text-[#143B20] font-semibold leading-relaxed">
                  {report.location}
                </p>
              </div>

              {/* Open basemap translucent button action */}
              <button 
                onClick={() => setCurrentPage('explorar-mapa')}
                className="w-full bg-[#EDF2EE] border border-[#CDE1D1] text-[#143B20] hover:bg-[#DCE7DD] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#1E8344]" />
                <span>Abrir en Mapa Completo</span>
              </button>
            </div>

            {/* Timeline status checklist card (Screen 6 Right Middle) */}
            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-[#143B20] uppercase tracking-wider">
                Estado del Reporte
              </h3>

              {report.timeline && (
                <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E1ECE3]">
                  {/* Step 1 Received */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                      report.timeline.received.checked 
                        ? 'border-[#1E8344] text-[#1E8344] fill-[#1E8344]' 
                        : 'border-slate-300 text-slate-300'
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <div className="space-y-0.5 pl-2">
                      <p className="text-xs font-bold text-[#143B20]">Reporte Recibido</p>
                      <p className="text-[10px] text-slate-400 font-medium">{report.timeline.received.date}</p>
                    </div>
                  </div>

                  {/* Step 2 Reviewing */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                      report.timeline.reviewing.checked 
                        ? 'border-[#3B82F6] text-[#3B82F6]' 
                        : 'border-slate-300 text-slate-300'
                    }`}>
                      {report.timeline.reviewing.checked ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </span>
                    <div className="space-y-0.5 pl-2">
                      <p className="text-xs font-bold text-[#143B20]">En Revisión por Autoridad</p>
                      <p className="text-[10px] text-[#2563EB] font-bold leading-normal italic">
                        {report.timeline.reviewing.note}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 Resolved */}
                  <div className="relative">
                    <span className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                      report.timeline.resolved.checked 
                        ? 'border-[#10B981] text-[#10B981]' 
                        : 'border-slate-300 text-slate-300'
                    }`}>
                      {report.timeline.resolved.checked && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                    </span>
                    <div className="space-y-0.5 pl-2">
                      <p className="text-xs font-bold text-[#143B20]">Acción Resolutiva</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {report.timeline.resolved.checked ? report.timeline.resolved.date : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Impact Metric Blocks Cards dual group */}
            <div className="grid grid-cols-2 gap-4">
              {/* Severity Card index rating */}
              <div className="bg-white rounded-2xl border border-[#DDE7DE] p-4 text-center flex flex-col justify-between h-28">
                <span className="text-[11px] font-bold text-[#55705B] uppercase block">
                  Índice Severidad
                </span>
                
                <h3 className="text-3xl font-black text-rose-600 leading-none">
                  {report.severityIndex || '8.5'}
                </h3>

                <div className="flex items-center justify-center space-x-1 text-[10px] text-rose-500 font-extrabold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Crítica</span>
                </div>
              </div>

              {/* Impacted Citizen stats count */}
              <div className="bg-white rounded-2xl border border-[#DDE7DE] p-4 text-center flex flex-col justify-between h-28">
                <span className="text-[11px] font-bold text-[#55705B] uppercase block">
                  Afectados
                </span>
                
                <h3 className="text-3xl font-black text-[#05682C] leading-none animate-pulse">
                  {report.impactedUsers || '124'}
                </h3>

                <div className="flex items-center justify-center space-x-1 text-[10px] text-emerald-600 font-extrabold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Vecinos</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
