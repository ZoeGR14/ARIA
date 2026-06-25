function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || '/api';
}

export async function eliminarUsuario(id: string, token: string) {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/auth/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al eliminar el usuario (HTTP ${response.status})`);
    }

    return await response.json();
}