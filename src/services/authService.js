import api from './api';

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    // GUARDAMOS EL ROL Y EL ID
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('userId', response.data.user_id);
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');   // Limpiamos al salir
  localStorage.removeItem('userId');
};

export const getCurrentRole = () => {
  return localStorage.getItem('role');
};