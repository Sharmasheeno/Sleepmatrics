import axios from 'axios';

// Create an Axios instance for the backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Node.js backend
});

// Create an Axios instance for the ML API
const mlApi = axios.create({
  baseURL: 'http://localhost:5001', // Your Python ML API
});

// --- ML API ---
export const getSleepPrediction = (predictionData) => {
  return mlApi.post('/predict', predictionData);
};

// --- HISTORY ---
// UPDATED function name to match your form
export const savePredictionHistory = (historyData) => {
  return api.post('/history', historyData);
};

export const getUserHistory = () => {
  return api.get('/history');
};

// --- AUTH ---
export const registerUser = (name, email, password, adminKey) => {
  return api.post('/auth/register', { name, email, password, adminKey });
};

export const loginUser = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const logoutUser = () => {
  // This is handled in components by removing the token
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgotpassword', { email });
};

export const resetPassword = (token, password) => {
  return api.post(`/auth/resetpassword/${token}`, { password });
};

// VVVV CORRECTED PROFILE ENDPOINTS VVVV
export const getUserProfile = () => {
    return api.get('/auth/profile'); 
};

export const updateUserProfile = (profileData) => {
    return api.put('/auth/profile', profileData); 
};
// ^^^^ CORRECTED PROFILE ENDPOINTS ^^^^

// --- FEEDBACK ---
export const submitFeedback = (feedbackData) => {
  return api.post('/feedback', feedbackData);
};

// --- ADMIN ---
export const getAllUsers = () => {
  return api.get('/admin/users');
};

export const getAllHistory = () => {
  return api.get('/admin/history');
};

export const getAllFeedback = () => {
  return api.get('/admin/feedback');
};

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;