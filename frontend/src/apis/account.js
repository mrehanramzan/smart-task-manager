import { axiosInstance } from "./instance";

export const updateProfile = async (profileData) => {
    try {
      const { data } = await axiosInstance.patch("/account/profile", profileData);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Unknown error" };
    }
  };
  
  export const updatePassword = async (passwordData) => {
    try {
      const { data } = await axiosInstance.patch("/account/password", passwordData);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Unknown error" };
    }
  };
  