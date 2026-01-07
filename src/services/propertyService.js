import api from './api';

export const getMyProperties = async () => {
  try {
    // ⚠️ CAMBIO CLAVE: Agregamos la barra '/' al final
    // Esto evita que el backend haga el redirect que rompe el CORS
    const response = await api.get('/properties/'); 
    console.log("📡 Propiedades cargadas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en getMyProperties:", error);
    throw error;
  }
};

export const createProperty = async (propertyData) => {
  // También aquí agregamos la barra por seguridad
  const response = await api.post('/properties/', propertyData);
  return response.data;
};

export const getPropertyById = async (id) => {
  // Aquí también
  const response = await api.get('/properties/');
  const property = response.data.find(p => String(p.id) === String(id));
  return property;
};

export const updateUnit = async (unitId, updateData) => {
  const response = await api.put(`/properties/units/${unitId}`, updateData);
  return response.data;
};