import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://3.110.207.239/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// User API functions
export const getUsers = () => api.get("/users");

export const getUserById = (id) => api.get(`/users/${id}`);

export const createUser = (userData) => api.post("/users", userData);

export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
