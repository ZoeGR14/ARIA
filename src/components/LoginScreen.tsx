/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  setIsLoggedIn: (login: boolean) => void;
  setUserProfile: (profile: any) => void;
  onShowVerification: (email: string) => void;
}

export default function LoginScreen({
  setIsLoggedIn,
  setUserProfile,
  onShowVerification,
}: LoginScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const authMessage = (location.state as any)?.authMessage ?? null;
  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

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

      // --- ¡LA SOLUCIÓN! ---
      // Guardamos el token con el nombre exacto que busca tu formulario de reportes
      localStorage.setItem('token', data.token);
      // ---------------------

      if (rememberMe) {
        localStorage.setItem('aria_token', data.token);
        localStorage.setItem('aria_user', JSON.stringify(data.usuario));
      } else {
        sessionStorage.setItem('aria_token', data.token);
        sessionStorage.setItem('aria_user', JSON.stringify(data.usuario));
      }

      const userProfile = {
        name: data.usuario.nombre_completo,
        avatar:
            data.usuario.avatar_url === ''
                ? "https://tse4.mm.bing.net/th/id/OIP.dDKYQqVBsG1tIt2uJzEJHwHaHa?cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3"
                : data.usuario.avatar_url,
        role:
            data.usuario.rol === "ADMINISTRADOR"
                ? "Administrador"
                : "Ciudadano Activo",
        bio: `Hola, soy ${(data.usuario.nombre_completo || "Usuario").split(" ")[0]}.`,
        location: "CDMX, MX",
        level: data.usuario.nivel_ranking || "Novato",
        impactScore: data.usuario.puntos_totales || 0,
        pointsThisMonth: data.usuario.puntos_totales || 0,
        totalsCount: 0,
        validatedCount: 0,
        contributionsCount: 0,
      };

      setUserProfile(userProfile);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    setIsForgotLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/solicitar-recuperacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoElectronico: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al solicitar recuperación');
      }

      setForgotMessage({ type: 'success', text: data.mensaje || 'Enlace enviado al correo' });
      setForgotEmail('');
    } catch (err: any) {
      setForgotMessage({ type: 'error', text: err.message || 'Error de red al conectar' });
    } finally {
      setIsForgotLoading(false);
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
        </div>

        {/* Right Half: Form Submission (Matches screenshot forms exactly) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16">
          {/* Form wrapper */}
          <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-[#EBF1EC] shadow-xs">
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

            {view === 'login' ? (
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
                  onClick={() => {
                    setView('forgot-password');
                    setError(null);
                  }}
                  className="text-[#1E8344] hover:underline cursor-pointer"
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

              {/* Redirect footer */}
              <div className="text-center pt-2 text-xs font-bold text-[#4F6C56]">
                <span>¿No tienes cuenta? </span>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-[#1E8344] hover:underline cursor-pointer"
                >
                  Regístrate
                </button>
              </div>
            </form>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="text-center space-y-1">
                  <h1 className="text-2xl font-bold text-[#143B20] tracking-tight">Recuperar contraseña</h1>
                  <p className="text-xs text-[#557B5E] font-medium leading-relaxed">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                  </p>
                </div>

                {forgotMessage && (
                  <div className={`${
                    forgotMessage.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                    } border rounded-xl p-3.5 flex items-start gap-2.5 text-xs shadow-xs`}
                  >
                    <span className="text-sm shrink-0 mt-0.5">
                      {forgotMessage.type === 'success' ? '✓' : '⚠️'}
                    </span>
                    <div className="font-semibold leading-relaxed">
                      {forgotMessage.text}
                    </div>
                  </div>
                )}

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
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-4 text-sm text-[#143B20] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md transition-all text-sm tracking-wide cursor-pointer"
                  >
                    {isForgotLoading ? 'Enviando enlace...' : 'Enviar enlace'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setForgotMessage(null);
                    }}
                    className="w-full bg-white text-[#143B20] border border-[#CDE1D1] font-bold py-3.5 rounded-xl hover:bg-[#F3FAF4] transition-all text-sm tracking-wide cursor-pointer"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}