import axios from 'axios';

// REPLACE THIS WITH YOUR IP ADDRESS FOUND IN STEP 1
const BASE_URL = 'http://172.22.61.104:5000/api'; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Log errors easily
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);