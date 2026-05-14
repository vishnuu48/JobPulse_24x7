import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const jobsApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getBySlug: (slug) => api.get(`/jobs/${slug}`),
  getById: (id) => api.get(`/jobs/admin/${id}`),
  getFeatured: () => api.get('/jobs/featured'),
  getLatest: () => api.get('/jobs/latest'),
  search: (params) => api.get('/jobs/search', { params }),
  getByLocation: (city, params) => api.get(`/jobs/location/${city}`, { params }),
  getStats: () => api.get('/jobs/stats'),
  getAllAdmin: (params) => api.get('/jobs/admin/all', { params }),
  trackApplyClick: (id) => api.post(`/jobs/${id}/apply-click`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('jobImage', file);

    return api.post('/jobs/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  toggle: (id) => api.put(`/jobs/${id}/toggle`),
  delete: (id) => api.delete(`/jobs/${id}`)
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

export const contactApi = {
  sendMessage: (data) => api.post('/contact', data)
};

export default api;
