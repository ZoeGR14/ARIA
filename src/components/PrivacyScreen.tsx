import React from 'react';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PrivacyScreen() {
  const navigate = useNavigate();
  // Esta herramienta lee automáticamente la URL (ej: ?tab=terminos)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Revisamos qué dice la URL. Si no dice nada, por defecto es 'privacidad'
  const activeView = searchParams.get('tab') || 'privacidad';

  return (
    <div className="min-h-screen bg-[#F4F9F5] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Tarjeta Principal */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-[#E1ECE3] p-8 md:p-12 mb-8 mt-10">
        
        {/* Encabezado y Pestañas */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#112A16] tracking-tight mb-8">
            Información Legal
          </h1>
          
          {/* Botones para alternar (Tabs) */}
          <div className="flex justify-center gap-2 md:gap-4 bg-[#F4F9F5] p-1.5 rounded-full w-fit mx-auto border border-[#E1ECE3]">
            <button
              // Al hacer clic, actualizamos la URL a ?tab=privacidad
              onClick={() => setSearchParams({ tab: 'privacidad' })}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all focus:outline-none ${
                activeView === 'privacidad' 
                  ? 'bg-white text-[#1E8344] shadow-sm border border-[#E1ECE3]' 
                  : 'text-gray-500 hover:text-[#112A16]'
              }`}
            >
              Privacidad
            </button>
            <button
              // Al hacer clic, actualizamos la URL a ?tab=terminos
              onClick={() => setSearchParams({ tab: 'terminos' })}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all focus:outline-none ${
                activeView === 'terminos' 
                  ? 'bg-white text-[#1E8344] shadow-sm border border-[#E1ECE3]' 
                  : 'text-gray-500 hover:text-[#112A16]'
              }`}
            >
              Términos de Uso
            </button>
          </div>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed text-sm md:text-base animate-in fade-in duration-300">
          
          {/* SECCIÓN DE PRIVACIDAD */}
          {activeView === 'privacidad' && (
            <section>
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <div className="p-2 bg-[#EBF4EC] rounded-lg">
                  <Shield className="w-6 h-6 text-[#1E8344]" />
                </div>
                <h2 className="text-xl font-bold text-[#112A16]">Aviso de Privacidad</h2>
              </div>
              <div className="pl-0 md:pl-11">
                <p className="mb-4">
                  En Terranova Tech no nos interesa vender tus datos ni rastrear tu actividad personal. Nuestra plataforma existe para mapear problemas ambientales, no para perfilar usuarios.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-[#1E8344] font-bold text-lg mt-[-2px]">•</span>
                    <span><strong>Lo que guardamos:</strong> Solo almacenamos la ubicación de los reportes, tu correo (si creas cuenta) y la evidencia fotográfica.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1E8344] font-bold text-lg mt-[-2px]">•</span>
                    <span><strong>Transparencia total:</strong> Los datos de las incidencias son de dominio público para presionar a que se resuelvan, pero los datos de quién los subió están protegidos.</span>
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* SECCIÓN DE TÉRMINOS */}
          {activeView === 'terminos' && (
            <section>
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <div className="p-2 bg-[#EBF4EC] rounded-lg">
                  <FileText className="w-6 h-6 text-[#1E8344]" />
                </div>
                <h2 className="text-xl font-bold text-[#112A16]">Términos de Uso</h2>
              </div>
              <div className="pl-0 md:pl-11">
                <p className="mb-4">
                  Al usar esta plataforma, aceptas formar parte de una red ciudadana responsable:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-[#1E8344] font-bold text-lg mt-[-2px]">•</span>
                    <span><strong>Información veraz:</strong> La efectividad de la plataforma depende de la veracidad de la comunidad. Cuentas que suban reportes falsos serán dadas de baja.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1E8344] font-bold text-lg mt-[-2px]">•</span>
                    <span><strong>No somos el 911:</strong> Esta plataforma estructura datos para autoridades. Si estás ante una emergencia en progreso, llama a los servicios de emergencia.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#1E8344] font-bold text-lg mt-[-2px]">•</span>
                    <span><strong>Uso de datos:</strong> Aceptas que la información ambiental que subes puede ser utilizada por universidades y autoridades para generar políticas de mejora urbana.</span>
                  </li>
                </ul>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Botón de Regreso */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-3 bg-[#112A16] text-white rounded-full font-semibold shadow-md hover:bg-[#1E8344] transition-all focus:outline-none"
      >
        <ArrowLeft className="w-5 h-5" />
        Ir a Inicio
      </button>

    </div>
  );
}