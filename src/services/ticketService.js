import api from './api';

// 1. Crear un nuevo ticket
export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets/', ticketData);
  return response.data;
};

// 2. Obtener mis tickets
// NOTA: Lo renombramos a 'getMyTickets' para que coincida con tu TicketList.jsx
export const getMyTickets = async () => {
  const response = await api.get('/tickets/');
  return response.data;
};

// 3. Actualizar ESTADO del ticket (Nueva función PATCH)
export const updateTicketStatus = async (ticketId, newStatus) => {
  // Enviamos { status: 'in_progress' } al backend
  const response = await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
  return response.data;
};