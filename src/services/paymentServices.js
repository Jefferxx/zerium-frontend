import api from './api';

// 1. Registrar un nuevo pago
export const createPayment = async (paymentData) => {
    const response = await api.post('/payments/', paymentData);
    return response.data;
};

// 2. Obtener historial (ESTA ES LA QUE FALTA)
export const getMyPaymentsHistory = async () => {
    const response = await api.get('/payments/my-history');
    return response.data;
};

// 3. Obtener historial de un contrato específico
export const getContractPayments = async (contractId) => {
    const response = await api.get(`/payments/contract/${contractId}`);
    return response.data;
};