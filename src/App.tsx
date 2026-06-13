/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, IncidentReport, Comment } from './types';
import { INITIAL_REPORTS, INITIAL_CONTRIBUTORS } from './data/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingScreen from './components/LandingScreen';
import DashboardScreen from './components/DashboardScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ReportFormScreen from './components/ReportFormScreen';
import ReportDetailScreen from './components/ReportDetailScreen';
import ExploreReportsScreen from './components/ExploreReportsScreen';
import AboutScreen from './components/AboutScreen';
import MyReportsScreen from './components/MyReportsScreen';
import ExplorarMapaScreen from './components/ExplorarMapaScreen';
import EditProfileScreen from './components/EditProfileScreen';
import CommunityScreen from './components/CommunityScreen';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Bell, Inbox, Check, Sparkles } from 'lucide-react';

const CARLOS_MENDOZA_PROFILE = {
  name: 'Carlos Mendoza',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  role: 'Investigador Nivel 3',
  bio: 'Hola, soy Carlos. Me apasiona la naturaleza y desde hace un tiempo dedico mi tiempo libre a documentar y reportar problemas ambientales en mi barrio. Creo que pequeños cambios pueden generar un gran impacto.',
  location: 'Bogotá, CO',
  level: 'Investigador Nivel 3',
  impactScore: 84,
  pointsThisMonth: 12,
  totalsCount: 142,
  validatedCount: 128,
  contributionsCount: 34,
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Starts as logged out by default
  const [currentPage, setCurrentPage] = useState<PageId>('inicio'); // First screen is home page
  const [userProfile, setUserProfile] = useState(CARLOS_MENDOZA_PROFILE);
  const [reports, setReports] = useState<IncidentReport[]>(INITIAL_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>('ENV-2023-8472'); // Matches detailed report image default
  const [previousPage, setPreviousPage] = useState<PageId>('reportes');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [prefilledLocation, setPrefilledLocation] = useState<{ address: string; coordinates: string } | null>(null);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Oficial asignado',
      message: 'Un inspector de Terranova Tech ha sido enviado a la Colonia Roma Norte para revisar el reporte ENV-2023-8472.',
      time: 'Hace 1 hora',
      read: false,
      reportId: 'ENV-2023-8472',
    },
    {
      id: 'n2',
      title: 'Comunidad activa',
      message: 'Se añadieron nuevos comentarios y firmas oficiales al reporte de emisiones industriales.',
      time: 'Hace 3 horas',
      read: true,
      reportId: 'ENV-2023-1120',
    },
    {
      id: 'n3',
      title: '¡Te damos la bienvenida!',
      message: 'Gracias por unirte a Terranova Tech. Comienza a registrar incidencias y cuidar el medio ambiente.',
      time: 'Hace 1 día',
      read: true,
    }
  ]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Automatically scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Safely auto-route between public and authenticated pages on login/navigation changes
  useEffect(() => {
    if (isLoggedIn) {
      if (['inicio', 'login', 'signup'].includes(currentPage)) {
        setCurrentPage('dashboard');
      }
      setAuthMessage(null);
    } else {
      const pagesRequiringAuth: PageId[] = [
        'dashboard', 
        'reportar', 
        'mis-reportes', 
        'editar-perfil', 
        'reportes', 
        'explorar-mapa', 
        'comunidad', 
        'detalles-incidencia'
      ];
      if (pagesRequiringAuth.includes(currentPage)) {
        if (currentPage === 'reportar') {
          setAuthMessage('Debes iniciar sesión para poder reportar una incidencia ambiental.');
        } else if (currentPage === 'mis-reportes') {
          setAuthMessage('Debes iniciar sesión para ver tus reportes.');
        } else if (currentPage === 'editar-perfil') {
          setAuthMessage('Debes iniciar sesión para modificar tu perfil.');
        } else if (currentPage === 'reportes' || currentPage === 'explorar-mapa' || currentPage === 'detalles-incidencia') {
          setAuthMessage('Debes iniciar sesión para poder explorar e inspeccionar el mapa de incidencias.');
        } else if (currentPage === 'comunidad') {
          setAuthMessage('Debes iniciar sesión para ver los perfiles de la comunidad y repasar sus reportes.');
        } else {
          setAuthMessage('Debes iniciar sesión para acceder a esta sección.');
        }
        setCurrentPage('login');
      }
    }
  }, [isLoggedIn, currentPage]);

  const handleSetPage = (page: PageId) => {
    const pagesRequiringAuth: PageId[] = [
      'dashboard', 
      'reportar', 
      'mis-reportes', 
      'editar-perfil', 
      'reportes', 
      'explorar-mapa', 
      'comunidad', 
      'detalles-incidencia'
    ];
    if (pagesRequiringAuth.includes(page) && !isLoggedIn) {
      if (page === 'reportar') {
        setAuthMessage('Debes iniciar sesión para poder reportar una incidencia ambiental.');
      } else if (page === 'mis-reportes') {
        setAuthMessage('Debes iniciar sesión para ver tus reportes.');
      } else if (page === 'editar-perfil') {
        setAuthMessage('Debes iniciar sesión para modificar tu perfil.');
      } else if (page === 'reportes' || page === 'explorar-mapa' || page === 'detalles-incidencia') {
        setAuthMessage('Debes iniciar sesión para poder explorar e inspeccionar el mapa de incidencias.');
      } else if (page === 'comunidad') {
        setAuthMessage('Debes iniciar sesión para ver los perfiles de la comunidad y repasar sus reportes.');
      } else {
        setAuthMessage('Debes iniciar sesión para acceder a esta sección.');
      }
      setCurrentPage('login');
    } else {
      if (page !== 'login') {
        setAuthMessage(null);
      }
      setCurrentPage(page);
    }
  };

  const handleReportAtLocation = (address: string, coordinates: string) => {
    setPrefilledLocation({ address, coordinates });
    handleSetPage('reportar');
  };

  // Handle adding a brand new incident report
  const handleAddReport = (newReport: IncidentReport) => {
    setReports((prev) => [newReport, ...prev]);
    // Also increment Carlos totals count on submission
    setUserProfile((prev) => ({
      ...prev,
      totalsCount: prev.totalsCount + 1,
      impactScore: Math.min(prev.impactScore + 2, 100),
      pointsThisMonth: prev.pointsThisMonth + 5,
    }));

    // Generate immediate success notification
    const newNotify = {
      id: `n-new-${Date.now()}`,
      title: 'Reporte registrado',
      message: `¡Tu reporte de ${newReport.category} ("${newReport.title}") ha sido registrado y georreferenciado con éxito en el mapa!`,
      time: 'Hace unos instantes',
      read: false,
      reportId: newReport.id,
    };
    setNotifications((prev) => [newNotify, ...prev]);
  };

  // Handle appending comments on detail screen
  const handleAddComment = (reportId: string, newComment: Comment) => {
    setReports((prev) => 
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            comments: [commentWithTimestamp(newComment), ...(rep.comments || [])],
          };
        }
        return rep;
      })
    );
  };

  const commentWithTimestamp = (c: Comment) => ({
    ...c,
    timeAgo: 'Hace unos instantes',
  });

  const handleSelectReportId = (id: string) => {
    setPreviousPage(currentPage);
    setSelectedReportId(id);
    setCurrentPage('detalles-incidencia');
  };

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  return (
    <div className={`flex min-h-screen bg-[#FAFDF9] text-[#143B20] antialiased selection:bg-[#CCE8C6]/80 selection:text-[#0A3D18] ${
      isLoggedIn ? 'flex-col md:flex-row' : 'flex-col'
    }`}>
      
      {/* 1. Header (Only displayed if NOT logged in) */}
      {!isLoggedIn && (
        <Header 
          currentPage={currentPage} 
          setCurrentPage={handleSetPage} 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}

      {/* 2. Sidebar (Only displayed if LOGGED in AND not on auth screens) */}
      {isLoggedIn && !['login', 'signup'].includes(currentPage) && (
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handleSetPage} 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userProfile={userProfile}
        />
      )}

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Logged-In Top Header Bar */}
        {isLoggedIn && !['login', 'signup'].includes(currentPage) && (
          <header className="bg-white border-b border-[#E1ECE3] pl-16 md:pl-8 pr-4 md:pr-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            {/* Left contextual tag */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-mono font-black text-[#1E8344] uppercase tracking-wider bg-[#EBF7EE] px-2.5 py-1 rounded-lg">
                Ciudadano Activo
              </span>
            </div>

            {/* Right quick actions: View profile & Logout */}
            <div className="flex items-center space-x-3">
              {/* Notifications bell dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer relative ${
                    showNotificationsDropdown
                      ? 'bg-[#EBF7EE] border-[#1E8344] text-[#1E8344]'
                      : 'bg-[#FAFDF9] border-[#CDE1D1] hover:border-[#1E8344] text-[#557D5E]'
                  }`}
                  title="Notificaciones"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <>
                    {/* Click catcher background overlay to dismiss safely */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotificationsDropdown(false)}
                    />
                    
                    {/* Popover dropdown container */}
                    <div className="absolute right-0 mt-2.5 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-[#CBDCD0] overflow-hidden z-50 animate-slide-up flex flex-col max-h-[440px]">
                      {/* Header */}
                      <div className="bg-[#FAFDF9] border-b border-[#CBDCD0]/50 px-4 py-3 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-[#143B20] uppercase tracking-wider flex items-center gap-1.5">
                          <Inbox className="w-3.5 h-3.5 text-[#1E8344]" />
                          <span>Notificaciones</span>
                        </span>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            }}
                            className="text-[10px] font-black text-[#1E8344] hover:text-[#0b5425] transition-colors cursor-pointer"
                          >
                            Marcar leídas
                          </button>
                        )}
                      </div>

                      {/* Notification collection list */}
                      <div className="overflow-y-auto divide-y divide-slate-100 flex-1 max-h-[320px]">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400 font-bold leading-normal">
                            No tienes ninguna notificación por el momento.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                // Mark single notification read
                                setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                                setShowNotificationsDropdown(false);
                                if (n.reportId) {
                                  handleSelectReportId(n.reportId);
                                }
                              }}
                              className={`p-3.5 text-left transition-colors cursor-pointer relative ${
                                n.read ? 'bg-white hover:bg-[#F3FAF4]/35' : 'bg-[#EBF7EE]/10 hover:bg-[#EBF7EE]/30 border-l-2 border-l-[#1E8344]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="text-[11.5px] font-extrabold text-[#143B20] leading-tight pr-3">
                                  {n.title}
                                </h4>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 bg-[#1E8344] rounded-full shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-[10.5px] text-[#557B5E] font-semibold leading-relaxed mt-1">
                                {n.message}
                              </p>
                              <span className="text-[8.5px] font-mono text-slate-400 font-black block mt-1.5">
                                {n.time}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile card link */}
              <button 
                onClick={() => handleSetPage('editar-perfil')}
                className="flex items-center space-x-2 p-0.5 px-2.5 bg-[#FAFDF9] border border-[#CDE1D1] hover:border-[#1E8344] rounded-full transition-all cursor-pointer group text-left shadow-xs"
                title="Modificar mi Perfil"
              >
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-7 h-7 rounded-full object-cover border border-[#C5DDCB] group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[10.5px]">
                  <p className="font-extrabold text-[#143B20] leading-none group-hover:text-[#1E8344] transition-colors">
                    {userProfile.name}
                  </p>
                  <p className="text-[8.5px] text-[#557B5E] font-semibold leading-none uppercase tracking-wider block mt-0.5 max-w-[120px] truncate">
                    {userProfile.level}
                  </p>
                </div>
              </button>

              {/* Logout button */}
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  handleSetPage('inicio');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 font-bold hover:bg-rose-100 hover:border-rose-200 text-rose-700 rounded-full text-[11px] transition-all cursor-pointer active:scale-95"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden xs:inline">Cerrar Sesión</span>
              </button>
            </div>
          </header>
        )}
        
        {/* Main Screen Router Box with smooth fades */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {currentPage === 'inicio' && (
                <LandingScreen
                  reports={reports}
                  contributors={INITIAL_CONTRIBUTORS}
                  setCurrentPage={handleSetPage}
                  onSelectReportId={handleSelectReportId}
                />
              )}

              {currentPage === 'dashboard' && (
                <DashboardScreen
                  reports={reports}
                  userProfile={userProfile}
                  setCurrentPage={handleSetPage}
                  setIsLoggedIn={setIsLoggedIn}
                  onSelectReportId={handleSelectReportId}
                />
              )}

              {currentPage === 'reportes' && (
                <ExploreReportsScreen
                  reports={reports}
                  setCurrentPage={handleSetPage}
                  onSelectReportId={handleSelectReportId}
                />
              )}

              {currentPage === 'comunidad' && (
                <CommunityScreen
                  setCurrentPage={handleSetPage}
                  userProfile={userProfile}
                  isLoggedIn={isLoggedIn}
                  reports={reports}
                  onSelectReportId={handleSelectReportId}
                />
              )}

              {currentPage === 'reportar' && (
                <ReportFormScreen
                  onAddReport={handleAddReport}
                  setCurrentPage={handleSetPage}
                  onSelectReportId={handleSelectReportId}
                  currentUser={userProfile}
                  prefilledLocation={prefilledLocation}
                  onClearPrefilledLocation={() => setPrefilledLocation(null)}
                />
              )}

              {currentPage === 'detalles-incidencia' && (
                <ReportDetailScreen
                  report={activeReport}
                  setCurrentPage={handleSetPage}
                  onAddComment={handleAddComment}
                  currentUser={userProfile}
                  previousPage={previousPage}
                />
              )}

              {currentPage === 'login' && (
                <LoginScreen
                  setCurrentPage={handleSetPage}
                  setIsLoggedIn={setIsLoggedIn}
                  authMessage={authMessage}
                />
              )}

              {currentPage === 'signup' && (
                <SignupScreen
                  setCurrentPage={handleSetPage}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserProfile={setUserProfile}
                />
              )}

              {currentPage === 'acerca-de' && (
                <AboutScreen 
                  setCurrentPage={handleSetPage} 
                />
              )}

              {currentPage === 'mis-reportes' && (
                <MyReportsScreen
                  reports={reports}
                  userProfile={userProfile}
                  setCurrentPage={handleSetPage}
                  onSelectReportId={handleSelectReportId}
                />
              )}

              {currentPage === 'explorar-mapa' && (
                <ExplorarMapaScreen
                  reports={reports}
                  setCurrentPage={handleSetPage}
                  onSelectReportId={handleSelectReportId}
                  focusedReportId={selectedReportId}
                  onReportLocation={handleReportAtLocation}
                />
              )}

              {currentPage === 'editar-perfil' && (
                <EditProfileScreen
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                  setCurrentPage={handleSetPage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Persistent Brand Footer */}
        <Footer setCurrentPage={handleSetPage} />
      </div>

    </div>
  );
}
