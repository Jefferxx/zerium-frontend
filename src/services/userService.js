import api from './api';

// Obtener todos los usuarios (Rol admin o visualización general)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// --- NUEVO: Función para buscar ID por Email ---
export const getTenantIdByEmail = async (email) => {
  try {
    // 1. Traemos la lista de usuarios
    // (Nota: En producción idealmente tendrías un endpoint /users/search?email=x)
    const users = await getAllUsers();
    
    // 2. Buscamos coincidencia exacta ignorando mayúsculas
    const tenant = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!tenant) return null;
    return tenant.id; // Retorna el UUID (ej: "a1b2-c3d4-e5f6...")
  } catch (error) {
    console.error("Error buscando inquilino:", error);
    return null;
  }
};