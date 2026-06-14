/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#EBF1EC] border-t border-[#D5E4D8] text-[#55705B] py-8 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand/Copyright */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <img src="/terranova.png" alt="Terranova Logo" className="w-20 h-20 object-contain" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-[#143B20] tracking-tight">TERRANOVA TECH</span>
            <span className="text-xs text-[#55705B]">
              © {year} Tu voz en el mapa, tu huella en el futuro.
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#3b5341] tracking-wide">
          <button
            type="button"
            onClick={() => navigate('/acerca-de')}
            className="hover:text-[#1E8344] transition-colors"
          >
            Privacidad
          </button>
          <button
            type="button"
            onClick={() => navigate('/acerca-de')}
            className="hover:text-[#1E8344] transition-colors"
          >
            Términos
          </button>
          <button
            type="button"
            onClick={() => navigate('/acerca-de')}
            className="hover:text-[#1E8344] transition-colors"
          >
            Contacto
          </button>
          <button
            type="button"
            onClick={() => navigate('/acerca-de')}
            className="hover:text-[#1E8344] text-[#1E8344] border-l border-[#C1D2C5] pl-6 transition-colors"
          >
            Impacto 2023
          </button>
        </div>
      </div>
    </footer>
  );
}
