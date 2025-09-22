import { axiosInstance } from "./instance";


export const query_tasks = async (query) => {
  try {
    const { data } = await axiosInstance.get("/process/query", {
      params: { query },
    });
    return data; 
  } catch (err) {
    return { error: err };
  }
};


export const get_monthly_summary = async ( month_offset = 0 ) => {
  try {
    const data = await axiosInstance.get("/process/monthly_summary", {
      params: { month_offset },
    });
    return data; 
  } catch (err) {
    return { error: err };
  }
};
