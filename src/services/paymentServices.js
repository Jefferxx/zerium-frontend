import api from './api';

// Registrar un nuevo pago
export const createPayment = async (paymentData) => {
  // paymentData debe tener: { contract_id, amount, payment_method, notes }
  const response = await api.post('/payments/', paymentData);
  return response.data;
};

// --- ESTA ERA LA QUE FALTABA ---
// Obtener historial de pagos del usuario logueado (Inquilino o Dueño)
export const getMyPaymentsHistory = async () => {
  const response = await api.get('/payments/my-history');
  return response.data;
};

// Obtener historial de pagos de un contrato específico
export const getContractPayments = async (contractId) => {
  const response = await api.get(`/payments/contract/${contractId}`);
  return response.data;
};