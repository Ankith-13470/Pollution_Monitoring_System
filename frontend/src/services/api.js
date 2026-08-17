import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Statistics
export const getStats = () => api.get('/stats');

// Authentication
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  signup: (username, email, password, fullName) => api.post('/auth/signup', { 
    username, 
    email, 
    password, 
    fullName 
  }),
  verify: (token) => api.post('/auth/verify', {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getMe: (token) => api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Locations
export const locationAPI = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
};

// Sources
export const sourceAPI = {
  getAll: () => api.get('/sources'),
  getByLocation: (locId) => api.get(`/sources/location/${locId}`),
};

// Pollutants
export const pollutantAPI = {
  getAll: () => api.get('/pollutants'),
  getStats: () => api.get('/pollutants/stats'),
};

// Measurements
export const measurementAPI = {
  getAll: () => api.get('/measurements'),
  create: (data) => api.post('/measurements', data),
  getCritical: () => api.get('/measurements/critical'),
};

// Actions
export const actionAPI = {
  getAll: () => api.get('/actions'),
};

// Authorities
export const authorityAPI = {
  getAll: () => api.get('/authorities'),
};

export default api;