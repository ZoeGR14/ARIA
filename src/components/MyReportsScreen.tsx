/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentReport } from '../types';
import { Trash2, Droplets, Wind, MapPin, Calendar, PlusCircle, ArrowRight, Eye, MessageSquare, FileText } from 'lucide-react';

interface MyReportsScreenProps {
  reports: IncidentReport[];
  userProfile: {
    name: string;
    avatar: string;
    role: string;
    level: string;
  };
}

export default function MyReportsScreen({
  reports,
  userProfile,
}: MyReportsScreenProps) {
  const navigate = useNavigate();
  // Filter reports specifically created by Carlos Mendoza (or logged in user)
  const myReports = useMemo(() => {
    return reports.filter((report) => report.authorName === userProfile.name);
  }, [reports, userProfile]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'descartado':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'en revisión':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'atendido':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'recibido':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('residuo')) {
      return <Trash2 className="w-4 h-4 text-[#C2410C]" />;
    }
    if (category.toLowerCase().includes('agua')) {
      return <Droplets className="w-4 h-4 text-sky-600" />;
    }
    return <Wind className="w-4 h-4 text-[#0F766E]" />;
  };

  return (
    <div className="bg-[#FAFDF9] py-8 px-4 md:px-8 min-h-[calc(100vh-68px)]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight">Mis Reportes</h1>
            <p className="text-sm text-[#4F6C56]">
              Aquí puedes ver, editar y hacer seguimiento de las incidencias ambientales que has reportado.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/reportar')}
            className="self-start sm:self-auto bg-[#05682C] text-white font-bold py-3 px-5 rounded-full hover:bg-[#045524] transition-colors flex items-center space-x-2 text-xs shadow-md shadow-[#05682C]/10 cursor-pointer"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>Nuevo Reporte</span>
          </button>
        </div>

        {/* Impact Summary Section */}
        <div className="bg-[#EBF7EE] border border-[#CDE1D1] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-extrabold text-[#143B20] text-base">{userProfile.name}</h3>
              <p className="text-xs text-[#557B5E] font-bold mt-0.5">{userProfile.level}</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#DDE7DE] flex-1 md:flex-initial text-center md:text-left min-w-[120px]">
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">Reportados</span>
              <span className="text-2xl font-black text-[#143B20] mt-1 block">{myReports.length}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#DDE7DE] flex-1 md:flex-initial text-center md:text-left min-w-[120px]">
              <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">Resueltos</span>
              <span className="text-2xl font-black text-[#1E8344] mt-1 block">
                {myReports.filter(r => r.status.toLowerCase() === 'resuelto').length}
              </span>
            </div>
          </div>
        </div>

        {/* Reports Content List */}
        {myReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {myReports.map((report) => (
              <div 
                key={report.id}
                className="bg-white rounded-3xl border border-[#DDE7DE] p-5 hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
              >
                {/* Photo */}
                <div className="w-full md:w-44 h-32 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={report.imageUrl} 
                    alt={report.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-mono tracking-widest font-black text-[#143B20] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                    {report.id}
                  </span>
                </div>

                {/* Info and action */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category icon tag */}
                      <span className="inline-flex items-center gap-1 bg-[#F3FAF4] text-[#143B20] border border-[#CDE1D1] text-[10px] font-black py-0.5 px-2 rounded-full uppercase tracking-wider">
                        {getCategoryIcon(report.category)}
                        <span>{report.category}</span>
                      </span>

                      {/* Status badge */}
                      <span className={`inline-block border text-[10.5px] font-bold py-0.5 px-2.5 rounded-full ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#143B20] leading-tight hover:text-[#1E8344] transition-colors">
                      {report.title}
                    </h3>

                    <p className="text-xs text-[#557B5E] max-w-2xl line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-dashed border-[#E1ECE3] mt-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#557B5E] font-bold">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span className="truncate max-w-[200px]">{report.location}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{report.date}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => navigate('/reporte/' + report.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-[#1E8344] hover:text-[#143B20] transition-colors cursor-pointer"
                    >
                      <span>Ver Detalles</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F3FAF4] rounded-full flex items-center justify-center mx-auto border border-[#CDE1D1]">
              <FileText className="w-8 h-8 text-[#1E8344]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#143B20]">No tienes incidencias registradas</h3>
            <p className="text-xs text-[#557B5E] max-w-md mx-auto">
              Aún no has enviado ningún reporte ambiental. ¡Sé un agente de cambio y reporta tu primera incidencia ahora mismo!
            </p>
            <button
              onClick={() => navigate('/reportar')}
              className="bg-[#05682C] text-white hover:bg-[#045524] transition-colors font-bold py-3 px-6 rounded-full text-xs shadow-md mt-2 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Crear mi primer reporte</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
