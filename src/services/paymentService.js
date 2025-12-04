import api from './api';

// CORRECCIÓN 1: Usar query params para filtrar
export const getPaymentsByContract = async (contractId) => {
  // Esto genera: GET /payments?contract_id=...
  const response = await api.get('/payments', {
    params: { contract_id: contractId }
  });
  return response.data;
};

// CORRECCIÓN 2: Asegurar la ruta base para el POST
export const createPaymentObligation = async (paymentData) => {
  const response = await api.post('/payments/', paymentData);
  return response.data;
};

// CORRECCIÓN 3: Apuntar al endpoint específico de "pay"
export const registerPayment = async (paymentId, paymentData) => {
  const response = await api.put(`/payments/${paymentId}/pay`, paymentData);
  return response.data;
};