import React, { useState, useEffect } from 'react';
import { Users, Trash2, AlertCircle, Search, CheckCircle } from 'lucide-react';
import { eliminarUsuario } from '../services/authService';

interface AdminUsuariosScreenProps {
    userProfile: { role: string; };
}

export default function AdminUsuariosScreen({ userProfile }: AdminUsuariosScreenProps) {
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Nuevos estados para la lista de usuarios
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
                const apiUrl = import.meta.env.VITE_API_URL;

                // NOTA: Asegúrate de tener este endpoint creado en tu backend
                const response = await fetch(`${apiUrl}/auth/usuarios`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsuarios(data);
                }
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        if (userProfile?.role === 'Administrador') {
            fetchUsuarios();
        }
    }, [userProfile]);

    if (userProfile?.role !== 'Administrador') {
        return <div className="p-8 text-center font-bold text-rose-600">Acceso Denegado</div>;
    }

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userIdToDelete.trim()) return;

        if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el usuario con ID: ${userIdToDelete}?`)) return;

        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('aria_token') || sessionStorage.getItem('aria_token');
            await eliminarUsuario(userIdToDelete, token as string);

            setMessage({ text: `Usuario ${userIdToDelete} eliminado exitosamente.`, type: 'success' });
            setUserIdToDelete('');
            // Actualizar la lista removiendo al usuario eliminado
            setUsuarios(usuarios.filter(u => String(u.id) !== userIdToDelete));
        } catch (error: any) {
            setMessage({ text: error.message || 'Ocurrió un error al intentar eliminar el usuario.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios en la tabla
    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.correo_electronico?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#FAFDF9] py-8 px-4 md:px-8 min-h-[calc(100vh-68px)]">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-[#143B20] tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#1E8344]" />
                        Gestión de Usuarios
                    </h1>
                    <p className="text-sm text-[#4F6C56] leading-relaxed">
                        Directorio de usuarios registrados. Selecciona el ID de un usuario para eliminar su cuenta del sistema.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda: Formulario de Eliminación */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-rose-700 mb-4 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" /> Zona de Peligro
                            </h3>

                            <form onSubmit={handleDelete} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider pl-1">
                                        ID del Usuario a Eliminar
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Selecciona de la tabla..."
                                        value={userIdToDelete}
                                        onChange={(e) => setUserIdToDelete(e.target.value)}
                                        className="w-full bg-[#F3FAF4] border border-[#CDE1D1] text-xs font-semibold rounded-xl py-3 px-4 text-[#143B20] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                                    />
                                </div>

                                {message && (
                                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                        message.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                        {message.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !userIdToDelete.trim()}
                                    className="w-full bg-rose-600 text-white font-extrabold py-3 px-6 rounded-xl hover:bg-rose-700 transition-all flex items-center justify-center space-x-2 text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{loading ? 'Procesando...' : 'Eliminar Permanentemente'}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Columna Derecha: Directorio de Usuarios */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-[#DDE7DE] p-6 shadow-sm flex flex-col h-[600px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h3 className="text-base font-bold text-[#143B20]">Directorio del Sistema</h3>
                            <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o correo..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-[#F3FAF4] border border-[#CDE1D1] rounded-xl text-xs focus:outline-none focus:border-[#1E8344]"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto border border-[#F0F6F1] rounded-xl">
                            {loadingUsers ? (
                                <div className="flex justify-center items-center h-full text-[#557B5E] text-sm">Cargando usuarios...</div>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#FAFDFC] border-b border-[#F0F6F1] sticky top-0">
                                    <tr>
                                        <th className="p-3 font-black text-slate-400 uppercase tracking-wider text-[10px]">Usuario</th>
                                        <th className="p-3 font-black text-slate-400 uppercase tracking-wider text-[10px] text-right">Acción</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0F6F1]">
                                    {usuariosFiltrados.map((u) => (
                                        <tr key={u.id} className="hover:bg-[#F3FAF4] transition-colors">
                                            <td className="p-3">
                                                <p className="font-bold text-[#143B20]">{u.nombre_completo}</p>
                                                <p className="text-[10px] text-[#557B5E]">{u.correo_electronico}</p>
                                            </td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => setUserIdToDelete(String(u.id))}
                                                    className="bg-[#EBF7EE] text-[#1E8344] hover:bg-[#DCE7DD] px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors"
                                                >
                                                    Seleccionar ID
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {usuariosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-6 text-center text-slate-400">No se encontraron usuarios</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}