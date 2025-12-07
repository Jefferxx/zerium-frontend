import api from './api';

// Iniciar Sesión
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

// Cerrar Sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');   // Limpiamos al salir
  localStorage.removeItem('userId');
};

// Obtener Rol Actual
export const getCurrentRole = () => {
  return localStorage.getItem('role');
};

// --- NUEVA FUNCIÓN: REGISTRO DE USUARIO ---
export const registerUser = async (userData) => {
  // userData debe ser un objeto: { email, password, full_name, phone_number, role }
  const response = await api.post('/users/', userData);
  return response.data;
};