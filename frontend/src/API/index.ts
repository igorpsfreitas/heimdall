import axios from 'axios';

const baseURL = process.env.REACT_APP_API;

export const api = axios.create({
  baseURL,
  timeout: 1000,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/token/refresh/`, { refresh: refreshToken });
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
          originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
          return api(originalRequest);
        } catch (refreshError) {
          console.log('Refresh token is invalid or expired', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);