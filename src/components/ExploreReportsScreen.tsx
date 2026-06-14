/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentReport, ReportCategory } from '../types';
import { Trash2, Droplets, Wind, Search, MapPin, Calendar, Filter, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface ExploreReportsScreenProps {
  reports: IncidentReport[];
}

export default function ExploreReportsScreen({
  reports,
}: ExploreReportsScreenProps) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  // Filter dropdown selections
  const statuses = ['Todos', 'Abierto', 'En progreso', 'Resuelto', 'Validando'];
  const categories = ['Todas', 'Residuos', 'Agua', 'Calidad del Aire'];

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Status filter matching
      const statusMatch = selectedStatus === 'Todos' || 
        report.status.toLowerCase() === selectedStatus.toLowerCase() ||
        (selectedStatus === 'En progreso' && report.status === 'En Progreso');
      
      // Category filter matching
      const categoryMatch = selectedCategory === 'Todas' || 
        report.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Agua' && report.category.toLowerCase().includes('agua'));

      // Search match
      const queryMatch = !searchQuery.trim() ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && categoryMatch && queryMatch;
    });
  }, [reports, selectedStatus, selectedCategory, searchQuery]);

  // Pagination setups - let's set 3 items per page to showcase pagination nicely
  const itemsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  
  const paginatedReports = useMemo(() => {
    const start = (currentPageNum - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPageNum]);

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPageNum(pageNum);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'abierto':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'en progreso':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'resuelto':
        return 'bg-emerald-100 text-emerald-700 border-[#98D4A4]';
      case 'validando':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    if (severity.toLowerCase().includes('alta')) {
      return 'bg-slate-900/80 text-white';
    }
    if (severity.toLowerCase().includes('media')) {
      return 'bg-slate-700/80 text-white';
    }
    return 'bg-slate-500/80 text-white';
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title introducing exploration grids (matching Screen 7 heading) */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight">Explorar Reportes</h1>
          <p className="text-sm text-[#4F6C56] leading-relaxed max-w-3xl">
            Revisa y da seguimiento a las incidencias ambientales reportadas por la comunidad. Filtra por estado o categoría para encontrar información específica.
          </p>
        </div>

        {/* Filters and Search Utility Bar (exactly styled double dropdowns of Screen 7) */}
        <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Default Selector Status */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider pl-1">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full bg-[#F3FAF4] border border-[#CDE1D1] text-[#143B20] text-xs font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E8344]/15 cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23143B20' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 16px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Default Selector Category */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider pl-1">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full bg-[#F3FAF4] border border-[#CDE1D1] text-[#143B20] text-xs font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E8344]/15 cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23143B20' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 16px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Large text search bar */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider pl-1">
              Búsqueda por palabras claves
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Buscar reporte..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPageNum(1);
                }}
                className="w-full bg-[#F3FAF4] border border-[#CDE1D1] text-xs font-semibold rounded-xl py-3 pl-11 pr-4 text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/15 focus:border-[#1E8344]"
              />
            </div>
          </div>
        </div>

        {/* Grid Lists items (exactly as depicted on Screen 7 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedReports.length > 0 ? (
            paginatedReports.map((report) => (
              <div 
                key={report.id}
                onClick={() => navigate('/reporte/' + report.id)}
                className="bg-white rounded-3xl border border-[#DDE7DE] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all h-[420px] group cursor-pointer"
              >
                {/* Upper thumbnail with float severity tag */}
                <div className="relative h-48 overflow-hidden bg-slate-100 flex-shrink-0">
                  <img 
                    src={report.imageUrl} 
                    alt={report.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Severity badge floating right top (e.g. Alta Severidad) */}
                  <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide shadow-xs backdrop-blur-xs ${getSeverityBadgeClass(report.severity)}`}>
                    {report.severity}
                  </span>
                </div>

                {/* Info and status panel */}
                <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-4">
                    
                    {/* Status item blocks (Matches Screen 7 grid header) */}
                    <div className="flex items-center justify-between text-xs font-bold flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] uppercase font-bold ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                      
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        {getCategoryIcon(report.category)}
                        <span className="text-[10px] uppercase tracking-wider text-[#55705B]">
                          {report.category}
                        </span>
                      </div>
                    </div>

                    {/* Title and details block */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-[#143B20] leading-snug line-clamp-2 group-hover:text-[#1E8344] transition-colors">
                        {report.title}
                      </h3>
                      
                      {/* Physical parameters details */}
                      <div className="mt-2 text-xs text-[#557B5E] space-y-1 leading-none font-medium">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{report.location}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{report.date}</span>
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Quick inspector action link */}
                  <div className="pt-4 border-t border-[#F0F6F1] flex items-center justify-between mt-4">
                    <button
                      onClick={() => navigate('/reporte/' + report.id)}
                      className="text-[#05682C] text-xs font-extrabold hover:text-[#045524] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Ver detalle</span>
                      <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </button>
                    
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{report.id.split('-').pop()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white border border-[#DDE7DE] rounded-3xl p-16 text-center shadow-xs">
              <HelpCircle className="w-12 h-12 text-[#557B5E] mx-auto opacity-40 mb-3" />
              <h3 className="text-base font-bold text-[#143B20]">No encontramos resultados</h3>
              <p className="text-xs text-[#557B5E] mt-1 max-w-md mx-auto">
                No hay incidencias reportadas que coincidan exactamente con tus filtros. Intenta cambiando el estado o el término de búsqueda.
              </p>
              <button
                onClick={() => {
                  setSelectedStatus('Todos');
                  setSelectedCategory('Todas');
                  setSearchQuery('');
                  setCurrentPageNum(1);
                }}
                className="mt-4 bg-[#1E8344] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Pagination controls below (Matches Screen 7 paginator exactly) */}
        {filteredReports.length > itemsPerPage && (
          <div className="flex items-center justify-center space-x-2 pt-6 border-t border-[#E1ECE3] select-none text-sm font-semibold text-[#557B5E]">
            <button
              onClick={() => handlePageChange(currentPageNum - 1)}
              disabled={currentPageNum === 1}
              className="p-2 border border-[#CDE1D1] rounded-xl bg-white hover:bg-[#F3FAF4] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              const isSelected = page === currentPageNum;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#1E8344] text-white border-[#1E8344] font-bold shadow-md shadow-[#1E8344]/10' 
                      : 'bg-white text-[#4F6C56] border-[#CDE1D1] hover:bg-[#F3FAF4]'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPageNum + 1)}
              disabled={currentPageNum === totalPages}
              className="p-2 border border-[#CDE1D1] rounded-xl bg-white hover:bg-[#F3FAF4] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
