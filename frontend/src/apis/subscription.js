import { axiosInstance } from "./instance";

export const updateSubscription = async (tier) => {
  try {
    const data  = await axiosInstance.put("/subscriptions/tier", { tier });
    return data;
  } catch (err) {
    return { success: false, error: err.message || "Failed to update subscription" };
  }
};