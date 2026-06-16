import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function VerifyEmailScreen() {
    const navigate = useNavigate();
    const { token } = useParams();

    const [isLoading, setIsLoading] = useState(true);

    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    useEffect(() => {

        const verifyEmail = async () => {

            if (!token) {

                setMessage({
                    type: 'error',
                    text: 'Token de verificación inválido.'
                });

                setIsLoading(false);
                return;
            }

            try {

                const response = await fetch(
                    `/api/auth/verificar/${token}`
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.mensaje || 'No fue posible verificar el correo.'
                    );
                }

                setMessage({
                    type: 'success',
                    text: data.mensaje || 'Correo verificado correctamente.'
                });

            } catch (err: any) {

                setMessage({
                    type: 'error',
                    text:
                        err.message ||
                        'Error de red al conectar con el servidor.'
                });

            } finally {

                setIsLoading(false);
            }
        };

        verifyEmail();

    }, [token]);

    return (
        <div className="min-h-[calc(100vh-68px)] bg-[#FCFDFB] flex flex-col justify-between">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

                {/* Panel izquierdo */}
                <div
                    className="hidden lg:flex lg:col-span-5 relative bg-cover bg-center items-end p-12 text-white h-auto"
                    style={{
                        backgroundImage:
                            "linear-gradient(to top, rgba(16,36,22,0.9) 25%, rgba(16,36,22,0.15) 100%), url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80')"
                    }}
                >
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                            Verificación de Cuenta
                        </h2>

                        <p className="text-sm text-emerald-200/80 leading-relaxed font-medium">
                            Estamos validando tu correo electrónico para activar tu acceso a la plataforma ambiental.
                        </p>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-16">

                    <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-[#EBF1EC] shadow-xs">

                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-bold text-[#143B20] tracking-tight">
                                Verificación de correo
                            </h1>
                        </div>

                        {isLoading ? (

                            <div className="text-center text-[#557B5E] text-sm">
                                Validando correo electrónico...
                            </div>

                        ) : (

                            <>
                                {message && (
                                    <div
                                        className={`${
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

                                {message?.type === 'success' && (
                                    <div className="pt-4 flex flex-col items-center space-y-6">

                                        <div className="w-16 h-16 bg-[#EBF7EE] rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-[#1E8344]" />
                                        </div>

                                        <p className="text-center text-sm text-[#557B5E]">
                                            Tu cuenta ha sido activada correctamente.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/login')}
                                            className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] hover:shadow-md transition-all text-sm tracking-wide"
                                        >
                                            Ir a Iniciar Sesión
                                        </button>

                                    </div>
                                )}

                                {message?.type === 'error' && (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-[#05682C] text-white font-bold py-3.5 rounded-xl hover:bg-[#045524] hover:shadow-md transition-all text-sm tracking-wide"
                                    >
                                        Volver
                                    </button>
                                )}
                            </>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}