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

// Firmar contrato (Inquilino)
export const signContract = async (id) => {
  const response = await api.post(`/contracts/${id}/sign`);
  return response.data;
};

// Finalizar contrato (Dueño)
export const finalizeContract = async (id) => {
  const response = await api.post(`/contracts/${id}/finalize`);
  return response.data;
};