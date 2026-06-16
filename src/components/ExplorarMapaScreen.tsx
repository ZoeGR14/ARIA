/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentReport } from '../types';
import MapPlaceholder from './MapPlaceholder';
import { Target, MapPin, Compass, Info, ShieldCheck } from 'lucide-react';

interface ExplorarMapaScreenProps {
  reports: IncidentReport[];
  onReportLocation?: (address: string, coordinates: string) => void;
}

export default function ExplorarMapaScreen({
  reports,
  onReportLocation,
}: ExplorarMapaScreenProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FAFDF9] py-8 px-4 md:px-8 min-h-[calc(100vh-68px)]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#1E8344]">
            <Compass className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Geolocalización en Tiempo Real</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight">Explorar Mapa de Incidencias</h1>
          <p className="text-sm text-[#4F6C56] leading-relaxed max-w-3xl">
            Visualiza las alertas y denuncias ecológicas georreferenciadas en el cuadrante metropolitano. Utiliza los controles para hacer zoom, arrastrar el blueprint interactivo, o presionar un pin para desplegar su ficha de detalles.
          </p>
        </div>

        {/* Outer Grid Layout containing Map and Sidebar Legend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Detailed Interactive Map Box */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-[#DDE7DE] p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 px-2 border-b border-[#F0F5F1] mb-4">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-[#143B20] font-bold">Mapa interactivo activo (Basemap v2)</span>
              </div>
              <div className="text-[10px] font-mono bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                PROYECCIÓN: MERCATOR WEB
              </div>
            </div>
            
            <MapPlaceholder
              reports={reports}
              onReportLocation={onReportLocation}
            />
          </div>

          {/* Quick Legend & Help Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Map Legend card */}
            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-[#143B20] uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-[#1E8344]" />
                <span>Simbología</span>
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#DC2626] border border-[#EF4444] text-white flex items-center justify-center text-[10px] font-bold">🗑️</div>
                  <div className="text-xs font-semibold text-[#143B20]">
                    <p className="font-extrabold">Acumulación de Basura</p>
                    <p className="text-[10px] text-red-600">Prioridad Alta / Crítica</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F97316] border border-[#FB923C] text-white flex items-center justify-center text-[10px] font-bold">💧</div>
                  <div className="text-xs font-semibold text-[#143B20]">
                    <p className="font-extrabold">Fuga de Agua</p>
                    <p className="text-[10px] text-amber-600">Severidad Media</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2563EB] border border-[#60A5FA] text-white flex items-center justify-center text-[10px] font-bold">🏭</div>
                  <div className="text-xs font-semibold text-[#143B20]">
                    <p className="font-extrabold">Contaminación del Aire</p>
                    <p className="text-[10px] text-blue-600">Severidad Alta</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B5CF6] border border-[#A78BFA] text-white flex items-center justify-center text-[10px] font-bold font-mono">🌳</div>
                  <div className="text-xs font-semibold text-[#143B20]">
                    <p className="font-extrabold">Tala Ilegal / Áreas Verdes</p>
                    <p className="text-[10px] text-violet-600">Conservación</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#EBF7EE] border border-[#CDE1D1] rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-black text-[#143B20] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#1E8344]" />
                <span>Instrucciones</span>
              </h4>
              <ul className="text-xs text-[#304B37] space-y-2 list-none pl-0 leading-relaxed font-semibold">
                <li className="flex gap-1.5">
                  <span>🗺️</span>
                  <span><strong>Arrastra el mapa</strong> en cualquier dirección con el cursor para navegar la retícula urbana.</span>
                </li>
                <li className="flex gap-1.5">
                  <span>🔍</span>
                  <span>Usa los <strong>controles de zoom (+/-)</strong> en la parte inferior izquierda si deseas ampliar un sector.</span>
                </li>
                <li className="flex gap-1.5">
                  <span>🔘</span>
                  <span>Presiona cualquier indicador coloreado para abrir su ficha lateral y ver la síntesis del reporte o acceder a sus detalles.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
