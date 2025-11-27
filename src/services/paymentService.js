import api from './api';

export const getPaymentsByContract = async (contractId) => {
  const response = await api.get(`/payments/contract/${contractId}`);
  return response.data;
};

export const createPaymentObligation = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const registerPayment = async (paymentId, paymentData) => {
  // paymentData debe incluir: status='paid', payment_date, transaction_id, etc.
  const response = await api.put(`/payments/${paymentId}`, paymentData);
  return response.data;
};