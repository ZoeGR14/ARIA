/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { 
  Home, Map, ClipboardList, Award, Info, LayoutDashboard, PlusCircle, 
  LogOut, LogIn, Menu, X, User, ChevronRight, FileText, UserCog 
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (login: boolean) => void;
  userProfile?: {
    name: string;
    avatar: string;
    role: string;
    level: string;
  };
}

export default function Sidebar({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  setIsLoggedIn,
  userProfile,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = isLoggedIn
    ? [
        { id: 'dashboard', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
        { id: 'mis-reportes', label: 'Mis Reportes', icon: <FileText className="w-5 h-5" /> },
        { id: 'reportes', label: 'Explorar Reportes', icon: <ClipboardList className="w-5 h-5 font-bold" /> },
        { id: 'explorar-mapa', label: 'Explorar Mapa', icon: <Map className="w-5 h-5" /> },
        { id: 'comunidad', label: 'Comunidad / Líderes', icon: <Award className="w-5 h-5" /> },
        { id: 'editar-perfil', label: 'Modificar Perfil', icon: <UserCog className="w-5 h-5" /> },
      ]
    : [
        { id: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
        { id: 'reportes', label: 'Explorar Reportes', icon: <ClipboardList className="w-5 h-5" /> },
        { id: 'comunidad', label: 'Comunidad / Líderes', icon: <Award className="w-5 h-5" /> },
        { id: 'acerca-de', label: 'Acerca de', icon: <Info className="w-5 h-5" /> },
      ];

  const handleNav = (id: PageId) => {
    // Redirect 'inicio' to 'dashboard' if logged in
    if (isLoggedIn && id === 'inicio') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage(id);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('inicio');
    setMobileOpen(false);
  };

  // Render the menus inside a re-usable elements block
  const renderSidebarContent = () => {
    return (
      <div className="flex flex-col h-full justify-between">
        {/* Upper Brand & Navigation menus */}
        <div className="space-y-7">
          {/* Brand Logo Header */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none pb-2 border-b border-[#E1ECE3]"
            onClick={() => handleNav(isLoggedIn ? 'dashboard' : 'inicio')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E8344] via-[#33A25A] to-[#8AD690] flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-extrabold text-[#9px] tracking-tighter">T.TECH</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-[#143B20] tracking-tight leading-none truncate">Terranova Tech</span>
              <span className="text-[9px] text-[#557B5E] font-bold tracking-tighter uppercase mt-1 truncate">Soporte Ambiental</span>
            </div>
          </div>

          {/* Navigation Links Blocks */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase px-3 pb-1">
              Plataforma
            </span>

            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id as PageId)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EBF7EE] text-[#1E8344]'
                      : 'text-[#55705B] hover:bg-[#F3FAF4] hover:text-[#143B20]'
                  }`}
                >
                  <span className={isActive ? 'text-[#1E8344]' : 'text-[#8EA393]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Core Green Elongated action button CTA */}
          <div className="pt-2 px-1">
            <button
              onClick={() => handleNav(isLoggedIn ? 'reportar' : 'login')}
              className="w-full bg-[#05682C] text-white font-extrabold py-3.5 px-4 rounded-full hover:bg-[#045524] transition-all flex items-center justify-center space-x-2 text-xs shadow-md shadow-[#05682C]/10 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>Reportar Incidencia</span>
            </button>
          </div>
        </div>

        {/* Lower Account Area block info (Only shown for guest users to login) */}
        {!isLoggedIn && (
          <div className="pt-5 border-t border-[#E1ECE3] mt-8">
            <button
              onClick={() => handleNav('login')}
              className="w-full flex items-center justify-center space-x-2 bg-[#EDF2EE] border border-[#CDE1D1] text-[#143B20] hover:bg-[#DCE7DD] font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#1E8344]" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 1. Mobile Menu Floating Trigger Button - Avoids standard complete top bar completely */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 bg-white text-[#143B20] rounded-full border border-[#DDE7DE] shadow-md focus:outline-none hover:bg-[#F3FAF4] transition-all flex items-center justify-center cursor-pointer"
          aria-label={mobileOpen ? 'Cerrar Menú' : 'Abrir Menú'}
        >
          {mobileOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5 text-[#1E8344]" />}
        </button>
      </div>

      {/* 2. Mobile Backdrop Overlay when Drawer is toggled open */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 3. Mobile Navigation Drawer Slide Box */}
      <div 
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 bg-[#FCFDFB] border-r border-[#E1ECE3] z-40 p-5 pt-20 transition-transform duration-300 ease-in-out transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent()}
      </div>

      {/* 4. Desktop Persistent Left Sidebar Layout Frame */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#FCFDFB] border-r border-[#E1ECE3] flex-shrink-0 p-5">
        {renderSidebarContent()}
      </aside>
    </>
  );
}
