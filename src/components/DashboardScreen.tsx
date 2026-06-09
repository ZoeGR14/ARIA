/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, IncidentReport } from '../types';
import { 
  User, MapPin, Edit2, TrendingUp, HelpCircle, LogOut, 
  PlusCircle, LayoutDashboard, Map, ClipboardList, Award, Settings,
  Droplets, Scissors, Wind, ShieldCheck, Eye, Clock, ListCollapse
} from 'lucide-react';

interface DashboardScreenProps {
  reports: IncidentReport[];
  userProfile: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
    location: string;
    level: string;
    impactScore: number;
    pointsThisMonth: number;
    totalsCount: number;
    validatedCount: number;
    contributionsCount: number;
  };
  setCurrentPage: (page: PageId) => void;
  setIsLoggedIn: (login: boolean) => void;
  onSelectReportId: (id: string) => void;
}

export default function DashboardScreen({
  reports,
  userProfile,
  setCurrentPage,
  setIsLoggedIn,
  onSelectReportId,
}: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<'panel' | 'mapa' | 'reportes' | 'colab' | 'config'>('panel');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('inicio');
  };

  const handleSidebarNav = (tab: 'panel' | 'mapa' | 'reportes' | 'colab' | 'config', pageId?: PageId) => {
    setActiveTab(tab);
    if (pageId) {
      setCurrentPage(pageId);
    }
  };

  // Filter only Carlos's reports for Carlos dashboard feed
  const carlosReports = reports.filter(r => r.authorName.includes('Carlos'));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en progreso':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'validando':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIncidentIcon = (category: string) => {
    if (category.toLowerCase().includes('residuo')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
          <Droplets className="w-5 h-5" />
        </div>
      );
    }
    if (category.toLowerCase().includes('tala') || category.toLowerCase().includes('agua')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L4 18h6v4h4v-4h6L12 2z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
        <Wind className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F8F4]">
      
      {/* Main Panel Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Profile Card and Impact Index (Screen 1 Upper Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* General Bio Info */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 lg:p-8 md:col-span-8 flex flex-col md:flex-row gap-6 items-start">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#C8DFCD] shadow-sm flex-shrink-0 mx-auto md:mx-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
                  <h2 className="text-2xl font-bold text-[#143B20]">{userProfile.name}</h2>
                  <span className="bg-[#D3EED0] text-[#143B20] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#BCDDBA] w-fit mx-auto sm:mx-0">
                    🛡️ {userProfile.level}
                  </span>
                </div>
                <p className="text-sm text-[#4F6C56] leading-relaxed mt-2.5">
                  {userProfile.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0F6F1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#55705B]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Ubicación Base</span>
                  <span className="font-semibold text-[#143B20] flex items-center justify-center md:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1a803e]" />
                    {userProfile.location}
                  </span>
                </div>
                <button 
                  onClick={() => setCurrentPage('editar-perfil')}
                  className="text-[#1E8344] font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          </div>

          {/* Environmental Impact Index Card (Screen 1 Upper Right) */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 md:col-span-4 flex flex-col justify-between items-center text-center">
            <div className="w-full text-left">
              <span className="text-xs font-bold text-[#55705B] uppercase tracking-wider block">Índice de Impacto</span>
            </div>

            {/* Circular chart visualizer */}
            <div className="relative w-32 h-32 flex items-center justify-center my-4">
              {/* SVG Radial Gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="50" 
                  stroke="#F0F5F2" strokeWidth="10" 
                  fill="transparent" 
                />
                <circle 
                  cx="64" cy="64" r="50" 
                  stroke="#05682C" strokeWidth="10" 
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - userProfile.impactScore / 100)}
                  fill="transparent"
                  strokeLinecap="round" 
                />
              </svg>
              {/* Inner metric readouts */}
              <div className="absolute flex flex-col justify-center items-center">
                <span className="text-3xl font-extrabold text-[#143B20] leading-none mb-0.5">{userProfile.impactScore}</span>
                <span className="text-[10px] text-slate-400 font-bold">/100</span>
              </div>
            </div>

            <div className="text-emerald-700 text-xs font-bold flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>+{userProfile.pointsThisMonth} pts este mes</span>
            </div>
          </div>
        </div>

        {/* Triple Stat cards (Middle Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total reports with a micro SVG Sparkline */}
          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold">Reportes Totales</p>
              <h3 className="text-4xl font-extrabold text-[#143B20] tracking-tight">{userProfile.totalsCount}</h3>
            </div>
            
            {/* Sparkline Canvas Vector */}
            <svg className="w-20 h-10 stroke-[#05682C] stroke-2" fill="none">
              <path d="M0,35 Q10,20 20,28 T40,10 T60,32 T80,15" strokeLinecap="round" />
            </svg>
          </div>

          {/* Card 2: Validated with Rate Badge */}
          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold">Reportes Validados</p>
              <h3 className="text-4xl font-extrabold text-[#143B20] tracking-tight">{userProfile.validatedCount}</h3>
            </div>
            
            <span className="bg-[#E2F5E0] text-[#143B20] border border-[#BCDCBB] font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
              90% Tasa
            </span>
          </div>

          {/* Card 3: Community contributors with overlapping avatars */}
          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold">Aportes Comunitarios</p>
              <h3 className="text-4xl font-extrabold text-[#143B20] tracking-tight">{userProfile.contributionsCount}</h3>
            </div>

            {/* Overlapping Circles */}
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white" />
              <div className="w-7 h-7 rounded-full bg-[#143B20] border-2 border-white" />
              <div className="w-7 h-7 rounded-full bg-lime-400 border-2 border-white" />
            </div>
          </div>
        </div>

        {/* Carlos's Recent Actions Feed (Screen 1 Lower Section) */}
        <div className="bg-white rounded-3xl border border-[#DDE7DE] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#F0F6F1] flex items-center justify-between">
            <h3 className="text-base font-bold text-[#143B20]">Actividad Reciente</h3>
            <button
              onClick={() => setCurrentPage('reportes')}
              className="text-[#1E8344] text-xs font-bold hover:underline"
            >
              Ver todo →
            </button>
          </div>

          <div className="divide-y divide-[#F0F6F1]">
            {carlosReports.length > 0 ? (
              carlosReports.map((report) => (
                <div 
                  key={report.id}
                  onClick={() => onSelectReportId(report.id)}
                  className="p-5 flex items-center justify-between hover:bg-[#FAFDFC] transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    {getIncidentIcon(report.title)}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#143B20] leading-tight truncate">
                        {report.title}
                      </h4>
                      <p className="text-xs text-[#557B5E] mt-0.5 font-medium leading-none">
                        📍 {report.location.split(',')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* View stats or notes */}
                    <div className="hidden sm:flex items-center space-x-1.5 text-xs text-[#557B5E] font-medium">
                      {report.status.toLowerCase() === 'resuelto' ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Acción tomada</span>
                        </>
                      ) : report.status.toLowerCase() === 'validando' ? (
                        <>
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Esperando datos</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-slate-400" />
                          <span>{report.views} visualizaciones</span>
                        </>
                      )}
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{report.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-400">No hay reportes de este usuario en esta categoría.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
