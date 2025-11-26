import api from './api';

export const login = async (email, password) => {
  // FastAPI espera un form-data para OAuth2, no un JSON simple
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await api.post('/auth/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};