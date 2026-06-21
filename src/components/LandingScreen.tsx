/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentReport, Contributor } from '../types';
import MapPlaceholder from './MapPlaceholder';
import { getContributores } from '../services/rankingService';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, ShieldCheck, Users, Globe, Trash2, Droplets, Factory, ArrowRight, Award, Target, MapPinOff, X, MapPin, Camera, Eye } from 'lucide-react';

interface LandingScreenProps {
  reports: IncidentReport[];
}

export default function LandingScreen({
  reports,
}: LandingScreenProps) {
  const navigate = useNavigate();
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    getContributores().then(setContributors);
  }, []);

  // Estado para la ubicación
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  // Modal de alerta de permisos de ubicación
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationModalMessage, setLocationModalMessage] = useState('');
  const [locationModalTitle, setLocationModalTitle] = useState('Aviso de Ubicación');
  const [locationModalIcon, setLocationModalIcon] = useState<'error' | 'success'>('error');

  const handleGoToMyCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationModalTitle("Geolocalización No Soportada");
      setLocationModalMessage("Tu navegador no soporta geolocalización. Por favor, intenta usar otro navegador o ingresa la dirección manualmente.");
      setLocationModalIcon("error");
      setShowLocationModal(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationModalTitle("Ubicación Detectada");
        setLocationModalMessage(`Hemos detectado tu ubicación en: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}.`);
        setLocationModalIcon("success");
        setShowLocationModal(true);
        // NOTA: Para que el mapa se mueva, MapPlaceholder necesita recibir 
        // estas coordenadas. Por ahora, esto confirma que el GPS funciona.
      },
      (err) => {
        console.error(err);
        setLocationModalTitle("Permiso de Ubicación Denegado");
        setLocationModalMessage("No pudimos obtener tu ubicación. Asegúrate de otorgar permisos de geolocalización en tu navegador.");
        setLocationModalIcon("error");
        setShowLocationModal(true);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // Recent reports for the landing page grid
  const recentReports = reports.slice(0, 3);

  const getCategoryIcon = (category: string) => {
    const catLow = category.toLowerCase();
    if (catLow.includes('basura') || catLow.includes('residuo')) {
      return <Trash2 className="w-4 h-4 text-[#DC2626]" />;
    }
    if (catLow.includes('agua')) {
      return <Droplets className="w-4 h-4 text-sky-600" />;
    }
    if (catLow.includes('tala') || catLow.includes('verde')) {
      return (
        <svg className="w-4 h-4 fill-[#059669]" viewBox="0 0 24 24">
          <path d="M12 2L4 18h6v4h4v-4h6L12 2z" />
        </svg>
      );
    }
    return <Factory className="w-4 h-4 text-[#2563EB]" />;
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
                onClick={() => navigate('/reportar')}
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
          <div id="map" className="lg:col-span-7 flex flex-col space-y-4 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#143B20] tracking-wider uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#1E8344]" />
                <span>Casos Activos Georreferenciados</span>
              </h2>
              <span className="text-xs text-[#557B5E] font-mono">En vivo</span>
            </div>

            <MapPlaceholder reports={reports} />
          </div>
        </div>
      </section>

      {/* Grid: Ciclo de Acción de Terranova Tech */}
      <section className="bg-white py-8 border-b border-[#E1ECE3] px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Paso 1 */}
          <div className="flex items-center space-x-3.5 lg:border-r border-[#E1ECE3] lg:last:border-none p-2 align-middle">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#143B20] leading-dense">1. Documenta</p>
              <p className="text-xs text-[#557B5E] font-medium mt-0.5">Evidencia fotográfica</p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-center space-x-3.5 lg:border-r border-[#E1ECE3] lg:last:border-none p-2 align-middle">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#143B20] leading-dense">2. Localiza</p>
              <p className="text-xs text-[#557B5E] font-medium mt-0.5">Coordenadas en el mapa</p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-center space-x-3.5 lg:border-r border-[#E1ECE3] lg:last:border-none p-2 align-middle">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#143B20] leading-dense">3. Visibiliza</p>
              <p className="text-xs text-[#557B5E] font-medium mt-0.5">Datos transparentes</p>
            </div>
          </div>

          {/* Paso 4 */}
          <div className="flex items-center space-x-3.5 lg:last:border-none p-2 align-middle">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EBF7EE] border border-[#CBDCD0] flex items-center justify-center text-[#1E8344]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#143B20] leading-dense">4. Actúa</p>
              <p className="text-xs text-[#557B5E] font-medium mt-0.5">Acción con autoridades</p>
            </div>
          </div>

        </div>
      </section>
      {/* Split Details Section */}
      <section className="px-4 py-12 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#12301A] font-sans tracking-tight">Reportes recientes</h3>
            <button
              onClick={() => navigate('/reportes')}
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
                onClick={() => navigate('/reporte/' + report.id)}
                className="p-4 sm:p-5 flex items-start space-x-3 sm:space-x-4 hover:bg-[#FAFDFC] transition-all cursor-pointer group"
              >
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-[#C5DDCB] flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1 shrink-0">
                      {getCategoryIcon(report.category)}
                      <span className="text-[11px] font-bold text-[#557C5E] uppercase bg-[#F0F6F1] px-2 py-0.5 rounded-full tracking-wider">
                        {report.category}
                      </span>
                    </div>
                    {/* Inline severity badge for mobile devices */}
                    <span className={`sm:hidden text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-tight ${getSeverityBadgeClass(report.severity)}`}>
                      {report.severity.replace(' Severidad', '')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {report.timeAgo}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#143B20] mt-1 line-clamp-1 group-hover:text-[#1E8344] transition-colors">
                    {report.title}
                  </h4>
                  <p className="text-xs text-[#557B5E] mt-0.5 font-medium">📍 {report.location}</p>
                </div>
                {/* Desktop-only right side severity badge */}
                <span className={`hidden sm:inline-block text-[10px] font-bold px-2.5 py-1 border rounded-full uppercase tracking-tight ${getSeverityBadgeClass(report.severity)}`}>
                  {report.severity.replace(' Severidad', '')}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#12301A] font-sans tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C49B2F]" />
              <span>Top contribuidores</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard')}
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
                <div className="flex items-center space-x-3">
                  <span className={`text-base font-black italic w-6 text-center ${index === 0 ? 'text-[#C49B2F]' : index === 1 ? 'text-[#778B8D]' : 'text-[#A07044]'
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
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-[#557B5E] font-medium">Investigador Ciudadano</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#143B20] tracking-tight">{contrib.points.toLocaleString()}</span>
                  <span className="text-[10px] text-[#557B5E] font-bold block leading-none">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1F10]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-[#CDE1D1]"
            >
              <div className="bg-gradient-to-tr from-[#E1ECE3] to-[#F3FAF4] p-6 text-center border-b border-[#CDE1D1] relative">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="absolute top-4 right-4 p-1 rounded-full text-[#557B5E] hover:bg-white hover:text-[#143B20] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm border border-[#CDE1D1] mb-4">
                  {locationModalIcon === 'error' ? (
                    <MapPinOff className="w-8 h-8 text-[#E84C3D]" />
                  ) : (
                    <MapPin className="w-8 h-8 text-[#1E8344]" />
                  )}
                </div>
                <h3 className="text-xl font-black text-[#143B20] tracking-tight">{locationModalTitle}</h3>
              </div>
              <div className="p-8 text-center space-y-6">
                <p className="text-sm text-[#4F6C56] font-medium leading-relaxed">
                  {locationModalMessage}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="w-full bg-[#1E8344] hover:bg-[#166634] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
