import api from './api';

export const createContract = async (contractData) => {
  const response = await api.post('/contracts', contractData);
  return response.data;
};

export const getMyContracts = async () => {
  const response = await api.get('/contracts');
  return response.data;
};