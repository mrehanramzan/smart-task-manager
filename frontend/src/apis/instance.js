const API_URL = import.meta.env.VITE_API_BASE_URL
console.log(API_URL)
import { getToken } from "../utils/store"; 
import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });


axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const err = error.response?.data || { error: error.message };
      return Promise.reject(err);
    }
);
