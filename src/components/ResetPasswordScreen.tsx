/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage({ type: 'error', text: 'Enlace inválido o sin token de seguridad.' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/restablecer-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al restablecer la contraseña');
      }

      setMessage({ type: 'success', text: data.mensaje || 'Contraseña actualizada correctamente' });
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error de red al conectar con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#FCFDFB] flex flex-col justify-between">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Half: Aesthetic Green-Tech Image Panel */}
        <div 
          className="hidden lg:flex lg:col-span-5 relative bg-cover bg-center items-end p-12 text-white h-auto"
          style={{ 
            backgroundImage: "linear-gradient(to top, rgba(16,36,22,0.9) 25%, rgba(16,36,22,0.15) 100%), url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80')" 
          }}
        >
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white leading-tight">
              Seguridad para tu Cuenta
            </h2>
            <p className="text-sm text-emerald-200/80 leading-relaxed font-medium">
              Asegura tu acceso a la plataforma ambiental con una nueva contraseña y sigue contribuyendo a tu comunidad.
            </p>
          </div>
        </div>

        {/* Right Half: Form Submission */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16">
          <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-[#EBF1EC] shadow-xs">
            
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-[#143B20] tracking-tight">Restablecer contraseña</h1>
              <p className="text-xs text-[#557B5E] font-medium leading-relaxed">
                Ingresa y confirma tu nueva contraseña para acceder a la plataforma
              </p>
            </div>

            {message && (
              <div className={`${
                message.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
                } border rounded-xl p-3.5 flex items-start gap-2.5 text-xs shadow-xs`}
              >
                <span className="text-sm shrink-0 mt-0.5">
                  {message.type === 'success' ? '✓' : '⚠️'}
                </span>
                <div className="font-semibold leading-relaxed">
                  {message.text}
                </div>
              </div>
            )}

            {message?.type === 'success' ? (
              <div className="pt-4 flex flex-col items-center space-y-6">
                <div className="w-16 h-16 bg-[#EBF7EE] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#1E8344]" />
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] hover:shadow-md transition-all text-sm tracking-wide cursor-pointer"
                >
                  Ir a Iniciar Sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* New Password field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#143B20] block uppercase tracking-wider">
                    Nueva contraseña
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

                {/* Confirm Password field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#143B20] block uppercase tracking-wider">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAFDFC] border border-[#CDE1D1] rounded-xl py-3 pl-10 pr-10 text-sm text-[#143B20] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E8344]/20 focus:border-[#1E8344]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Main submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md transition-all text-sm tracking-wide cursor-pointer"
                  >
                    {isLoading ? 'Actualizando...' : 'Restablecer contraseña'}
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
