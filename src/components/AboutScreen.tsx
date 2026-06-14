/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
   ShieldCheck,
   Heart,
   Users,
   Milestone,
   Award,
   CheckCircle2,
} from "lucide-react";

export default function AboutScreen() {
   const navigate = useNavigate();
   return (
      <div className="bg-[#FAFDF9] py-12 px-4 md:px-8 min-h-[calc(100vh-68px)]">
         <div className="max-w-4xl mx-auto space-y-12">
            {/* Header Hero */}
            <div className="text-center space-y-3">
               <div className="w-16 h-16 rounded-full bg-[#1E8344] flex items-center justify-center text-white font-extrabold text-[#BBEFC7] shadow-md mx-auto text-sm">
                  T.TECH
               </div>
               <h1 className="text-4xl font-extrabold text-[#143B20] tracking-tight mt-3">
                  Sobre Terranova Tech
               </h1>
               <p className="text-sm text-[#4F6C56] max-w-xl mx-auto leading-relaxed">
                  Nuestra misión es democratizar el monitoreo ambiental e
                  integrar la ecología ciudadana con procesos institucionales
                  científicos rigurosos.
               </p>
            </div>

            {/* Triple pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-[#DDE7DE] space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] text-[#1E8344] flex items-center justify-center mx-auto">
                     <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#143B20]">
                     Rigurosidad Científica
                  </h3>
                  <p className="text-xs text-[#557B5E] leading-relaxed">
                     Todos los reportes ciudadanos pasan por filtros de
                     evidencia verificada y georreferenciación antes de
                     asignarse a laboratorios oficiales.
                  </p>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-[#DDE7DE] space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] text-[#1E8344] flex items-center justify-center mx-auto">
                     <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#143B20]">
                     Poder Comunitario
                  </h3>
                  <p className="text-xs text-[#557B5E] leading-relaxed">
                     Incentivamos la cooperación vecinal conectando a
                     denunciantes con investigadores experimentados de nivel
                     doctoral en Colombia.
                  </p>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-[#DDE7DE] space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EBF7EE] text-[#1E8344] flex items-center justify-center mx-auto">
                     <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#143B20]">
                     Futuro Sostenible
                  </h3>
                  <p className="text-xs text-[#557B5E] leading-relaxed">
                     Impulsamos políticas públicas transparentes basadas en
                     analítica geográfica de deforestación, residuos tóxicos y
                     calidad del aire.
                  </p>
               </div>
            </div>

            {/* Detailed story block */}
            <div className="bg-white rounded-3xl border border-[#DDE7DE] p-8 space-y-6">
               <h2 className="text-xl font-bold text-[#143B20]">
                  Plataforma Terranova Tech
               </h2>
               <p className="text-sm text-[#384C3E] leading-relaxed">
                  <strong>Terranova Tech</strong> nació como un proyecto
                  colaborativo en conjunto con universidades e institutos de
                  ecología en América Latina. La plataforma empodera a los
                  ciudadanos en distritos urbanos para convertirse en
                  científicos ciudadanos activos, reportando anomalías en su
                  entorno con tan solo un dispositivo móvil.
               </p>
               <p className="text-sm text-[#384C3E] leading-relaxed">
                  A través de algoritmos geográficos inteligentes y la
                  participación de investigadores universitarios (como el
                  doctorado de Carlos Mendoza), aceleramos la velocidad de
                  respuesta municipal a problemas de derrames químicos y
                  basureros ilegales en más de un 140%.
               </p>

               <div className="flex gap-4 pt-4 border-t border-[#F0F6F1] items-center text-xs font-semibold text-[#1E8344]">
                  <span className="flex items-center gap-1">
                     <Milestone className="w-4 h-4 text-[#1E8344]" />
                     Más de 6,400 hectáreas protegidas
                  </span>
                  <span className="flex items-center gap-1 border-l border-[#CDE1D1] pl-4">
                     <Award className="w-4 h-4 text-[#1E8344]" />
                     Premio Innovación Ecotecnológica 2023
                  </span>
               </div>
            </div>

            {/* Back navigation CTA */}
            <div className="text-center">
               <button
                  onClick={() => navigate("/")}
                  className="bg-[#05682C] text-white font-bold py-3.5 px-6 rounded-full hover:bg-[#045524] transition-all text-sm shadow-md"
               >
                  ← Ir a Inicio
               </button>
            </div>
         </div>
      </div>
   );
}
