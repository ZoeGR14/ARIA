/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId, IncidentReport, Contributor } from '../types';
import MapPlaceholder from './MapPlaceholder';
import { motion } from 'motion/react';
import { ClipboardList, ShieldCheck, Users, Globe, Trash2, Droplets, Factory, ArrowRight, Award } from 'lucide-react';

interface LandingScreenProps {
  reports: IncidentReport[];
  contributors: Contributor[];
  setCurrentPage: (page: PageId) => void;
  onSelectReportId: (id: string) => void;
}

export default function LandingScreen({
  reports,
  contributors,
  setCurrentPage,
  onSelectReportId,
}: LandingScreenProps) {
  
  // Recent reports for the landing page grid (let's pick the top 3 with varying timelines)
  const recentReports = reports.slice(0, 3);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Residuos': return <Trash2 className="w-4 h-4 text-[#DC2626]" />;
      case 'Agua':
      case 'Agua Contaminada': return <Droplets className="w-4 h-4 text-[#FAF23C] text-orange-500" />;
      case 'Calidad del Aire': return <Factory className="w-4 h-4 text-[#2563EB]" />;
      default: return <ClipboardList className="w-4 h-4" />;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    if (severity.toLowerCase().includes('alta')) {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    if (severity.toLowerCase().includes('media')) {
      return 'bg-amber-50 text-amber-600 border-amber-200';
    }
    return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  };

  return (
    <div className="bg-[#FAFDF9]">
      {/* Hero Section with Map Integration */}
      <section className="px-4 py-8 md:py-16 md:px-8 border-b border-[#E1ECE3] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero text */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#EBF7EE] border border-[#CDE1D1] px-3 py-1.5 rounded-full w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E8344] animate-pulse" />
              <span className="text-xs font-bold text-[#143B20] tracking-wide uppercase">Plataforma Ciudadana</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#143B20] tracking-tight leading-[1.1]">
              Tu voz en el <span className="text-[#1E8344]">mapa</span>,<br />
              tu huella en el <span className="text-[#33A25A]">futuro</span>.
            </h1>

            <p className="text-sm md:text-base text-[#4F6C56] leading-relaxed max-w-lg">
              Reporta problemas ambientales en tu comunidad y ayuda a construir un futuro sostenible. Únete a miles de ciudadanos que ya están haciendo la diferencia en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setCurrentPage('reportar')}
                className="bg-[#05682C] text-white font-bold px-6 py-3.5 rounded-full hover:bg-[#045524] hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#05682C]/10"
              >
                <span>+ Reportar incidencia</span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('map');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-transparent text-[#143B20] border-2 border-[#C5DDCB] font-bold px-5 py-3 rounded-full hover:bg-[#F3FAF4] transition-all text-sm flex items-center justify-center"
              >
                <span>Explorar mapa</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#557B5E] pt-2 font-medium">
              <Users className="w-4 h-4" />
              <span>Únete a miles de ciudadanos que ya están haciendo la diferencia</span>
            </div>
          </div>

          {/* Interactive Map Visual Platform on Right */}
          <div id="map" className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#143B20] tracking-wider uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#1E8344]" />
                <span>Casos Activos Georreferenciados</span>
              </h2>
              <span className="text-xs text-[#557B5E] font-mono">En vivo</span>
            </div>
            
            <MapPlaceholder reports={reports} onSelectReportId={onSelectReportId} />
          </div>
        </div>
      </section>

      {/* Grid count ticker details */}
      <section className="bg-white py-8 border-b border-[#E1ECE3] px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5 border-r border-[#E1ECE3] last:border-none p-2 align-middle">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-[#143B20] leading-dense">2,458</p>
              <p className="text-xs text-[#557B5E] font-medium">Reportes activos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 border-r border-[#E1ECE3] last:border-none p-2 align-middle">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-[#143B20] leading-dense">1,289</p>
              <p className="text-xs text-[#557B5E] font-medium">Problemas resueltos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 border-r border-[#E1ECE3] last:border-none p-2 align-middle">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-[#143B20] leading-dense">3,671</p>
              <p className="text-xs text-[#557B5E] font-medium">Usuarios activos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 last:border-none p-2 align-middle">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-[#143B20] leading-dense">145</p>
              <p className="text-xs text-[#557B5E] font-medium">Colonias monitoreadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Details Section: Recent Reports vs Top Contributors */}
      <section className="px-4 py-12 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Recent reports list (Left, width 7/12) */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#12301A] font-sans tracking-tight">Reportes recientes</h3>
            <button
              onClick={() => setCurrentPage('reportes')}
              className="text-[#1E8344] text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E1ECE3] shadow-sm divide-y divide-[#E1ECE3] overflow-hidden">
            {recentReports.map((report) => (
              <div 
                key={report.id}
                onClick={() => onSelectReportId(report.id)}
                className="p-5 flex items-start space-x-4 hover:bg-[#FAFDFC] transition-all cursor-pointer group"
              >
                {/* Thumb icon/image */}
                <img 
                  src={report.imageUrl} 
                  alt={report.title} 
                  className="w-16 h-16 object-cover rounded-xl border border-[#C5DDCB] flex-shrink-0"
                  referrerPolicy="no-referrer"
                />

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getCategoryIcon(report.category)}
                    <span className="text-[11px] font-bold text-[#557C5E] uppercase bg-[#F0F6F1] px-2 py-0.5 rounded-full tracking-wider">
                      {report.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {report.timeAgo}</span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-[#143B20] mt-1 line-clamp-1 group-hover:text-[#1E8344] transition-colors">
                    {report.title}
                  </h4>
                  <p className="text-xs text-[#557B5E] mt-0.5 font-medium">📍 {report.location}</p>
                </div>

                {/* Severity Badge */}
                <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-full uppercase tracking-tight ${getSeverityBadgeClass(report.severity)}`}>
                  {report.severity.replace(' Severidad', '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors Ranking (Right, width 5/12) */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#12301A] font-sans tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C49B2F]" />
              <span>Top contribuidores</span>
            </h3>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="text-[#1E8344] text-xs font-bold hover:underline"
            >
              Ver ranking completo
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E1ECE3] shadow-sm p-6 space-y-4">
            {contributors.map((contrib, index) => (
              <div 
                key={contrib.id}
                className="flex items-center justify-between border-b border-[#F0F6F1] last:border-none pb-4 last:pb-0"
              >
                {/* Ranking Index, Avatar, Name */}
                <div className="flex items-center space-x-3">
                  <span className={`text-base font-black italic w-6 text-center ${
                    index === 0 ? 'text-[#C49B2F]' : index === 1 ? 'text-[#778B8D]' : 'text-[#A07044]'
                  }`}>
                    {index + 1}
                  </span>

                  <img 
                    src={contrib.avatar} 
                    alt={contrib.name} 
                    className="w-10 h-10 rounded-full object-cover border border-[#C5DDCB]"
                    referrerPolicy="no-referrer"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-[#143B20] flex items-center gap-1 leading-tight">
                      {contrib.name}
                      {contrib.verified && (
                        <span className="text-[#1E8344]" title="Usuario verificado">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-[#557B5E] font-medium">Investigador Ciudadano</p>
                  </div>
                </div>

                {/* Score tally */}
                <div className="text-right">
                  <span className="text-sm font-black text-[#143B20] tracking-tight">{contrib.points.toLocaleString()}</span>
                  <span className="text-[10px] text-[#557B5E] font-bold block leading-none">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
