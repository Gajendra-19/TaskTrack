import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

// Task Services
export const taskService = {
  createTask: (title, description, status) =>
    api.post('/tasks', { title, description, status }),
  getTasks: () =>
    api.get('/tasks'),
  getTaskById: (id) =>
    api.get(`/tasks/${id}`),
  updateTask: (id, data) =>
    api.put(`/tasks/${id}`, data),
  deleteTask: (id) =>
    api.delete(`/tasks/${id}`)
};

export default api;
