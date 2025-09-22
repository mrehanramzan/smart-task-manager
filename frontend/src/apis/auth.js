import { axiosInstance } from "./instance"
import { storeToken } from "../utils/store"

export const register_user = async (userData) => {
    try {
      const data = await axiosInstance.post("/auth/register", userData);
      return data;
    } catch (err) {
      return { error: err };
    }
};

export const login_user = async (credentials) => {
    try {
      const data = await axiosInstance.post("/auth/login", credentials ,
        {headers: { "Content-Type": "application/x-www-form-urlencoded" }}
      );
      if (data.access_token) {
        storeToken(data.access_token); 
      }
      return data;
    } catch (err) {
      return { error: err };
    }
};


export const verify_token = async () => {
    try {
      const data = await axiosInstance.get("/auth/me"); 
      return data; 
    } catch (err) {
      return { error: err };
    }
  };