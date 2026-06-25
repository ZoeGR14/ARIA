/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { IncidentReport, Comment } from './types';
import { getReportesActivos } from './services/reportesService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingScreen from './components/LandingScreen';
import DashboardScreen from './components/DashboardScreen';
import LoginScreen from './components/LoginScreen';
import VerifyEmailScreen from "./components/VerifyEmailScreen.tsx";
import SignupScreen from './components/SignupScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import ReportFormScreen from './components/ReportFormScreen';
import ReportDetailScreen from './components/ReportDetailScreen';
import ExploreReportsScreen from './components/ExploreReportsScreen';
import AboutScreen from './components/AboutScreen';
import MyReportsScreen from './components/MyReportsScreen';
import ExplorarMapaScreen from './components/ExplorarMapaScreen';
import EditProfileScreen from './components/EditProfileScreen';
import CommunityScreen from './components/CommunityScreen';
import ChangePasswordScreen from './components/EditPassword';
import AdminUsuariosScreen from './components/AdminUsuariosScreen';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Bell, Inbox, Check, Sparkles, Mail, Loader2 } from 'lucide-react';
import PrivacyScreen from './components/PrivacyScreen';
import { getToken, deleteToken, onMessage, isSupported } from 'firebase/messaging';
import { messaging } from './firebase';
import { useToast } from './contexts/ToastContext';

const CARLOS_MENDOZA_PROFILE = {
  name: 'Carlos Mendoza',
  avatar: "https://tse4.mm.bing.net/th/id/OIP.dDKYQqVBsG1tIt2uJzEJHwHaHa?cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3",
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

let isLoggingOutFlag = false;

function PrivateRoute({ children, isLoggedIn, message }: { children: React.ReactNode; isLoggedIn: boolean; message?: string }) {
  if (!isLoggedIn) {
    if (isLoggingOutFlag) return null;
    return <Navigate to="/login" state={{ authMessage: message }} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState(CARLOS_MENDOZA_PROFILE);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [prefilledLocation, setPrefilledLocation] = useState<{ address: string; coordinates: string } | null>(null);
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleShowVerification = (email: string) => {
    setVerificationEmail(email);
    setShowVerificationModal(true);
  };

  // Load session from localStorage on startup
  useEffect(() => {
    const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
    const userStr = localStorage.getItem('aria_user') || sessionStorage.getItem('aria_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        let userAvatar = user.avatar_url;
        if (userAvatar && userAvatar.includes('/uploads/')) {
          userAvatar = '/uploads/' + userAvatar.split('/uploads/').slice(1).join('/uploads/');
          userAvatar = userAvatar.replace(/\/+/g, '/');
        }

        const mappedProfile = {
          id: user.id,
          name: user.nombre_completo,
          email: user.correo_electronico,
          avatar:
              (!userAvatar || userAvatar === '')
                  ? "https://tse4.mm.bing.net/th/id/OIP.dDKYQqVBsG1tIt2uJzEJHwHaHa?cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3"
                  : userAvatar,
          role: user.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Ciudadano Activo',
          bio: `Hola, soy ${(user.nombre_completo || 'Usuario').split(' ')[0]}. Me interesa el monitoreo ambiental y registrar incidencias para cooperar de manera constructiva con mi comunidad local.`,
          location: 'CDMX, MX',
          level: user.nivel_ranking || 'Novato',
          impactScore: user.puntos_totales || 0,
          pointsThisMonth: user.puntos_totales || 0,
          totalsCount: 0,
          validatedCount: 0,
          contributionsCount: 0,
        };
        setUserProfile(mappedProfile);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error loading cached user session:", e);
        localStorage.removeItem('aria_token');
        localStorage.removeItem('aria_user');
        sessionStorage.removeItem('aria_token');
        sessionStorage.removeItem('aria_user');
      }
    }
  }, []);

  // Cargar notificaciones reales al iniciar sesión
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
      if (token) {
        fetch('/api/notificaciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
             if (Array.isArray(data)) {
             const mapped = data.map(n => {
               let title = 'Notificación';
               if (n.tipo === 'SISTEMA_ALERTA') title = 'Alerta Crítica';
               else if (n.tipo === 'ESTADO_REPORTE') title = 'Actualización de tu reporte 📋';
               else if (n.tipo === 'PUNTOS_OTORGADOS') title = '¡Puntos ganados! 🌟';
               
               return {
                 id: String(n.id),
                 title: title,
                 message: n.mensaje,
                 time: new Date(n.fecha_hora).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
                 read: n.leido,
                 reportId: n.reporte_id ? String(n.reporte_id) : undefined
               };
             });
             setNotifications(mapped);
           }
        })
        .catch(console.error);
      }
    } else {
      setNotifications([]);
    }
  }, [isLoggedIn]);

  // Listen for FCM messages
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupOnMessage = async () => {
      try {
        const supported = await isSupported();
        if (!supported) return;

        unsubscribe = onMessage(messaging, (message) => {
          console.log("Mensaje recibido:", message);
          if (message.notification) {
            const newNotify = {
              id: `n-fcm-${Date.now()}`,
              title: message.notification.title || 'Nueva Notificación',
              message: message.notification.body || '',
              time: 'Hace unos instantes',
              read: false,
              reportId: message.data?.reportId,
            };
            setNotifications((prev) => [newNotify, ...prev]);

            let toastType: 'info' | 'success' | 'warning' | 'error' = 'info';
            if (newNotify.title.includes('Alerta')) toastType = 'error';
            else if (newNotify.title.includes('Puntos') || newNotify.title.includes('registrado')) toastType = 'success';
            else if (newNotify.title.includes('Actualización')) toastType = 'info';

            addToast({
              title: newNotify.title,
              message: newNotify.message,
              type: toastType,
              duration: 6000
            });
          }
        });
      } catch (err) {
        console.log("No se pudo iniciar el listener de mensajes FCM: ", err);
      }
    };

    setupOnMessage();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Navegador Desconocido";
    let os = "SO Desconocido";

    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1) browser = "Microsoft Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Google Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Apple Safari";

    if (ua.indexOf("Windows NT 10.0") > -1) os = "Windows 10/11";
    else if (ua.indexOf("Windows NT 6.2") > -1) os = "Windows 8";
    else if (ua.indexOf("Windows NT 6.1") > -1) os = "Windows 7";
    else if (ua.indexOf("Macintosh") > -1) os = "macOS";
    else if (ua.indexOf("iPhone") > -1) os = "iOS";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("Linux") > -1) os = "Linux";

    return `${browser} en ${os} (Escritorio/Móvil)`;
  };

  // Save FCM token for the user if they don't have it saved
  useEffect(() => {
    const handleFcmTokenRegistration = async () => {
      if (!isLoggedIn) return;

      const tokenJwt = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
      if (!tokenJwt) return;

      try {
        const supported = await isSupported();
        if (!supported) return;

        const fcmToken = await getToken(messaging, {
          vapidKey: "BIB4QGDhC2lIgmT_MkMSWiumWu4d4e34XDzekN8VOxPRHJzNyiNbnGpM_3_OSj7gAeqPWjm2IdLnNGxqR_gyW-I"
        }).catch(error => {
          console.log("Error al generar el token FCM: ", error);
          return null;
        });

        if (!fcmToken) {
          console.log("No se pudo generar el token FCM o permiso denegado");
          return;
        }

        console.log("Token FCM obtenido: ", fcmToken);
        localStorage.setItem('aria_fcm_token', fcmToken);

        const devicesRes = await fetch('/api/fcm/mis-dispositivos', {
          headers: {
            'Authorization': `Bearer ${tokenJwt}`
          }
        });

        if (devicesRes.ok) {
          const devices = await devicesRes.json();
          const alreadySaved = devices.some((d: any) => d.fcm_token === fcmToken);
          if (alreadySaved) {
            console.log("El dispositivo ya está registrado en la base de datos");
            return;
          }
        }

        const deviceInfo = getDeviceInfo();
        const registerRes = await fetch('/api/fcm/fcm-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJwt}`
          },
          body: JSON.stringify({
            fcmToken,
            dispositivoInfo: deviceInfo
          })
        });

        if (registerRes.ok) {
          console.log("Token FCM y info de dispositivo guardados exitosamente");
        } else {
          const errData = await registerRes.json();
          console.warn("Error al registrar token FCM en base de datos: ", errData.mensaje);
        }

      } catch (err) {
        console.error("Error en el flujo de registro FCM: ", err);
      }
    };

    handleFcmTokenRegistration();
  }, [isLoggedIn]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    getReportesActivos().then(setReports);

    // Poll active reports every 10 seconds to sync updates across different sessions in real-time
    const interval = setInterval(() => {
      getReportesActivos().then(setReports);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleReportAtLocation = (address: string, coordinates: string) => {
    setPrefilledLocation({ address, coordinates });
    navigate('/reportar');
  };

  // Handle adding a brand new incident report
  const handleAddReport = (newReport: IncidentReport) => {
    setReports((prev) => [newReport, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      totalsCount: prev.totalsCount + 1,
      impactScore: Math.min(prev.impactScore + 2, 100),
      pointsThisMonth: prev.pointsThisMonth + 5,
    }));

    const newNotify = {
      id: `n-new-${Date.now()}`,
      title: 'Reporte registrado',
      message: `¡Tu reporte de ${newReport.category} ("${newReport.title}") ha sido registrado y georreferenciado con éxito en el mapa!`,
      time: 'Hace unos instantes',
      read: false,
      reportId: newReport.id,
    };
    setNotifications((prev) => [newNotify, ...prev]);
    addToast({
      title: newNotify.title,
      message: newNotify.message,
      type: 'success',
      duration: 5000
    });
  };

  // Handle appending comments on detail screen
  const handleAddComment = (reportId: string, newComment: Comment) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            comments: [{ ...newComment, timeAgo: 'Hace unos instantes' }, ...(rep.comments || [])],
          };
        }
        return rep;
      })
    );
  };

  // Handle updating report status/points globally
  const handleUpdateReport = (reportId: string, updatedFields: Partial<IncidentReport>) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === reportId ? { ...rep, ...updatedFields } : rep))
    );
  };

  const isAuthScreen = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className={`flex min-h-screen bg-[#FAFDF9] text-[#143B20] antialiased selection:bg-[#CCE8C6]/80 selection:text-[#0A3D18] ${
      isLoggedIn ? 'flex-col md:flex-row' : 'flex-col'
    }`}>

      {/* 1. Header (Only displayed if NOT logged in) */}
      {!isLoggedIn && (
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}

      {/* 2. Sidebar (Only displayed if LOGGED in AND not on auth screens) */}
      {isLoggedIn && !isAuthScreen && (
        <Sidebar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userProfile={userProfile}
        />
      )}

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Logged-In Top Header Bar */}
        {isLoggedIn && !isAuthScreen && (
          <header className="bg-white border-b border-[#E1ECE3] pl-16 md:pl-8 pr-4 md:pr-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            {/* Left contextual tag */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-mono font-black text-[#1E8344] uppercase tracking-wider bg-[#EBF7EE] px-2.5 py-1 rounded-lg">
                {userProfile.role}
              </span>
            </div>

            {/* Right quick actions: View profile & Logout */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Notifications bell dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer relative ${showNotificationsDropdown
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
                    <div className="absolute right-0 sm:right-0 mt-2.5 w-[280px] sm:w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#CBDCD0] overflow-hidden z-50 animate-slide-up flex flex-col max-h-[440px]">
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
                              const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
                              fetch('/api/notificaciones/leer-todas', {
                                method: 'PATCH',
                                headers: { 'Authorization': `Bearer ${token}` }
                              }).catch(console.error);
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
                                setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                                setShowNotificationsDropdown(false);
                                if (!n.read && !n.id.toString().startsWith('n-')) {
                                  const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
                                  fetch(`/api/notificaciones/${n.id}/leer`, {
                                    method: 'PATCH',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  }).catch(console.error);
                                }
                                if (n.reportId) {
                                  navigate('/reporte/' + n.reportId);
                                }
                              }}
                              className={`p-3.5 text-left transition-colors cursor-pointer relative ${n.read ? 'bg-white hover:bg-[#F3FAF4]/35' : 'bg-[#EBF7EE]/10 hover:bg-[#EBF7EE]/30 border-l-2 border-l-[#1E8344]'
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
                onClick={() => navigate('/editar-perfil')}
                className="flex items-center space-x-0 sm:space-x-2 p-0 sm:p-0.5 sm:px-2.5 bg-transparent sm:bg-[#FAFDF9] border-0 sm:border border-[#CDE1D1] hover:border-[#1E8344] rounded-full transition-all cursor-pointer group text-left shadow-none sm:shadow-xs"
                title="Modificar mi Perfil"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#C5DDCB] group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block text-[10px]">
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
                onClick={async () => {
                  isLoggingOutFlag = true;
                  setIsLoggingOut(true);
                  try {
                    const currentToken = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
                    if (currentToken && await isSupported()) {
                      const fcmToken = localStorage.getItem('aria_fcm_token');

                      if (fcmToken) {
                        // Notificamos al backend para que lo borre de sus registros
                        await fetch('/api/fcm/fcm-token', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currentToken}`
                          },
                          body: JSON.stringify({ fcmToken })
                        }).catch(console.error);

                        // Lo borramos del navegador
                        await deleteToken(messaging).catch(console.error);
                      }
                    }
                  } catch (e) {
                    console.error("Error al limpiar token FCM en logout", e);
                  } finally {
                    localStorage.removeItem('aria_token');
                    localStorage.removeItem('aria_user');
                    localStorage.removeItem('aria_fcm_token');
                    sessionStorage.removeItem('aria_token');
                    sessionStorage.removeItem('aria_user');
                    setIsLoggedIn(false);
                    setIsLoggingOut(false);
                    navigate('/', { replace: true });
                    setTimeout(() => {
                      isLoggingOutFlag = false;
                    }, 100);
                  }
                }}
                disabled={isLoggingOut}
                className="flex items-center space-x-0 sm:space-x-1.5 p-2 sm:px-3 sm:py-1.5 bg-rose-50 border border-rose-100 font-bold hover:bg-rose-100 hover:border-rose-200 text-rose-700 rounded-full text-[11px] transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </header>
        )}

        {/* Main Screen Router Box with smooth fades */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
               <Routes>
                <Route path="/privacidad" element={<PrivacyScreen />} />
                <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingScreen reports={reports} />} />
                <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginScreen setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} onShowVerification={handleShowVerification} />} />
                 <Route path="/verificar-correo/:token" element={<VerifyEmailScreen />}/>
                 <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignupScreen setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} onShowVerification={handleShowVerification} />} />
                <Route path="/reset-password" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ResetPasswordScreen />} />
                <Route path="/acerca-de" element={<AboutScreen />} />
                <Route path="/dashboard" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para acceder a esta sección.">
                    <DashboardScreen reports={reports} userProfile={userProfile} setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />
                  </PrivateRoute>
                } />
                <Route path="/reportar" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para poder reportar una incidencia ambiental.">
                    <ReportFormScreen onAddReport={handleAddReport} currentUser={userProfile} prefilledLocation={prefilledLocation} onClearPrefilledLocation={() => setPrefilledLocation(null)} />
                  </PrivateRoute>
                } />
                <Route path="/reportes" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para poder explorar e inspeccionar el mapa de incidencias.">
                    <ExploreReportsScreen reports={reports} userProfile={userProfile}/>
                  </PrivateRoute>
                } />
                 <Route path="/gestionar-usuarios" element={
                   <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para administrar usuarios.">
                     <AdminUsuariosScreen userProfile={userProfile} />
                   </PrivateRoute>
                 } />
                <Route path="/mis-reportes" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para ver tus reportes.">
                    <MyReportsScreen reports={reports} userProfile={userProfile} />
                  </PrivateRoute>
                } />
                <Route path="/explorar-mapa" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para poder explorar e inspeccionar el mapa de incidencias.">
                    <ExplorarMapaScreen reports={reports} onReportLocation={handleReportAtLocation} userProfile={userProfile} />
                  </PrivateRoute>
                } />
                <Route path="/comunidad" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para ver los perfiles de la comunidad y repasar sus reportes.">
                    <CommunityScreen userProfile={userProfile} isLoggedIn={isLoggedIn} reports={reports} />
                  </PrivateRoute>
                } />
                 <Route path="/editar-perfil" element={
                   <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para modificar tu perfil.">
                     <EditProfileScreen userProfile={userProfile} setUserProfile={setUserProfile} setIsLoggedIn={setIsLoggedIn} />
                   </PrivateRoute>
                 } />
                 <Route path="/cambiar-password" element={
                   <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para cambiar tu contraseña.">
                     <ChangePasswordScreen />
                   </PrivateRoute>
                 } />
                <Route path="/reporte/:id" element={
                  <PrivateRoute isLoggedIn={isLoggedIn} message="Debes iniciar sesión para poder explorar e inspeccionar el mapa de incidencias.">
                    <ReportDetailScreen 
                      reports={reports} 
                      onAddComment={handleAddComment} 
                      onUpdateReport={handleUpdateReport}
                      currentUser={userProfile} 
                    />
                  </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Persistent Brand Footer */}
        <Footer />
      </div>

      {/* Verification Modal Popup */}
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1F10]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#CDE1D1]"
            >
              <div className="bg-gradient-to-tr from-[#1E8344] via-[#33A25A] to-[#8AD690] p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-md mb-4 shadow-lg border border-white/30">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Verifica tu Correo</h3>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-[#4F6C56] font-medium leading-relaxed">
                    Hemos enviado un enlace de confirmación a:
                  </p>
                  <p className="font-bold text-[#143B20] bg-[#F3FAF4] border border-[#CDE1D1] py-2 px-4 rounded-xl inline-block truncate max-w-full text-sm">
                    {verificationEmail || "tu correo"}
                  </p>
                </div>
                <p className="text-xs text-[#557C5E] font-medium leading-relaxed">
                  Por favor, revisa tu bandeja de entrada o carpeta de spam y haz click en el enlace para activar tu cuenta. Una vez verificada, podrás iniciar sesión.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowVerificationModal(false);
                      navigate('/login');
                    }}
                    className="w-full bg-[#1E8344] hover:bg-[#166634] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0A1F10]/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-[#CDE1D1] text-center"
            >
              <div className="mx-auto w-16 h-16 bg-[#F3FAF4] rounded-full flex items-center justify-center mb-4 border border-[#CDE1D1]">
                <Loader2 className="w-8 h-8 text-[#1E8344] animate-spin" />
              </div>
              <h3 className="text-xl font-black text-[#143B20] tracking-tight mb-2">Cerrando sesión</h3>
              <p className="text-sm text-[#557B5E] font-medium leading-relaxed">
                Por favor espera un momento mientras cerramos tu sesión de forma segura...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
