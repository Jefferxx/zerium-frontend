import api from './api';

export const getDashboardStats = async () => {
  // Llama al endpoint que acabamos de crear
  const response = await api.get('/dashboard/stats');
  return response.data;
};