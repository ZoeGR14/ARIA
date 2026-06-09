/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { User, Shield, Briefcase, Camera, Save, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface EditProfileScreenProps {
  userProfile: {
    name: string;
    avatar: string;
    role: string;
    level: string;
  };
  setUserProfile: (profile: { name: string; avatar: string; role: string; level: string }) => void;
  setCurrentPage: (page: PageId) => void;
}

const PRESET_AVATARS = [
  { name: 'Eco-Líder Masculino', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Soporte Femenino', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { name: 'Científica Verde', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { name: 'Conservacionista', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
  { name: 'Guardabosques', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Educador Ambiental', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
];

export default function EditProfileScreen({
  userProfile,
  setUserProfile,
  setCurrentPage,
}: EditProfileScreenProps) {
  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [level, setLevel] = useState(userProfile.level);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [custUrl, setCustUrl] = useState('');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setUserProfile({
      name: name.trim(),
      role: role.trim(),
      level: level.trim(),
      avatar: avatar,
    });
    
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
      // Automatically redirect they to dashboard (Inicio Perfil)
      setCurrentPage('dashboard');
    }, 1500);
  };

  return (
    <div className="bg-[#FAFDF9] py-8 px-4 md:px-8 min-h-[calc(100vh-68px)]">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back navigation header link */}
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#557B5E] hover:text-[#1E8344] bg-white border border-[#DDE7DE] px-3.5 py-2 rounded-full cursor-pointer transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Panel</span>
        </button>

        {/* Heading title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight">Modificar Mi Perfil</h1>
          <p className="text-sm text-[#4F6C56]">
            Configura y actualiza los detalles de tu credencial ecológica vecinal en Terranova Tech.
          </p>
        </div>

        {/* Form Container cards layout */}
        <div className="bg-white rounded-3xl border border-[#DDE7DE] p-6 md:p-8 shadow-xs">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* 1. Avatar selector layout */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider pl-1">
                Imagen de Perfil
              </label>

              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-[#F0F5F1]">
                {/* Current avatar indicator */}
                <div className="relative group">
                  <img 
                    src={avatar} 
                    alt="Vista Previa de Avatar" 
                    className="w-24 h-24 rounded-full border-4 border-[#CCE8C6] object-cover shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#143B20]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Grid selection list */}
                <div className="flex-1 space-y-3.5 w-full">
                  <p className="text-xs text-[#557B5E] font-bold">
                    Selecciona uno de nuestros avatares ecológicos predefinidos:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {PRESET_AVATARS.map((pSet) => {
                      const isSelected = avatar === pSet.url;
                      return (
                        <button
                          key={pSet.name}
                          type="button"
                          onClick={() => setAvatar(pSet.url)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#1E8344] scale-102 shadow-md ring-2 ring-[#1E8344]/20' 
                              : 'border-slate-200 hover:border-[#CCE8C6]'
                          }`}
                        >
                          <img 
                            src={pSet.url} 
                            alt={pSet.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#1E8344]/30 flex items-center justify-center">
                              <div className="bg-white rounded-full p-0.5">
                                <Check className="w-3 h-3 text-[#1E8344]" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Input field for custom image link */}
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Pegar URL de imagen personalizada..."
                        value={custUrl}
                        onChange={(e) => setCustUrl(e.target.value)}
                        className="flex-1 bg-[#F3FAF4] border border-[#CDE1D1] text-[#143B20] text-xs font-semibold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E8344]/15"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (custUrl.trim()) {
                            setAvatar(custUrl.trim());
                            setCustUrl('');
                          }
                        }}
                        className="bg-[#EDF2EE] border border-[#CDE1D1] text-[#143B20] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#DCE7DD] transition-colors cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Text Input fields split row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider pl-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={40}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F3FAF4] border border-[#CDE1D1] text-[#143B20] text-sm font-semibold pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E8344]/15"
                    placeholder="Tu nombre completo..."
                  />
                </div>
              </div>

              {/* Occupation / Title (Read Only) */}
              <div className="space-y-1.5 bg-[#FAFDF9] border border-[#E1ECE3] p-4 rounded-2xl relative">
                <span className="absolute top-2.5 right-3 bg-[#CCE8C6] text-[#0A3D18] text-[9px] font-black py-0.5 px-2 rounded-full uppercase tracking-wider">
                  Automático
                </span>
                <label className="text-[9px] font-black text-slate-400 block uppercase tracking-wider pl-0.5">
                  Cargo o Rol Ambiental
                </label>
                <div className="flex items-center space-x-2 mt-2 text-[#143B20]">
                  <Briefcase className="w-4 h-4 text-[#1E8344]" />
                  <span className="text-sm font-extrabold">{role}</span>
                </div>
                <p className="text-[10px] text-[#557B5E] font-medium mt-1 leading-tight">
                  Este es tu cargo asignado dinámicamente de acuerdo al número de intervenciones.
                </p>
              </div>

              {/* Rango / Nivel (Read Only) */}
              <div className="space-y-1.5 bg-[#FAFDF9] border border-[#E1ECE3] p-4 rounded-2xl relative">
                <span className="absolute top-2.5 right-3 bg-[#CCE8C6] text-[#0A3D18] text-[9px] font-black py-0.5 px-2 rounded-full uppercase tracking-wider">
                  Verificado
                </span>
                <label className="text-[9px] font-black text-slate-400 block uppercase tracking-wider pl-0.5">
                  Rango de Contribuidor
                </label>
                <div className="flex items-center space-x-2 mt-2 text-[#143B20]">
                  <Shield className="w-4 h-4 text-[#1E8344]" />
                  <span className="text-sm font-extrabold">{level}</span>
                </div>
                <p className="text-[10px] text-[#557B5E] font-medium mt-1 leading-tight">
                  Este rango valida la veracidad de tus testimonios en base a tus reportes aprobados.
                </p>
              </div>

            </div>

            {/* Saved Notification feedback banner (Screen visual transition) */}
            {showSavedMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center justify-center space-x-2.5 shadow-xs animate-bounce">
                <Sparkles className="w-5 h-5 text-[#1E8344]" />
                <span className="text-xs font-black">¡Perfil guardado con éxito! Redirigiendo...</span>
              </div>
            )}

            {/* CTA Save button */}
            <div className="flex pt-4 justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#05682C] text-white font-extrabold py-3.5 px-8 rounded-full hover:bg-[#045524] transition-all flex items-center justify-center space-x-2 text-xs shadow-md shadow-[#05682C]/10 cursor-pointer"
              >
                <Save className="w-4.5 h-4.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
