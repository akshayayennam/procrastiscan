import axios from 'axios';

const api = axios.create({
  baseURL: 'https://procrastiscan.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the user ID in headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      config.headers['X-User-Id'] = user.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
