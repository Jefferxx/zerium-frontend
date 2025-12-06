import api from './api';

export const getMyProperties = async () => {
  // Llama al endpoint GET /properties del backend
  const response = await api.get('/properties');
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

export const getPropertyById = async (id) => {
  // Backend actual devuelve lista completa, filtramos en cliente por ahora
  const response = await api.get('/properties');
  const property = response.data.find(p => p.id === id);
  return property;
};

// --- NUEVA FUNCIÓN PARA EDITAR ---
export const updateUnit = async (unitId, updateData) => {
  const response = await api.put(`/properties/units/${unitId}`, updateData);
  return response.data;
};