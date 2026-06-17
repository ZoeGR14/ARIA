/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentReport, ReportCategory } from '../types';
import {
  Trash2, Droplets, Wind, Search, MapPin, Target, Send, Image as ImageIcon,
  CheckCircle, Loader2, Compass, MapPinOff, AlertTriangle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { crearReporte } from '../services/reportesService';
const SUGGESTIONS = [
  {
    address: 'Calle Querétaro 112, Col. Roma Norte, Alcaldía Cuauhtémoc, C.P. 06700, CDMX',
    coordinates: '19.4150 N, 99.1620 W',
    title: 'Colonia Roma Norte / Calle Querétaro',
    coords: [19.4150, -99.1620] as [number, number],
  },
  {
    address: 'Av. Coyoacán 1450, Col. Del Valle Centro, Alcaldía Benito Juárez, C.P. 03100, CDMX',
    coordinates: '19.3800 N, 99.1700 W',
    title: 'Colonia Del Valle Centro / Av. Coyoacán',
    coords: [19.3800, -99.1700] as [number, number],
  },
  {
    address: 'Calz. de Guadalupe 410, Col. Industrial, Alcaldía Gustavo A. Madero, C.P. 07800, CDMX',
    coordinates: '19.4750 N, 99.1250 W',
    title: 'Colonia Industrial / Calzada de Guadalupe',
    coords: [19.4750, -99.1250] as [number, number],
  },
  {
    address: 'Av. Horacio 1500, Col. Polanco, Alcaldía Miguel Hidalgo, C.P. 11560, CDMX',
    coordinates: '19.4329 N, 99.2010 W',
    title: 'Colonia Polanco / Avenida Horacio',
    coords: [19.4329, -99.2010] as [number, number],
  },
  {
    address: 'Plaza de la Constitución S/N, Col. Centro, Alcaldía Cuauhtémoc, C.P. 06000, CDMX',
    coordinates: '19.4326 N, 99.1332 W',
    title: 'Centro Histórico / Plaza de la Constitución',
    coords: [19.4326, -99.1332] as [number, number],
  },
  {
    address: 'Paseo de la Reforma 222, Col. Juárez, Alcaldía Cuauhtémoc, C.P. 06600, CDMX',
    coordinates: '19.4273 N, 99.1676 W',
    title: 'Paseo de la Reforma / El Ángel',
    coords: [19.4273, -99.1676] as [number, number],
  },
  {
    address: 'Av. Universidad 3000, Coyoacán, Ciudad Universitaria, C.P. 04510, CDMX',
    coordinates: '19.3328 N, 99.1856 W',
    title: 'Ciudad Universitaria / UNAM Coyoacán',
    coords: [19.3328, -99.1856] as [number, number],
  }
];

interface ReportFormScreenProps {
  onAddReport: (newReport: IncidentReport) => void;
  currentUser: {
    name: string;
    avatar: string;
    role: string;
  };
  prefilledLocation?: { address: string; coordinates: string } | null;
  onClearPrefilledLocation?: () => void;
}

export default function ReportFormScreen({
  onAddReport,
  currentUser,
  prefilledLocation,
  onClearPrefilledLocation,
}: ReportFormScreenProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ReportCategory>('Acumulación de Basura');
  const [severity, setSeverity] = useState<'Baja' | 'Media' | 'Alta' | 'Critica'>('Media');
  const [address, setAddress] = useState(prefilledLocation?.address || '');
  const [description, setDescription] = useState('');
  const [localCoordinates, setLocalCoordinates] = useState(prefilledLocation?.coordinates || '19.4150 N, 99.1620 W');
  const [isLocating, setIsLocating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Estado para guardar el archivo real para enviarlo por fetch
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<typeof SUGGESTIONS>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

  // Modal de alertas generales (ubicación, éxito, errores)
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationModalMessage, setLocationModalMessage] = useState('');
  const [locationModalTitle, setLocationModalTitle] = useState('Aviso de Ubicación');
  const [locationModalIcon, setLocationModalIcon] = useState<'error' | 'success'>('error');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const categories: { id: ReportCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'Acumulación de Basura',
      label: 'Acumulación de Basura',
      icon: <Trash2 className="w-6 h-6" />,
      desc: 'Basura acumulada, vertederos clandestinos, residuos tóxicos.'
    },
    {
      id: 'Fuga de Agua',
      label: 'Fuga de Agua',
      icon: <Droplets className="w-6 h-6" />,
      desc: 'Fugas de agua potable, tuberías rotas o desperdicio masivo.'
    },
    {
      id: 'Tala Ilegal / Áreas Verdes',
      label: 'Tala Ilegal / Áreas Verdes',
      icon: <Compass className="w-6 h-6" />,
      desc: 'Tala de árboles no autorizada o daño severo a parques.'
    },
    {
      id: 'Contaminación del Aire',
      label: 'Contaminación del Aire',
      icon: <Wind className="w-6 h-6" />,
      desc: 'Emisiones de humo negro, gases tóxicos o quema de basura.'
    },
  ];

  const parseCoordinatesStr = (str: string): [number, number] => {
    try {
      const cleaned = str.replace(/[^\d.-]/g, ' ').trim().split(/\s+/);
      const lat = parseFloat(cleaned[0]);
      let lng = parseFloat(cleaned[1]);
      if (str.toLowerCase().includes('w')) {
        lng = -Math.abs(lng);
      }
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    } catch (e) {
      // Ignore
    }
    return [19.4150, -99.1620];
  };

  useEffect(() => {
    if (prefilledLocation) {
      setAddress(prefilledLocation.address);
      setLocalCoordinates(prefilledLocation.coordinates);

      if (onClearPrefilledLocation) {
        onClearPrefilledLocation();
      }
    }
  }, [prefilledLocation]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCoords = parseCoordinatesStr(localCoordinates);
    const map = L.map(mapContainerRef.current, {
      center: initialCoords,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    const needleHtml = `
      <div class="relative w-10 h-10 flex items-center justify-center">
        <div class="absolute -inset-1 rounded-full bg-[#EA4335]/25 animate-ping" style="animation-duration: 2s;"></div>
        <div class="w-8 h-8 rounded-full bg-[#EA4335] shadow-lg flex items-center justify-center border-2 border-white">
          <span class="text-white text-xs select-none">📍</span>
        </div>
        <div class="absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-[#EA4335]"></div>
      </div>
    `;

    const customPinIcon = L.divIcon({
      html: needleHtml,
      className: 'form-google-marker-class',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker(initialCoords, {
      icon: customPinIcon,
      draggable: true
    }).addTo(map);

    const updateLocationFromCoords = (lat: number, lng: number) => {
      const formattedCoords = `${lat.toFixed(6)} N, ${Math.abs(lng).toFixed(6)} W`;
      setLocalCoordinates(formattedCoords);

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
        headers: {
          'Accept-Language': 'es'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(err => {
          console.warn('Reverse geocoding error:', err);
        });
    };

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      updateLocationFromCoords(position.lat, position.lng);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const position = e.latlng;
      marker.setLatLng(position);
      updateLocationFromCoords(position.lat, position.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const coords = parseCoordinatesStr(localCoordinates);
    const currentMarkerCoords = marker.getLatLng();
    const distanceThreshold = 0.0001;
    const diffLat = Math.abs(currentMarkerCoords.lat - coords[0]);
    const diffLng = Math.abs(currentMarkerCoords.lng - coords[1]);

    if (diffLat > distanceThreshold || diffLng > distanceThreshold) {
      map.setView(coords, 14, { animate: true, duration: 0.8 });
      marker.setLatLng(coords);
    }
  }, [localCoordinates]);

  const handleAddressTextChange = (val: string) => {
    setAddress(val);
    setShowSuggestions(val.trim().length > 1);
  };

  const fetchNominatimQuery = async (queryText: string) => {
    if (queryText.trim().length <= 2) {
      setDynamicSuggestions([]);
      return;
    }

    setIsSearchingSuggestions(true);
    try {
      const isCdmx = queryText.toLowerCase().includes('cdmx') || queryText.toLowerCase().includes('mexico');
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText + (isCdmx ? '' : ', CDMX, Mexico'))}&limit=5&addressdetails=1`;

      const response = await fetch(searchUrl, {
        headers: {
          'Accept-Language': 'es'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((item: any) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          return {
            address: item.display_name,
            coordinates: `${lat.toFixed(6)} N, ${Math.abs(lon).toFixed(6)} W`,
            title: item.name || item.display_name.split(',')[0],
            coords: [lat, lon] as [number, number]
          };
        });
        setDynamicSuggestions(mapped);
      }
    } catch (error) {
      console.warn('Nominatim autocomplete error:', error);
    } finally {
      setIsSearchingSuggestions(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (address.trim().length > 2 && showSuggestions) {
        const isMatchedOption = SUGGESTIONS.some(s => s.address === address) || dynamicSuggestions.some(s => s.address === address);
        if (!isMatchedOption) {
          fetchNominatimQuery(address);
        }
      } else {
        setDynamicSuggestions([]);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  const handleSelectSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setAddress(s.address);
    setLocalCoordinates(s.coordinates);
    setShowSuggestions(false);
  };


  //  GPS NATIVO

  const handleMyLocation = () => {
    setIsLocating(true);
    setAddress('Buscando señal de satélite GPS...');

    if (!navigator.geolocation) {
      setLocationModalTitle("Geolocalización No Soportada");
      setLocationModalMessage("Tu navegador no soporta geolocalización. Por favor, intenta usar otro navegador o ingresa la dirección manualmente.");
      setLocationModalIcon("error");
      setShowLocationModal(true);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const formattedCoords = `${lat.toFixed(6)} N, ${Math.abs(lng).toFixed(6)} W`;

        setLocalCoordinates(formattedCoords);

        // Hacemos reverse geocoding para que también actualice el texto de la calle
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
          headers: { 'Accept-Language': 'es' }
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress(`Ubicación GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          })
          .catch(() => setAddress(`Ubicación GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`))
          .finally(() => setIsLocating(false));
      },
      (error) => {
        console.error("Error GPS:", error);
        setLocationModalTitle("Permiso de Ubicación Denegado");
        setLocationModalMessage("No pudimos obtener tu ubicación real. Asegúrate de otorgar permisos de geolocalización en tu navegador para usar esta función.");
        setLocationModalIcon("error");
        setShowLocationModal(true);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };


  // VALIDACIÓN ESTRICA Y GUARDADO DE ARCHIVOS

  const processFile = (file: File) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setLocationModalTitle("Formato no Válido");
      setLocationModalMessage("Solo se aceptan archivos en formato JPEG o PNG.");
      setLocationModalIcon("error");
      setShowLocationModal(true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocationModalTitle("Archivo muy Grande");
      setLocationModalMessage("El archivo supera el límite de 5MB permitidos.");
      setLocationModalIcon("error");
      setShowLocationModal(true);
      return;
    }

    setRawFile(file); // Guardamos el File real para el FormData

    // Generamos la miniatura visual para la UI
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // ------------------------------------------------------------------
  // PARCHE PARA EL ERROR 500 (NOT NULL VIOLATION)
  // ------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (!rawFile) {
      setLocationModalTitle("Fotografía Obligatoria");
      setLocationModalMessage("Es estrictamente necesario adjuntar una evidencia fotográfica para poder enviar tu reporte ambiental.");
      setLocationModalIcon("error");
      setShowLocationModal(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('descripcion', description);

    // AQUÍ ESTÁ EL PARCHE: Forzamos el envío de un valor válido aunque esté vacío
    let catId = '1';
    if (category === 'Fuga de Agua') catId = '2';
    else if (category === 'Tala Ilegal / Áreas Verdes') catId = '3';
    else if (category === 'Contaminación del Aire') catId = '4';

    formData.append('categoria_id', catId);
    formData.append('subcategoria_id', '1');
    formData.append('severidad', severity);

    const [latVal, lngVal] = parseCoordinatesStr(localCoordinates);
    formData.append('latitude', latVal.toString());
    formData.append('longitude', lngVal.toString());

    if (rawFile) {
      formData.append('foto', rawFile);
    }

    try {
      const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token') || '';
      const dataDelBackend = await crearReporte(formData, token);

      console.log("¡Reporte guardado en BD!", dataDelBackend);
      setLocationModalTitle("¡Reporte Enviado!");
      setLocationModalMessage("Tu reporte ha sido enviado y guardado exitosamente.");
      setLocationModalIcon("success");
      setShowLocationModal(true);

      const newId = dataDelBackend.id || `ENV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const reportImage = uploadedImage || (
        category === 'Acumulación de Basura'
          ? 'https://plus.unsplash.com/premium_photo-1661962386121-7221f7ed43ff?auto=format&fit=crop&w=600&q=80'
          : category === 'Fuga de Agua'
            ? 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80'
      );

      const computedReport: IncidentReport = {
        id: newId,
        title: `${category} - ${address.split(',')[0] || 'Nueva Ubicación'}`,
        description: description.substring(0, 100) + '...',
        detailedDescription: description,
        category: category,
        severity: severity,
        status: 'Recibido',
        location: address || 'Zona Metropolitana Central',
        coordinates: localCoordinates,
        latitude: latVal,
        longitude: lngVal,
        puntos_asignados: 0,
        estado_puntos: 'Pendiente',
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        timeAgo: 'Hace unos instantes',
        views: 1,
        imageUrl: reportImage,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.role,
        severityIndex: 5.0,
        impactedUsers: 10,
        timeline: {
          received: { date: 'Hoy, Recién ingresado', checked: true },
          reviewing: { note: 'Pendiente de asignación de autoridad', checked: false },
          resolved: { checked: false }
        },
        comments: []
      };

      onAddReport(computedReport);

      setTimeout(() => {
        navigate('/mis-reportes');
      }, 2000);

    } catch (error) {
      console.error("Error de envío:", error);
      setLocationModalTitle("Error de Envío");
      setLocationModalMessage("Hubo un problema conectando con el servidor. Por favor, intenta de nuevo.");
      setLocationModalIcon("error");
      setShowLocationModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-[#FAFDF9] py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight">Reportar incidencia</h1>
          <p className="text-sm text-[#4F6C56] leading-relaxed">
            Proporciona los detalles del problema ambiental para que nuestro equipo pueda verificarlo y actuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Categories Option Buttons (Screenshots card items exactly) */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#143B20] uppercase tracking-wider">
              1. Categoría del Problema
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center space-y-3 transition-all cursor-pointer ${isSelected
                      ? 'bg-[#EBF7EE] border-[#1E8344] text-[#1E8344] ring-2 ring-[#1E8344]/10'
                      : 'bg-[#FAFDFC] border-[#CDE1D1] hover:border-[#1E8344]/50 text-[#557B5E]'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[#1E8344] text-white' : 'bg-[#EDF2EE] text-[#557B5E]'
                      }`}>
                      {cat.icon}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold block">{cat.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-normal leading-dense hidden sm:block max-w-[150px]">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0F6F1] space-y-1.5">
              <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block mb-2">
                Nivel de Severidad
              </label>
              <div className="flex gap-2">
                {['Baja', 'Media', 'Alta', 'Critica'].map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev as any)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${severity === sev
                      ? (sev === 'Critica' || sev === 'Alta' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-[#1E8344] border-[#1E8344] text-white')
                      : 'bg-white border-[#CDE1D1] text-[#557B5E] hover:bg-slate-50'
                      }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Location Map Frame Overlay with Real Leaflet Map Interface */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#143B20] uppercase tracking-wider">
                2. Ubicación Exacta CDMX
              </h3>
              <div className="text-[10px] font-mono font-black text-[#1E8344] bg-[#EBF7EE] px-2 py-0.5 rounded-md">
                COORD: {localCoordinates}
              </div>
            </div>

            {/* Embedded Live Interactive Leaflet Map Pointer */}
            <div className="relative h-64 rounded-2xl border border-[#CBDCD0] overflow-hidden bg-[#FAFDF9] shadow-inner">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Compass Watermark Badge */}
              <div className="absolute right-3 bottom-3 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#CBDCD0]/60 shadow-sm flex items-center space-x-1.5 pointer-events-none">
                <Compass className="w-3.5 h-3.5 text-[#1E8344]" />
                <span className="text-[9px] font-black text-[#143B20] uppercase tracking-wider">Sincronizado</span>
              </div>
            </div>

            {/* Inputs & Custom Google Maps Autocomplete Search Dropdown */}
            <div className="space-y-2 relative">
              <div className="flex flex-col sm:flex-row gap-2 relative z-30">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#557B5E]">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Escribe para buscar colonia o dirección..."
                    value={address}
                    onChange={(e) => handleAddressTextChange(e.target.value)}
                    onFocus={() => {
                      if (address.trim().length > 1) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344] transition-all"
                  />

                  {/* Floating suggestions dropdown list */}
                  {showSuggestions && (
                    <div className="absolute top-13 left-0 right-0 bg-white border border-[#CBDCD0] shadow-2xl rounded-2xl overflow-hidden z-50 animate-slide-up max-h-64 overflow-y-auto">
                      {/* Loading indicator */}
                      {isSearchingSuggestions && (
                        <div className="bg-[#FAFDF9] px-4 py-2.5 border-b border-[#CBDCD0]/30 flex items-center justify-between text-[10px] font-black uppercase text-[#1E8344] tracking-wider">
                          <span>Buscando vía OpenStreetMap...</span>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      )}

                      {/* Offline Default suggestions */}
                      {SUGGESTIONS.filter(item =>
                        item.address.toLowerCase().includes(address.toLowerCase()) ||
                        item.title.toLowerCase().includes(address.toLowerCase())
                      ).length > 0 && (
                          <>
                            <div className="bg-[#FAFDF9] px-4 py-1.5 border-b border-[#CBDCD0]/50 text-[9px] font-black uppercase text-[#557B5E] tracking-wider">
                              Puntos de Interés CDMX Guardados
                            </div>
                            {SUGGESTIONS.filter(item =>
                              item.address.toLowerCase().includes(address.toLowerCase()) ||
                              item.title.toLowerCase().includes(address.toLowerCase())
                            ).map((s, idx) => (
                              <button
                                key={`static-${idx}`}
                                type="button"
                                onClick={() => handleSelectSuggestion(s)}
                                className="w-full text-left px-4 py-2.5 hover:bg-[#EBF7EE] border-b border-slate-50 flex items-start space-x-3 transition-colors cursor-pointer"
                              >
                                <MapPin className="w-4 h-4 text-[#1E8344] shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-extrabold text-[#143B20]">{s.title}</p>
                                  <p className="text-[10px] text-[#557B5E] font-medium truncate max-w-[320px]">{s.address}</p>
                                </div>
                              </button>
                            ))}
                          </>
                        )}

                      {/* Live OpenStreetMap Nominatim suggestions */}
                      {dynamicSuggestions.length > 0 && (
                        <>
                          <div className="bg-emerald-50/50 px-4 py-1.5 border-b border-[#CBDCD0]/55 text-[9px] font-black uppercase text-[#1E8344] tracking-wider">
                            Búsqueda en Vivo (OpenStreetMap)
                          </div>
                          {dynamicSuggestions.map((s, idx) => (
                            <button
                              key={`dynamic-${idx}`}
                              type="button"
                              onClick={() => handleSelectSuggestion(s)}
                              className="w-full text-left px-4 py-2.5 hover:bg-[#EBF7EE] border-b border-emerald-50 flex items-start space-x-3 transition-colors cursor-pointer"
                            >
                              <Compass className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-extrabold text-[#143B20]">{s.title}</p>
                                <p className="text-[10px] text-[#557B5E] font-medium truncate max-w-[320px]">{s.address}</p>
                              </div>
                            </button>
                          ))}
                        </>
                      )}

                      {/* No suggestions at all */}
                      {SUGGESTIONS.filter(item =>
                        item.address.toLowerCase().includes(address.toLowerCase()) ||
                        item.title.toLowerCase().includes(address.toLowerCase())
                      ).length === 0 && dynamicSuggestions.length === 0 && !isSearchingSuggestions && (
                          <div className="p-4 text-xs text-slate-400 font-bold text-center">
                            Ninguna sugerencia guardada. Elige otra búsqueda o continúa escribiendo la dirección libre.
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleMyLocation}
                  disabled={isLocating}
                  className="bg-[#EDF2EE] text-[#143B20] border border-[#CDE1D1] font-black py-3 px-5 rounded-xl text-xs flex items-center justify-center space-x-2 hover:bg-[#DCE7DD] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#1E8344]" />
                  ) : (
                    <Target className="w-4 h-4 text-[#1E8344]" />
                  )}
                  <span>Mi ubicación</span>
                </button>
              </div>

              {/* Extra Coordinate input in case they want manually tweak */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[10px] text-[#557B5E] font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                  Coordenadas GPS:
                </span>
                <input
                  type="text"
                  value={localCoordinates}
                  onChange={(e) => setLocalCoordinates(e.target.value)}
                  placeholder="E.g., 19.4150 N, 99.1620 W"
                  className="w-full bg-[#FAFDFC] border border-[#CDE1D1]/60 rounded-lg px-2.5 py-1 text-[11px] font-bold text-[#143B20] focus:outline-none focus:ring-1 focus:ring-[#1E8344]/30 disabled:bg-gray-100 disabled:text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Section 3: Evidence Drop Files Area (Screenshot exactly) */}
          <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#143B20] uppercase tracking-wider">
              3. Detalles y Evidencia
            </h3>

            {/* Problem Area input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                Descripción del problema
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente lo que estás viendo..."
                className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-2xl p-4 text-sm text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344] focus:placeholder-transparent placeholder-slate-400 leading-relaxed"
              />
            </div>

            {/* Drag Drop Image Uploader (Screen 5 Bottom) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                Adjuntar Fotografía <span className="text-rose-500">*</span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#CDE1D1] rounded-2xl p-8 hover:bg-[#F3FAF4] hover:border-[#143B20]/40 transition-all text-center flex flex-col items-center justify-center space-y-3 cursor-pointer relative overflow-hidden h-44"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg, image/png"
                  className="hidden"
                />

                {uploadedImage ? (
                  <div className="absolute inset-0">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Evidencia"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-bold">Haz clic para reemplazar la imagen</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#EDF2EE] flex items-center justify-center text-[#557B5E]">
                      <ImageIcon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#143B20]">
                        Haz clic o arrastra imágenes aquí
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                        PNG, JPG hasta 5MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button Form Pillar (Matches green elongated action button) */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#05682C] text-white font-bold py-3.5 px-8 rounded-full hover:bg-[#045524] transition-all flex items-center space-x-2 text-sm shadow-md shadow-[#05682C]/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando reporte...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Reporte</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

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
                    <CheckCircle className="w-8 h-8 text-[#1E8344]" />
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