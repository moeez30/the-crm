import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const API_URL = process.env.NODE_ENV === 'production' ? "https://the-crm-backend-1.onrender.com" : "https://the-crm-backend-1.onrender.com";
// const API_URL = process.env.NODE_ENV === 'production' ? "http://localhost:3001" : "http://localhost:3001";
const API_URL = process.env.NODE_ENV === 'production' ? "https://shippingsuite-crm-8a25c5cf7a3c.herokuapp.com" : "https://shippingsuite-crm-8a25c5cf7a3c.herokuapp.com/";

const instance = axios.create({
  baseURL: API_URL,
});


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
instance.interceptors.response.use(
  
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      // Redirect to login or refresh token
      useNavigate('/');
    }
    return Promise.reject(error);
  }
);

export default instance;