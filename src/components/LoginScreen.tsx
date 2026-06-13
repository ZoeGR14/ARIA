/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  setCurrentPage: (page: PageId) => void;
  setIsLoggedIn: (login: boolean) => void;
  authMessage?: string | null;
  setUserProfile: (profile: any) => void;
  onShowVerification: (email: string) => void;
}

export default function LoginScreen({ 
  setCurrentPage, 
  setIsLoggedIn,
  authMessage = null,
  setUserProfile,
  onShowVerification
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correoElectronico: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && data.mensaje === "Verifique su correo") {
          onShowVerification(email);
          return;
        }
        throw new Error(data.mensaje || 'Error al iniciar sesión');
      }

      if (rememberMe) {
        localStorage.setItem('aria_token', data.token);
        localStorage.setItem('aria_user', JSON.stringify(data.usuario));
      } else {
        sessionStorage.setItem('aria_token', data.token);
        sessionStorage.setItem('aria_user', JSON.stringify(data.usuario));
      }

      const userProfile = {
        id: data.usuario.id,
        name: data.usuario.nombre_completo,
        email: data.usuario.correo_electronico,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        role: data.usuario.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Ciudadano Activo',
        bio: `Hola, soy ${(data.usuario.nombre_completo || 'Usuario').split(' ')[0]}. Me interesa el monitoreo ambiental y registrar incidencias para cooperar de manera constructiva con mi comunidad local.`,
        location: 'CDMX, MX',
        level: data.usuario.nivel_ranking || 'Novato',
        impactScore: data.usuario.puntos_totales || 0,
        pointsThisMonth: data.usuario.puntos_totales || 0,
        totalsCount: 0,
        validatedCount: 0,
        contributionsCount: 0,
      };

      setUserProfile(userProfile);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#FCFDFB] flex flex-col justify-between">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Half: Aesthetic Green-Tech Image Panel (Matches exact image overlay style) */}
        <div 
          className="hidden lg:flex lg:col-span-5 relative bg-cover bg-center items-end p-12 text-white h-auto"
          style={{ 
            backgroundImage: "linear-gradient(to top, rgba(16,36,22,0.9) 25%, rgba(16,36,22,0.15) 100%), url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80')" 
          }}
        >
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Plataforma de Impacto Ambiental
            </h2>
            <p className="text-sm text-emerald-200/80 leading-relaxed font-medium">
              Monitoreo y análisis de datos ecológicos con precisión institucional. Diseñado para el futuro.
            </p>
          </div>
          
          <div className="absolute top-8 left-8 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xs">
              T
            </div>
            <span className="text-sm font-bold tracking-wider uppercase text-white/95">TERRANOVA TECH</span>
          </div>
        </div>

        {/* Right Half: Form Submission (Matches screenshot forms exactly) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16">
          {/* Form wrapper */}
          <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-[#EBF1EC] shadow-xs">
            {/* Logo */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E8344] via-[#33A25A] to-[#8AD690] flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">T.TECH</span>
              </div>
              <h3 className="text-xs font-black text-[#557C5E] uppercase tracking-widest mt-1">Terranova Tech</h3>
            </div>

            {authMessage && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-800 text-xs shadow-xs">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="font-semibold leading-relaxed">
                  {authMessage}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-rose-800 text-xs shadow-xs">
                <span className="text-sm shrink-0">⚠️</span>
                <div className="font-semibold leading-relaxed">
                  {error}
                </div>
              </div>
            )}

            {/* Inputs & Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-[#143B20] tracking-tight">Bienvenido de nuevo</h1>
                <p className="text-xs text-[#557B5E] font-medium leading-relaxed">
                  Ingresa tus credenciales para acceder a la plataforma ambiental
                </p>
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#143B20] block uppercase tracking-wider">
                  Correo electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-4 text-sm text-[#143B20] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#143B20] block uppercase tracking-wider">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-10 text-sm text-[#143B20] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password checks */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center space-x-2 text-[#4F6C56] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1E8344] focus:ring-[#1E8344] border-[#CDE1D1]" 
                  />
                  <span>Mantener sesión iniciada</span>
                </label>
                <button 
                  type="button"
                  className="text-[#1E8344] hover:underline"
                >
                  Olvidé mi contraseña
                </button>
              </div>

              {/* Main submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md transition-all text-sm tracking-wide"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>

              {/* OR Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#E1ECE3]" />
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">o</span>
                <div className="flex-grow border-t border-[#E1ECE3]" />
              </div>

              {/* Social Login Buttons side-by-side */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(true);
                    setCurrentPage('dashboard');
                  }}
                  className="flex items-center justify-center space-x-2 border border-[#CDE1D1] rounded-xl py-3 hover:bg-[#F3FAF4] text-xs font-extrabold text-[#143B20]"
                >
                  {/* Google Custom SVG Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.09-.81-4.28 0-6.37z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(true);
                    setCurrentPage('dashboard');
                  }}
                  className="flex items-center justify-center space-x-2 border border-[#CDE1D1] rounded-xl py-3 hover:bg-[#F3FAF4] text-xs font-extrabold text-[#143B20]"
                >
                  {/* Apple SVG Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Redirect footer */}
              <div className="text-center pt-2 text-xs font-bold text-[#4F6C56]">
                <span>¿No tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage('signup')}
                  className="text-[#1E8344] hover:underline"
                >
                  Regístrate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
