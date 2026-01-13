import api from './api';

// Crear un nuevo contrato
export const createContract = async (contractData) => {
  const response = await api.post('/contracts/', contractData);
  return response.data;
};

// Obtener todos los contratos del usuario
export const getMyContracts = async () => {
  const response = await api.get('/contracts/');
  return response.data;
};

// Obtener un contrato por ID
export const getContractById = async (id) => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

// --- NUEVA FUNCIÓN: Firmar contrato ---
export const signContract = async (id) => {
  // Llama al endpoint que creamos en el backend para cambiar el estado a 'active'
  const response = await api.post(`/contracts/${id}/sign`);
  return response.data;
};