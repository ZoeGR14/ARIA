/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contributor, IncidentReport } from '../types';
import {
  Award, Users, ShieldCheck, Trophy, Flame,
  ArrowRight, ChevronLeft, MapPin, Calendar,
  CheckCircle2, UserCircle
} from 'lucide-react';
import { getContributores } from '../services/rankingService';

interface CommunityScreenProps {
  userProfile?: {
    name: string;
    avatar: string;
    role: string;
    level: string;
    impactScore: number;
  };
  isLoggedIn: boolean;
  reports?: IncidentReport[];
}

const COMMUNITY_CHALLENGES = [
  {
    id: 1,
    title: 'Inspector del Río Seco',
    description: 'Reportar incidentes o monitorear el estado de desborde de residuos en las cercanías.',
    points: '+150 pts',
    progress: 75,
    participants: 124,
    tag: 'Agua',
  },
  {
    id: 2,
    title: 'Cielos Limpios',
    description: 'Monitorear la calidad del aire del área industrial durante las horas pico de producción.',
    points: '+200 pts',
    progress: 40,
    participants: 89,
    tag: 'Aire',
  },
  {
    id: 3,
    title: 'Barrio Verde Cero Residuos',
    description: 'Validar o dar seguimiento a reportes de vertederos clandestinos que ya fueron saneados.',
    points: '+100 pts',
    progress: 95,
    participants: 342,
    tag: 'Residuos',
  },
];


export default function CommunityScreen({
  userProfile,
  isLoggedIn,
  reports = [],
}: CommunityScreenProps) {
  const navigate = useNavigate();
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [localContributors, setLocalContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    getContributores().then(setLocalContributors);
  }, []);

  // Build a complete leaderboard combining API contributors and the active user
  const allContributors: Contributor[] = [...localContributors];
  
  if (isLoggedIn && userProfile) {
    const carlosInList = allContributors.some(c => c.name === userProfile.name);
    if (!carlosInList) {
      allContributors.push({
        id: 'carlos-active',
        rank: 4,
        name: userProfile.name,
        points: 1250,
        avatar: userProfile.avatar,
        verified: true,
        nivel_ranking: userProfile.level,
        reportCount: 0,
      });
    }
  }

  // Sort contributors by points descending
  const sortedContributors = [...allContributors].sort((a, b) => b.points - a.points);
  
  // Re-define ranks based on sorting
  const rankedContributors = sortedContributors.map((c, idx) => ({
    ...c,
    rank: idx + 1,
  }));

  const totalPuntos = localContributors.reduce((sum, c) => sum + c.points, 0);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🏆</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="text-xs font-black text-slate-400">#{rank}</span>;
    }
  };

  // Close inspection and return to general view
  const handleBackToLeaderboard = () => {
    setSelectedContributor(null);
  };

  return (
    <div className="bg-[#FAFDF9] py-8 px-4 md:px-8 min-h-[calc(100vh-68px)] font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ————————————————— SCREEN HEADER BREADCRUMB ————————————————— */}
        {!selectedContributor ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#1E8344]">
              <Users className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">Red de Colaboración Vecinal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight text-sans">Comunidad y Líderes</h1>
            <p className="text-sm text-[#4F6C56] leading-relaxed max-w-3xl">
              Descubre y entra en los perfiles de los ciudadanos destacados que lideran la protección ambiental en nuestro territorio urbano. Sigue sus alertas reportadas, su puntuación ecológica de impacto y sus medallas al mérito.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <button 
              onClick={handleBackToLeaderboard}
              className="flex items-center space-x-1 text-xs font-black text-[#1E8344] hover:text-[#0b5425] bg-white border border-[#CDE1D1] px-3.5 py-1.5 rounded-full w-fit hover:border-[#1E8344] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a Líderes Comunidad</span>
            </button>
            <div className="flex items-center gap-2 text-[#1E8344] pt-2">
              <Award className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">Inspeccionar Perfil de Ciudadano</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight">{selectedContributor.name}</h1>
          </div>
        )}

        {/* ————————————————— 1) DETAILED PROFILE SECTION (INSPECTOR MODE) ————————————————— */}
        {selectedContributor ? (
          (() => {
            const citizenReports = reports.filter(r => r.authorName?.toLowerCase() === selectedContributor.name.toLowerCase());

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Dashboard Card on the Left */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-[#DDE7DE] p-6 shadow-md relative overflow-hidden flex flex-col items-center text-center space-y-5">
                  <div className="absolute top-4 right-4 bg-slate-900/10 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    # RANK {selectedContributor.rank}
                  </div>

                  {/* Circular Avatar Avatar Showcase */}
                  <div className="relative">
                    {selectedContributor.avatar ? (
                      <img
                        src={selectedContributor.avatar}
                        alt={selectedContributor.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserCircle className="w-24 h-24 text-slate-300" />
                    )}
                    {selectedContributor.rank <= 3 && (
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md leading-none border">
                        {getRankBadge(selectedContributor.rank)}
                      </div>
                    )}
                  </div>

                  {/* Name and Level Label */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <h3 className="text-xl font-black text-[#143B20]">{selectedContributor.name}</h3>
                      {selectedContributor.verified && (
                        <span className="inline-flex bg-emerald-100 text-emerald-800 p-0.5 rounded-full" title="Ciudadano Verificado de Terranova">
                          <ShieldCheck className="w-4 h-4 text-[#1E8344]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#557B5E] font-bold tracking-wide uppercase">{selectedContributor.nivel_ranking}</p>
                  </div>

                  {/* Divider line */}
                  <div className="w-full h-[1px] bg-[#F0F5F1]" />

                  {/* Impact Stats numbers */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-3 bg-gradient-to-br from-[#EBF7EE] to-white rounded-2xl border border-[#DDE7DE]">
                      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">ECO PUNTOS</span>
                      <strong className="text-lg font-black text-[#143B20] mt-0.5 block">{selectedContributor.points.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-[#EBF7EE] to-white rounded-2xl border border-[#DDE7DE]">
                      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Total reportes</span>
                      <strong className="text-lg font-black text-[#1E8344] mt-0.5 block">{selectedContributor.reportCount}</strong>
                    </div>
                  </div>

                  {/* Back Action button footer */}
                  <button
                    onClick={handleBackToLeaderboard}
                    className="w-full bg-[#EDF2EE] hover:bg-[#DCE7DD] border border-[#CDE1D1] text-[#143B20] font-black text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95"
                  >
                    Cerrar Guardián
                  </button>
                </div>

                {/* Right side: Reports List */}
                <div className="lg:col-span-8 space-y-6">

                  {/* REPORTES CREADOS POR EL USUARIO */}
                  <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F1] flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4.5 h-4.5 text-[#1E8344]" />
                        <h3 className="text-sm font-black text-[#143B20] uppercase tracking-wider">
                          Denuncias Reportadas por {selectedContributor.name} ({citizenReports.length})
                        </h3>
                      </div>
                    </div>

                    {citizenReports.length > 0 ? (
                      <div className="space-y-4 pt-1">
                        {citizenReports.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-white border border-[#E2EDE3] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#1E8344] hover:shadow-xs"
                          >
                            <div className="flex items-start space-x-4">
                              {/* Square Incident Thumbnail preview */}
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#CBDCD0]"
                                referrerPolicy="no-referrer"
                              />
                              
                              <div className="space-y-1.5 font-sans">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[9px] font-black uppercase tracking-wider rounded-md px-2 py-0.5 ${
                                    item.category === 'Acumulación de Basura' ? 'bg-red-50 text-red-700' :
                                    item.category === 'Fuga de Agua' ? 'bg-amber-50 text-amber-700' :
                                    'bg-blue-50 text-blue-700'
                                  }`}>
                                    {item.category}
                                  </span>
                                  <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">ID: {item.id}</span>
                                </div>

                                <h4 className="text-sm font-extrabold text-[#143B20] line-clamp-1 leading-snug">
                                  {item.title}
                                </h4>

                                <div className="flex gap-3 text-[10.5px] text-[#557B5E] font-medium flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#1E8344]" />
                                    <span>{item.location}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#1E8344]" />
                                    <span>{item.date}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status controls and inspect button */}
                            <div className="flex flex-col items-start md:items-end justify-between self-stretch md:text-right">
                              {/* Status colored label overlay */}
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${
                                item.status === 'Atendido' ? 'bg-emerald-100 text-emerald-800' :
                                item.status === 'En Revisión' ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{item.status}</span>
                              </span>

                              <button
                                onClick={() => navigate('/reporte/' + item.id)}
                                className="mt-3 bg-[#EBF7EE] hover:bg-[#DCE7DD] text-[#1E8344] font-black text-[11px] py-1.5 px-3.5 rounded-lg inline-flex items-center space-x-1 border border-[#C9DEC2] cursor-pointer transition-all active:scale-95 text-xs"
                              >
                                <span>Ver Alerta</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 px-4 bg-[#FAFDF9] border border-dashed border-[#CDE1D1] rounded-2xl flex flex-col items-center justify-center space-y-2">
                        <span className="text-3xl text-slate-300">📁</span>
                        <h4 className="text-xs font-bold text-[#143B20]">Inspección Secundaria</h4>
                        <p className="text-[11px] text-[#557B5E] max-w-sm font-semibold">
                          Este ciudadano aún no posee reportes en activo para este distrito vecinal. Gran parte de sus puntos ambientales provienen de auditorías, retos de campaña y validaciones.
                        </p>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })()
        ) : (
          /* ————————————————— 2) ROOT COMMUNITY LEADERBOARD LIST (DEFAULT VIEW) ————————————————— */
          <>
            {/* Global Impact Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Esfuerzo Conjunto</span>
                  <h3 className="text-2xl font-black text-[#1E8344]">{totalPuntos.toLocaleString()} Puntos</h3>
                </div>
                <p className="text-xs text-[#557B5E] mt-3 leading-relaxed">
                  Puntos ecológicos globales sumados por el vecindario este mes a través de reportes resueltos.
                </p>
                <div className="absolute right-4 bottom-4 opacity-5">
                  <Flame className="w-16 h-16 text-[#1E8344]" />
                </div>
              </div>

              <div className="bg-[#EBF7EE] border border-[#CBDCD0] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-wider block text-[#1E8344] font-mono">TU ESTATUS</span>
                  {isLoggedIn && userProfile ? (
                    <div className="space-y-0.5">
                      <h4 className="text-lg font-black text-[#143B20] leading-tight truncate">{userProfile.name}</h4>
                      <p className="text-xs text-[#1E8344] font-bold">{userProfile.level}</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-[#143B20] leading-tight">Invitado</h4>
                      <p className="text-[11px] text-[#557B5E]">Registra una cuenta para ganar puntos</p>
                    </div>
                  )}
                </div>
                {isLoggedIn ? (
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="font-bold text-[#3E5D46]">Impacto: {userProfile?.impactScore}/100</span>
                    <button 
                      onClick={() => {
                        const carlosUser = rankedContributors.find(c => c.name === userProfile?.name);
                        if (carlosUser) {
                          setSelectedContributor(carlosUser);
                        } else {
                          navigate('/editar-perfil');
                        }
                      }}
                      className="text-xs font-black text-[#1E8344] hover:underline cursor-pointer flex items-center gap-1 font-sans"
                    >
                      <span>Ver tu Perfil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-[#05682C] text-white font-extrabold text-[10px] uppercase py-2 px-3.5 rounded-xl hover:bg-[#045524] transition-colors mt-3 w-fit cursor-pointer"
                  >
                    Crear Perfil
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0F5F1]">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-[#C49B2F]" />
                    <h3 className="text-base font-extrabold text-[#143B20]">Líderes de Conservación CDMX</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {rankedContributors.map((contrib) => {
                    const isActiveUser = isLoggedIn && userProfile && contrib.name === userProfile.name;
                    return (
                      <div 
                        key={contrib.id}
                        onClick={() => setSelectedContributor(contrib)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border cursor-pointer hover:border-[#1E8344] hover:shadow-md group ${
                          isActiveUser 
                            ? 'bg-[#EBF7EE]/60 border-[#B7D8BC] ring-2 ring-[#1E8344]/5' 
                            : 'border-[#F0F6F1]'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Rank Index Placement */}
                          <div className="w-8 flex items-center justify-center">
                            {getRankBadge(contrib.rank)}
                          </div>

                          {/* Avatar */}
                          {contrib.avatar ? (
                            <img
                              src={contrib.avatar}
                              alt={contrib.name}
                              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <UserCircle className="w-11 h-11 text-slate-300" />
                          )}

                          {/* Info block */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-black text-[#143B20] group-hover:text-[#1E8344] transition-colors">
                                {contrib.name}
                              </span>
                              {contrib.verified && (
                                <span className="inline-flex bg-emerald-100 text-emerald-800 p-0.5 rounded-full" title="Ciudadano Verificado">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </span>
                              )}
                              {isActiveUser && (
                                <span className="text-[9px] font-bold bg-[#1E8344] text-white px-1.5 py-0.2 rounded-full uppercase">
                                  Tú
                                </span>
                              )}
                            </div>
                            <p className="text-[10.5px] text-[#557B5E] font-bold">
                              {contrib.nivel_ranking || 'Novato'}
                            </p>
                          </div>
                        </div>

                        {/* Points Total & Action Arrow hover */}
                        <div className="flex items-center space-x-3 text-right">
                          <div>
                            <span className="text-sm font-black text-[#143B20] block">{contrib.points.toLocaleString()}</span>
                            <span className="text-[9px] text-[#557B5E] font-black uppercase tracking-widest leading-none block">puntos</span>
                          </div>
                          <span className="text-[#1E8344] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs pl-1">
                            Ver Perfil →
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
