import api from './api';

// Crear un nuevo contrato
export const createContract = async (contractData) => {
  const response = await api.post('/contracts/', contractData);
  return response.data;
};

// Obtener todos los contratos (del usuario logueado)
export const getContracts = async () => {
  const response = await api.get('/contracts/');
  return response.data;
};

// --- ESTA ES LA QUE FALTABA ---
// Obtener un contrato por ID (para el detalle)
export const getContractById = async (id) => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};