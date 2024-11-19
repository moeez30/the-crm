import axios from 'axios';

// const API_URL = process.env.NODE_ENV === 'production' ? "https://the-crm-backend-1.onrender.com" : "https://the-crm-backend-1.onrender.com";
const API_URL = process.env.NODE_ENV === 'production' ? "http://localhost:3001" : "http://localhost:3001";
// const API_URL = process.env.NODE_ENV === 'production' ? "https://shippingsuite-crm-8a25c5cf7a3c.herokuapp.com" : "https://shippingsuite-crm-8a25c5cf7a3c.herokuapp.com/";


const instance = axios.create({
  baseURL: API_URL,
});

export default instance;