/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentReport } from '../types';
import {
  User, MapPin, Edit2, TrendingUp, HelpCircle, LogOut,
  PlusCircle, LayoutDashboard, Map, ClipboardList, Award, Settings,
  Droplets, Scissors, Wind, ShieldCheck, Eye, Clock, ListCollapse,
  Users, AlertCircle, Activity
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
  setIsLoggedIn: (login: boolean) => void;
}

export default function DashboardScreen({
  reports,
  userProfile,
  setIsLoggedIn,
}: DashboardScreenProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'panel' | 'mapa' | 'reportes' | 'colab' | 'config'>('panel');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = userProfile.role === 'Administrador';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
        if (!token) return;

        const endpoint = isAdmin 
          ? 'http://localhost:3001/api/dashboard/admin-stats' 
          : 'http://localhost:3001/api/dashboard/user-stats';
        
        const res = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (isAdmin) setAdminStats(data);
          else setUserStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [isAdmin]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en progreso':
      case 'validando':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIncidentIcon = (category: string) => {
    if (!category) return <Wind className="w-5 h-5" />;
    if (category.toLowerCase().includes('residuo') || category.toLowerCase().includes('basura')) {
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

  const renderAdminDashboard = () => {
    if (!adminStats) return null;

    // Build trend chart SVG path
    const trendKeys = Object.keys(adminStats.tendencias || {}).sort();
    const trendValues = trendKeys.map(k => adminStats.tendencias[k]);
    const maxVal = Math.max(...trendValues, 1);
    
    const points = trendValues.map((val, idx) => {
      const x = (idx / (Math.max(trendValues.length - 1, 1))) * 100;
      const y = 100 - (val / maxVal) * 100;
      return `${x},${y}`;
    }).join(' L ');

    const trendPath = trendValues.length > 0 ? `M ${points}` : 'M 0,100 L 100,100';

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#143B20]">Panel de Administración</h2>
          <span className="bg-[#1E8344] text-white text-xs font-bold px-3 py-1 rounded-full">
            Analítica Global
          </span>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold uppercase tracking-wider">Total Usuarios</p>
              <h3 className="text-4xl font-extrabold text-[#143B20]">{adminStats.totalUsuarios}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EBF7EE] flex items-center justify-center text-[#1E8344]">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold uppercase tracking-wider">Total Reportes</p>
              <h3 className="text-4xl font-extrabold text-[#143B20]">{adminStats.totalReportes}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EBF7EE] flex items-center justify-center text-[#1E8344]">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold uppercase tracking-wider">Pendientes de Validar</p>
              <h3 className="text-4xl font-extrabold text-amber-600">{adminStats.pendientesValidacion}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 md:col-span-8 shadow-sm">
            <h3 className="text-sm font-bold text-[#143B20] mb-6 uppercase tracking-wider">Tendencia de Reportes (30 días)</h3>
            <div className="relative w-full h-48 border-b border-l border-[#E1ECE3]">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Grid lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#F0F6F1" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F0F6F1" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#F0F6F1" strokeWidth="0.5" />
                {/* Data Path */}
                <path d={trendPath} fill="none" stroke="#1E8344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Area under path */}
                <path d={`${trendPath} L 100,100 L 0,100 Z`} fill="url(#trendGradient)" opacity="0.3" />
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E8344" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Severidades Breakdown */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 md:col-span-4 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-[#143B20] mb-4 uppercase tracking-wider">Distribución de Severidad</h3>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {[
                { label: 'Crítica', count: adminStats.severidad.critica, color: 'bg-rose-500' },
                { label: 'Alta', count: adminStats.severidad.alta, color: 'bg-orange-500' },
                { label: 'Media', count: adminStats.severidad.media, color: 'bg-amber-400' },
                { label: 'Baja', count: adminStats.severidad.baja, color: 'bg-emerald-400' }
              ].map(sev => {
                const total = Math.max(adminStats.totalReportes, 1);
                const percent = Math.round((sev.count / total) * 100) || 0;
                return (
                  <div key={sev.label} className="w-full">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#557B5E]">{sev.label}</span>
                      <span className="text-[#143B20]">{sev.count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-[#F0F6F1] rounded-full h-2">
                      <div className={`h-2 rounded-full ${sev.color}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Global Recent Activity Feed vs Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#143B20] mb-4 uppercase tracking-wider">Reportes por Categoría</h3>
            <div className="space-y-4">
              {adminStats.categorias?.map((cat: any) => (
                <div key={cat.nombre} className="flex items-center justify-between p-3 bg-[#FAFDFC] rounded-xl border border-[#F0F6F1]">
                  <span className="text-sm font-bold text-[#143B20]">{cat.nombre}</span>
                  <span className="bg-[#EBF7EE] text-[#1E8344] text-xs font-black px-2 py-1 rounded-md">{cat.conteo}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Feed Global (using global reports list or similar if we fetched it. Since we didn't, we can show a placeholder or global reports passed via props) */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#143B20] uppercase tracking-wider">Últimos del Sistema</h3>
            </div>
            <div className="divide-y divide-[#F0F6F1] flex-1 overflow-y-auto max-h-[300px] pr-2">
              {reports.slice(0,5).map(report => (
                <div key={report.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getIncidentIcon(report.category)}
                    <div>
                      <p className="text-xs font-bold text-[#143B20] truncate w-32 md:w-48">{report.title}</p>
                      <p className="text-[10px] text-[#557B5E]">{report.authorName}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserDashboard = () => {
    if (!userStats) return null;

    const userReports = userStats.reportesRecientes || [];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Profile Card and Impact Index */}
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
                    🛡️ {userStats.nivelRanking}
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
                  onClick={() => navigate('/editar-perfil')}
                  className="text-[#1E8344] font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          </div>

          {/* Environmental Impact Index Card */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 md:col-span-4 flex flex-col justify-between items-center text-center">
            <div className="w-full text-left">
              <span className="text-xs font-bold text-[#55705B] uppercase tracking-wider block">Índice de Impacto</span>
            </div>

            {/* Circular chart visualizer */}
            <div className="relative w-32 h-32 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="#F0F5F2" strokeWidth="10" fill="transparent" />
                <circle 
                  cx="64" cy="64" r="50" 
                  stroke="#05682C" strokeWidth="10" 
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - Math.min(userStats.puntosTotales, 100) / 100)}
                  fill="transparent"
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col justify-center items-center">
                <span className="text-3xl font-extrabold text-[#143B20] leading-none mb-0.5">{userStats.puntosTotales}</span>
                <span className="text-[10px] text-slate-400 font-bold">PTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Triple Stat cards (Middle Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold">Mis Reportes</p>
              <h3 className="text-4xl font-extrabold text-[#143B20] tracking-tight">{userStats.totalReportes}</h3>
            </div>
            <svg className="w-20 h-10 stroke-[#05682C] stroke-2" fill="none">
              <path d="M0,35 Q10,20 20,28 T40,10 T60,32 T80,15" strokeLinecap="round" />
            </svg>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold">Reportes Validados</p>
              <h3 className="text-4xl font-extrabold text-[#143B20] tracking-tight">{userStats.reportesValidados}</h3>
            </div>
            <span className="bg-[#E2F5E0] text-[#143B20] border border-[#BCDCBB] font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
              {userStats.totalReportes > 0 ? Math.round((userStats.reportesValidados / userStats.totalReportes) * 100) : 0}% Tasa
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#DDE7DE] p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <p className="text-xs text-[#557B5E] font-semibold">Aportes a la Comunidad</p>
              <h3 className="text-4xl font-extrabold text-[#143B20] tracking-tight">{userStats.puntosTotales}</h3>
            </div>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white" />
              <div className="w-7 h-7 rounded-full bg-[#143B20] border-2 border-white" />
              <div className="w-7 h-7 rounded-full bg-lime-400 border-2 border-white" />
            </div>
          </div>
        </div>

        {/* User's Recent Actions Feed */}
        <div className="bg-white rounded-3xl border border-[#DDE7DE] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#F0F6F1] flex items-center justify-between">
            <h3 className="text-base font-bold text-[#143B20]">Mi Actividad Reciente</h3>
            <button onClick={() => navigate('/mis-reportes')} className="text-[#1E8344] text-xs font-bold hover:underline">
              Ver todo →
            </button>
          </div>

          <div className="divide-y divide-[#F0F6F1]">
            {userReports.length > 0 ? (
              userReports.map((report: any) => (
                <div 
                  key={report.id}
                  onClick={() => navigate('/reporte/' + report.id)}
                  className="p-5 flex items-center justify-between hover:bg-[#FAFDFC] transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    {getIncidentIcon(report.category || report.title)}
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
                    <div className="hidden sm:flex items-center space-x-1.5 text-xs text-[#557B5E] font-medium">
                      {report.status?.toLowerCase() === 'resuelto' ? (
                        <><ShieldCheck className="w-4 h-4 text-emerald-600" /><span>Acción tomada</span></>
                      ) : report.status?.toLowerCase() === 'validando' ? (
                        <><Clock className="w-4 h-4 text-slate-400" /><span>Esperando datos</span></>
                      ) : (
                        <><Eye className="w-4 h-4 text-slate-400" /><span>{report.views || 0} visualizaciones</span></>
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
                <p className="text-sm text-slate-400">Aún no tienes reportes registrados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F8F4]">
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Activity className="w-8 h-8 animate-spin text-[#1E8344]" />
            <p className="text-sm text-[#557B5E] font-medium animate-pulse">Cargando panel de control...</p>
          </div>
        ) : (
          isAdmin ? renderAdminDashboard() : renderUserDashboard()
        )}
      </main>
    </div>
  );
}
