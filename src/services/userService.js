import api from './api';

// Función para registrar un inquilino desde el panel del dueño (opcional)
export const registerTenant = async (tenantData) => {
  // Asumiendo que tienes un endpoint para esto o usas el registro público
  // Por ahora, usaremos el registro normal pero forzando el rol
  const payload = { ...tenantData, role: 'tenant' };
  const response = await api.post('/users', payload);
  return response.data;
};