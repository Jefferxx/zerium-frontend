import api from './api';

export const getMyProperties = async () => {
  // Llama al endpoint GET /properties del backend
  // Gracias al interceptor en api.js, el token se envía automático
  const response = await api.get('/properties');
  return response.data;
};

export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

export const getPropertyById = async (id) => {
  // Asumiendo que tu backend tiene un endpoint GET /properties/{id}
  // Si no lo tiene, usaremos el de listar y filtraremos en el cliente por ahora
  // OJO: Tu backend actual GET /properties devuelve TODO.
  // Para ser eficientes, vamos a filtrar aquí, pero lo ideal sería crear el endpoint en Python.
  
  const response = await api.get('/properties');
  const property = response.data.find(p => p.id === id);
  return property;
};