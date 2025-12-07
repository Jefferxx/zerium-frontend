import api from './api';

// Registrar un nuevo pago
export const createPayment = async (paymentData) => {
  // paymentData debe tener: { contract_id, amount, payment_method, notes }
  const response = await api.post('/payments/', paymentData);
  return response.data;
};

// Obtener historial de pagos de un contrato
export const getContractPayments = async (contractId) => {
  const response = await api.get(`/payments/contract/${contractId}`);
  return response.data;
};