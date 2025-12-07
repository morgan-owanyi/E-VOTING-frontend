import axios from 'axios';

// Configure your Django backend URL here
// Django default port is 8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://e-voting-backend-5087.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds - increased for Render cold starts
  withCredentials: true, // Important for Django CSRF
});

// Add request interceptor for adding auth tokens and CSRF
api.interceptors.request.use(
  (config) => {
    // Add Django auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`; // Django REST Framework uses 'Token' prefix
    }
    
    // Add CSRF token for Django
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// POSITION APIs
// ============================================

export const positionAPI = {
  // Get all positions
  getAll: async () => {
    const response = await api.get('/positions/');
    return response.data;
  },

  // Get single position by ID
  getById: async (id: string) => {
    const response = await api.get(`/positions/${id}`);
    return response.data;
  },

  // Create new position
  create: async (positionData: {
    title: string;
    description: string;
    numberOfPeople: number;
    duration: string;
    caution: string;
  }) => {
    const response = await api.post('/positions/', positionData);
    return response.data;
  },

  // Update position
  update: async (id: string, positionData: any) => {
    const response = await api.put(`/positions/${id}`, positionData);
    return response.data;
  },

  // Delete position
  delete: async (id: string) => {
    const response = await api.delete(`/positions/${id}`);
    return response.data;
  },
};

// ============================================
// VOTER APIs
// ============================================

export const voterAPI = {
  // Get all voters
  getAll: async () => {
    const response = await api.get('/voters/');
    return response.data;
  },

  // Add single voter
  addSingle: async (regNo: string) => {
    const response = await api.post('/voters/', { regNo });
    return response.data;
  },

  // Import multiple voters
  importCSV: async (voters: string[]) => {
    const response = await api.post('/voters/bulk/', { voters });
    return response.data;
  },

  // Verify voter
  verify: async (regNo: string) => {
    const response = await api.post('/voters/verify/', { regNo });
    return response.data;
  },
};

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  // Login
  login: async (credentials: { email: string; password: string; role?: string }) => {
    // Don't send role to backend - just use email/password
    const response = await api.post('/auth/login/', {
      email: credentials.email,
      password: credentials.password
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // Register
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

// ============================================
// NOMINATION/CANDIDATE APIs
// ============================================

export const candidateAPI = {
  // Get all candidates
  getAll: async () => {
    const response = await api.get('/candidates/');
    return response.data;
  },

  // Apply for position
  apply: async (applicationData: {
    positionId: string;
    name: string;
    email: string;
    message: string;
  }) => {
    const response = await api.post('/candidates/apply/', applicationData);
    return response.data;
  },

  // Approve candidate
  approve: async (candidateId: string) => {
    const response = await api.put(`/candidates/${candidateId}/approve`);
    return response.data;
  },

  // Reject candidate
  reject: async (candidateId: string, reason?: string) => {
    const response = await api.put(`/candidates/${candidateId}/reject`, { reason });
    return response.data;
  },
};

// ============================================
// VOTING APIs
// ============================================

export const votingAPI = {
  // Request OTP
  requestOTP: async (regNo: string, election: number) => {
    const response = await api.post('/voting/request-otp/', { regNo, election });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (regNo: string, otp: string, election: number) => {
    const response = await api.post('/voting/verify-otp/', { regNo, otp, election });
    return response.data;
  },

  // Cast vote
  castVote: async (votes: { [position: string]: string }, regNo: string, election: number) => {
    const response = await api.post('/voting/cast/', { votes, regNo, election });
    return response.data;
  },

  // Get voting results
  getResults: async () => {
    const response = await api.get('/voting/results/');
    return response.data;
  },
};

export default api;
