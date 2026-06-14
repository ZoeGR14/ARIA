/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Info, ClipboardList, Home, Map } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (login: boolean) => void;
}

export default function Header({
  isLoggedIn,
  setIsLoggedIn,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E1ECE3] shadow-xs px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <div
        onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
        className="flex items-center space-x-2.5 cursor-pointer select-none"
      >
        <img src="/tiny.png" alt="ARIA Logo" className="h-12 w-auto object-contain" />
      </div>

      {/* Navigation Links (Unauthenticated state) */}
      <nav className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => navigate('/')}
          className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
            location.pathname === '/' ? 'text-[#1E8344]' : 'text-[#4F6C56] hover:text-[#1E8344]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => navigate('/acerca-de')}
          className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
            location.pathname === '/acerca-de' ? 'text-[#1E8344]' : 'text-[#4F6C56] hover:text-[#1E8344]'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Sobre Terranova Tech</span>
        </button>
      </nav>

      {/* Custom Header CTA Buttons */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center space-x-1.5 border border-[#CDE1D1] text-[#143B20] hover:bg-[#FAFDFC] transition-colors py-2 px-4 rounded-xl text-xs font-bold cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 text-[#1E8344]" />
          <span>Ingresar</span>
        </button>

        <button
          onClick={() => navigate('/signup')}
          className="bg-[#05682C] text-white hover:bg-[#045524] transition-colors py-2 px-4 rounded-xl text-xs font-bold cursor-pointer flex items-center space-x-1"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Registrarse</span>
        </button>
      </div>
    </header>
  );
}
