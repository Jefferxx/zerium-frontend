import api from './api';

// Crear un nuevo ticket
export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

// Obtener todos los tickets
export const getTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

// Actualizar ticket (Resolver/Cerrar)
export const updateTicket = async (ticketId, updateData) => {
  const response = await api.put(`/tickets/${ticketId}`, updateData);
  return response.data;
};