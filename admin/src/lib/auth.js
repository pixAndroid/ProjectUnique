import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/api/admin/login', { email, password });
  const { token, user } = res.data.data;
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify(user));
  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/login';
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('adminUser'));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
