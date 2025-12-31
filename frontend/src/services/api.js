import axios from 'axios';
import { storage } from '../utils/helpers';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Prefer parsed token from storage helper to avoid quoted strings
    let token = storage.get('token');
    if (!token) {
      token = localStorage.getItem('token');
    }
    if (typeof token === 'string') {
      // Strip accidental surrounding quotes if any
      const cleaned = token.replace(/^"|"$/g, '');
      if (cleaned) {
        config.headers.Authorization = `Bearer ${cleaned}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', error.response.data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', error.response.data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', error.response.data.message);
          break;
        default:
          console.error('API error:', error.response.data.message);
      }

      // Return the error response data
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection and try again.',
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        success: false,
        message: 'An unexpected error occurred.',
      });
    }
  }
);

// Auth API functions (Unified)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials)
};

// Admin API functions
export const adminAPI = {
  // Authentication
  login: (credentials) => api.post('/admin/login', credentials),
  register: (userData) => api.post('/admin/register', userData),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (updates) => api.put('/admin/profile', updates),
};

// Intern API functions
export const internAPI = {
  // Get all interns with filtering
  getAll: (params = {}) => api.get('/interns', { params }),

  // Get intern statistics
  getStats: () => api.get('/interns/stats'),

  // Get single intern
  getById: (id) => api.get(`/interns/${id}`),

  // Create new intern
  create: (internData) => api.post('/interns', internData),

  // Update intern
  update: (id, updates) => api.put(`/interns/${id}`, updates),

  // Delete intern
  delete: (id) => api.delete(`/interns/${id}`),

  // Toggle certificate access
  toggleCertificateAccess: (id) => api.post(`/interns/${id}/toggle-certificate-access`),
};

// User API functions
export const userAPI = {
  // User login
  login: (credentials) => api.post('/user/login', credentials),

  // Get user profile
  getProfile: () => api.get('/user/profile'),

  // Check certificate status
  getCertificateStatus: () => api.get('/user/certificate-status'),
};

// Feedback API functions
export const feedbackAPI = {
  submit: (payload) => api.post('/feedback', payload),
  getAll: () => api.get('/feedback/list'),
  delete: (id) => api.delete(`/feedback/${id}`)
};

// Certificate API functions
export const certificateAPI = {
  // Download certificate
  download: async (internId) => {
    try {
      const response = await api.get(`/certificate/${internId}`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Generate certificate preview (admin only)
  preview: async (internId) => {
    try {
      const response = await api.post(`/certificate/preview/${internId}`, {}, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk generate certificates (admin only)
  bulkGenerate: (internIds) => api.post('/certificate/bulk-generate', { internIds }),

  // Validate certificate eligibility
  validate: (internId) => api.get(`/certificate/validate/${internId}`),

  // Public certificate verification
  verify: (internId) => api.get(`/certificate/verify/${internId}`),
};

// Utility functions
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default api;