/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SignupScreenProps {
  setIsLoggedIn: (login: boolean) => void;
  setUserProfile: (profile: any) => void;
}

export default function SignupScreen({
  setIsLoggedIn,
  setUserProfile,
}: SignupScreenProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) {
      setValidationError('Los correos electrónicos ingresados no coinciden.');
      return;
    }

    if (password !== passwordConfirm) {
      setValidationError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Register mock user
    const newUserProfile = {
      name: name || 'Investigador Ciudadano',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'Investigador Ciudadano',
      bio: `Hola, soy ${name.split(' ')[0]}. Me interesa el monitoreo ambiental y registrar incidencias para cooperar de manera constructiva con mi comunidad local.`,
      location: 'Bogotá, CO',
      level: 'Novato Nivel 1',
      impactScore: 10,
      pointsThisMonth: 10,
      totalsCount: 1,
      validatedCount: 0,
      contributionsCount: 1,
    };
    
    setUserProfile(newUserProfile);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#FCFDFB] flex flex-col justify-between">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Half: Deep sunlit pine forest background (Matches exact image style) */}
        <div 
          className="hidden lg:flex lg:col-span-5 relative bg-cover bg-center items-end p-12 text-white h-auto"
          style={{ 
            backgroundImage: "linear-gradient(to top, rgba(10,31,15,0.95) 20%, rgba(10,31,15,0.1) 100%), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80')" 
          }}
        >
          <div className="space-y-4 max-w-sm">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Preservación Forestal
            </h2>
            <p className="text-sm text-emerald-200/80 leading-relaxed font-semibold">
              Registra la deforestación y apoya a biólogos e investigadores independientes a salvaguardar pulmones naturales.
            </p>
          </div>
          
          <div className="absolute top-8 left-8 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xs">
              T
            </div>
            <span className="text-sm font-bold tracking-wider uppercase text-white/95">TERRANOVA TECH</span>
          </div>
        </div>

        {/* Right Half: Signup Form (Matches screenshot exactly) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16">
          <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-[#EBF1EC] shadow-xs">
            {/* Brand Logo Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E8344] via-[#33A25A] to-[#8AD690] flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">T.TECH</span>
              </div>
              <h3 className="text-[10px] font-black text-[#557C5E] uppercase tracking-widest mt-1 font-mono">Terranova Tech</h3>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#143B20] tracking-tight">Crear cuenta</h1>
                <p className="text-xs text-[#557B5E] font-medium leading-relaxed">
                  Únete a nuestra plataforma para acceder a conjuntos de datos ambientales avanzados.
                </p>
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in shrink-0">
                  <span className="text-sm">⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}

              {/* Completes Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                  Nombre completo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-4 text-sm text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                  Correo electrónico laboral
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
                    placeholder="jane.doe@university.edu"
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-4 text-sm text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                </div>
              </div>

              {/* Confirm Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                  Confirmar correo electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={emailConfirm}
                    onChange={(e) => setEmailConfirm(e.target.value)}
                    placeholder="jane.doe@university.edu"
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-4 text-sm text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                  Contraseña
                </label>
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
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-12 text-sm text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-sans cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium pl-1 mt-1 font-sans">
                  Debe tener al menos 8 caracteres de longitud.
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#143B20] uppercase tracking-wider block">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-sans">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-12 text-sm text-[#143B20] focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-sans cursor-pointer"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign up Trigger */}
              <button
                type="submit"
                className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] transition-all text-sm tracking-wide flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>Crear cuenta</span>
                <span>→</span>
              </button>

              {/* OR Stacked divider (Capital matching Screen 4) */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#E1ECE3]" />
                <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 tracking-wider">O REGÍSTRATE CON</span>
                <div className="flex-grow border-t border-[#E1ECE3]" />
              </div>

              {/* Stacked Social Buttons (Matches Screen 4 exactly) */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(true);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center justify-center space-x-3 border border-[#CDE1D1] rounded-xl py-3 hover:bg-[#F3FAF4] text-xs font-bold text-[#143B20] bg-white transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.09-.81-4.28 0-6.37z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Registrarse con Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(true);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center justify-center space-x-3 border border-[#CDE1D1] rounded-xl py-3 hover:bg-[#F3FAF4] text-xs font-bold text-[#143B20] bg-white transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z" />
                  </svg>
                  <span>Registrarse con Apple</span>
                </button>
              </div>

              {/* Bottom login redirect */}
              <div className="text-center pt-2 text-xs font-bold text-[#4F6C56]">
                <span>¿Ya tienes una cuenta? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#1E8344] hover:underline"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
