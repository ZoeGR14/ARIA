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
  onShowVerification: (email: string) => void;
}

export default function SignupScreen({
  setIsLoggedIn,
  setUserProfile,
  onShowVerification
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: name,
          correoElectronico: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar usuario');
      }

      // Registro exitoso, solicitar verificación de correo
      onShowVerification(email);

    } catch (err: any) {
      setValidationError(err.message || 'Error de red. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
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


        </div>

        {/* Right Half: Signup Form (Matches screenshot exactly) */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16">
          <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-[#EBF1EC] shadow-xs">


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
                disabled={isLoading}
                className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] disabled:opacity-70 disabled:cursor-not-allowed transition-all text-sm tracking-wide flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>{isLoading ? 'Creando cuenta...' : 'Crear cuenta'}</span>
                {!isLoading && <span>→</span>}
              </button>



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
