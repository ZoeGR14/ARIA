/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IncidentReport, Comment } from '../types';
import { getReportePorId, actualizarReporte } from '../services/reportesService';
import {
  ArrowLeft, Clock, Calendar, CheckCircle2, ShieldAlert, Users,
  MapPin, Compass, Play, Send, Shield, User, X, Loader2, Save
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
  reports: IncidentReport[];
  onAddComment: (reportId: string, comment: Comment) => void;
  onUpdateReport?: (reportId: string, updatedFields: Partial<IncidentReport>) => void;
  currentUser: {
    name: string;
    avatar: string;
    role: string;
  };
}

export default function ReportDetailScreen({
  reports,
  onAddComment,
  onUpdateReport,
  currentUser,
}: ReportDetailScreenProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<IncidentReport | null>(
    reports.find(r => String(r.id) === String(id)) ?? null
  );
  const [direccionLegible, setDireccionLegible] = useState<string>('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [adminStatus, setAdminStatus] = useState<string>(report?.status || 'Recibido');
  const [adminPointsStatus, setAdminPointsStatus] = useState<string>(report?.estado_puntos || 'Pendiente');
  const [adminPoints, setAdminPoints] = useState<number>(report?.puntos_asignados || 0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (report) {
      setAdminStatus(report.status);
      setAdminPointsStatus(report.estado_puntos || 'Pendiente');
      setAdminPoints(report.puntos_asignados || 0);
    }
  }, [report]);

  const handleAdminUpdate = async () => {
    if (!report) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token') || '';
      const statusMap: Record<string, number> = {
        'Recibido': 1,
        'En Revisión': 2,
        'Atendido': 3,
        'Descartado': 4
      };
      
      const updateData = {
        estado_id: statusMap[adminStatus] || 1,
        estado_puntos: adminPointsStatus as any,
        puntos_asignados: adminPoints
      };

      await actualizarReporte(report.id, updateData, token);
      
      const updatedFields: Partial<IncidentReport> = {
        status: adminStatus as any,
        estado_puntos: adminPointsStatus as any,
        puntos_asignados: adminPoints
      };

      setReport({
        ...report,
        ...updatedFields
      });

      if (onUpdateReport) {
        onUpdateReport(report.id, updatedFields);
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el reporte');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getReportePorId(id).then(r => {
      if (r) setReport(r);
    });
  }, [id]);

  useEffect(() => {
    const matched = reports.find(r => String(r.id) === String(id));
    if (matched) {
      setReport(matched);
    }
  }, [reports, id]);

  useEffect(() => {
    if (report && report.latitude && report.longitude && !direccionLegible) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.latitude}&lon=${report.longitude}&addressdetails=1`, {
        headers: { 'Accept-Language': 'es' }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.address) {
          const town = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || '';
          const state = data.address.state || '';
          setDireccionLegible(town ? `${town}, ${state}` : data.display_name.split(',')[0]);
        }
      })
      .catch(() => setDireccionLegible('Ubicación Desconocida'));
    }
  }, [report?.latitude, report?.longitude]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!report || !mapContainerRef.current) return;

    // Get coordinates from map or fallback to CDMX center
    const coords: [number, number] = (report.latitude && report.longitude) 
      ? [report.latitude, report.longitude] 
      : (REPORT_COORDINATES[report.id] || [19.4150, -99.1620]);

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
    if (report.category === 'Acumulación de Basura') {
      pinEmoji = '🗑️';
      pinColor = '#DC2626';
    } else if (report.category === 'Fuga de Agua') {
      pinEmoji = '💧';
      pinColor = '#F97316';
    } else if (report.category === 'Contaminación del Aire') {
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
          onClick={() => navigate(-1)}
          className="mt-4 bg-[#05682C] text-white px-4 py-2 rounded-lg text-xs font-bold"
        >
          Volver a listados
        </button>
      </div>
    );
  }

  // Comment submit removed

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
          onClick={() => navigate(-1)}
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
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[#143B20] tracking-tight leading-tight">
                {direccionLegible 
                  ? `${report.category} en ${direccionLegible} - ${report.title.split(' - ')[1] || ''}` 
                  : report.title}
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
                      {report.authorRole} • Nivel: {report.authorLevel || 'Novato'}
                    </span>
                  </div>
                </div>
              </div>
             {/* Comments Section Removed */}
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
                  {direccionLegible || report.location}
                </p>
              </div>

              {/* Open basemap translucent button action */}
              <button 
                onClick={() => navigate('/explorar-mapa')}
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

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E1ECE3]">
                {/* Step 1 Received */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white border-[#1E8344] text-[#1E8344] fill-[#1E8344]">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <div className="space-y-0.5 pl-2">
                    <p className="text-xs font-bold text-[#143B20]">Reporte Recibido</p>
                    <p className="text-[10px] text-slate-400 font-medium">Completado</p>
                  </div>
                </div>

                {/* Step 2 Reviewing */}
                <div className="relative">
                  <span className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                    ['En Revisión', 'Atendido', 'Descartado'].includes(report.status)
                      ? 'border-[#3B82F6] text-[#3B82F6]' 
                      : 'border-slate-300 text-slate-300'
                  }`}>
                    {report.status === 'En Revisión' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-pulse" />
                    ) : ['Atendido', 'Descartado'].includes(report.status) ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </span>
                  <div className="space-y-0.5 pl-2">
                    <p className="text-xs font-bold text-[#143B20]">En Revisión por Autoridad</p>
                    <p className="text-[10px] text-[#2563EB] font-bold leading-normal italic">
                      {report.status === 'En Revisión' ? 'Actual: Análisis en proceso' : ['Atendido', 'Descartado'].includes(report.status) ? 'Revisión Finalizada' : 'Pendiente'}
                    </p>
                  </div>
                </div>

                {/* Step 3 Resolved / Descartado */}
                <div className="relative">
                  <span className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                    report.status === 'Atendido' 
                      ? 'border-[#10B981] text-[#10B981]' 
                      : report.status === 'Descartado' 
                      ? 'border-red-500 text-red-500'
                      : 'border-slate-300 text-slate-300'
                  }`}>
                    {report.status === 'Atendido' && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                    {report.status === 'Descartado' && <X className="w-5 h-5 text-red-500" />}
                  </span>
                  <div className="space-y-0.5 pl-2">
                    <p className={`text-xs font-bold ${report.status === 'Descartado' ? 'text-red-600' : 'text-[#143B20]'}`}>
                      {report.status === 'Descartado' ? 'Reporte Descartado' : 'Acción Resolutiva'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {report.status === 'Atendido' ? 'Resolución exitosa' : report.status === 'Descartado' ? 'El reporte no procedió' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metric Blocks Cards dual group */}
            <div className="grid grid-cols-2 gap-4">
              {/* Puntos Asignados */}
              <div className="bg-white rounded-2xl border border-[#DDE7DE] p-4 text-center flex flex-col justify-between h-28">
                <span className="text-[11px] font-bold text-[#55705B] uppercase block">
                  Puntos Asignados
                </span>
                
                <h3 className="text-3xl font-black text-[#05682C] leading-none">
                  +{report.puntos_asignados || 0}
                </h3>

                <div className="flex items-center justify-center space-x-1 text-[10px] text-[#1E8344] font-extrabold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Gamificación</span>
                </div>
              </div>

              {/* Estado de Puntos */}
              <div className="bg-white rounded-2xl border border-[#DDE7DE] p-4 text-center flex flex-col justify-between h-28">
                <span className="text-[11px] font-bold text-[#55705B] uppercase block">
                  Estado de Puntos
                </span>
                
                <h3 className={`text-xl font-black leading-none mt-2 ${
                  report.estado_puntos === 'Otorgado' ? 'text-[#10B981]' : 
                  report.estado_puntos === 'Rechazado' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {report.estado_puntos || 'Pendiente'}
                </h3>

                <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-500 font-extrabold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Revisión de Recompensa</span>
                </div>
              </div>
            </div>

            {/* Admin Panel */}
            {currentUser.role === 'Administrador' && (
              <div className="bg-[#FAFDFC] rounded-3xl border-2 border-indigo-100 p-6 space-y-5 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  Acciones de Administrador
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado del Reporte</label>
                    <select 
                      value={adminStatus} 
                      onChange={(e) => setAdminStatus(e.target.value)}
                      className="w-full bg-white border border-indigo-100 rounded-xl py-2 px-3 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      <option value="Recibido">Recibido</option>
                      <option value="En Revisión">En Revisión</option>
                      <option value="Atendido">Atendido</option>
                      <option value="Descartado">Descartado</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado de Puntos</label>
                      <select 
                        value={adminPointsStatus} 
                        onChange={(e) => setAdminPointsStatus(e.target.value)}
                        className="w-full bg-white border border-indigo-100 rounded-xl py-2 px-3 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Otorgado">Otorgado</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Puntos a Asignar</label>
                      <input 
                        type="number" 
                        value={adminPoints} 
                        onChange={(e) => setAdminPoints(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-indigo-100 rounded-xl py-2 px-3 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleAdminUpdate}
                    disabled={isUpdating}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isUpdating ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#143B20]/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-[#DDE7DE] animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#EBF7EE] mb-6">
              <CheckCircle2 className="h-10 w-10 text-[#1E8344]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#143B20] mb-2">¡Reporte Actualizado!</h3>
            <p className="text-sm text-[#4F6C56] font-medium mb-8">
              Los puntos y el estado del reporte han sido guardados exitosamente.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#05682C] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#045524] transition-all cursor-pointer shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
