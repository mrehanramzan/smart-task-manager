import { axiosInstance } from "./instance";


export const getTasks = async () => {
  try {
    const data = await axiosInstance.get("/tasks/");
    return data;
  } catch (err) {
    return { error: err.response?.data || err.message };
  }
};


export const createTask = async (taskData) => {
  try {
    const data = await axiosInstance.post("/tasks/", taskData);
    return data;
  } catch (err) {
    return { error: err.response?.data || err.message };
  }
};


export const updateTask = async (taskId, taskData) => {
  try {
    const data = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    return data;
  } catch (err) {
    return { error: err.response?.data || err.message };
  }
};


export const deleteTask = async (taskId) => {
  try {
    const data = await axiosInstance.delete(`/tasks/${taskId}`);
    return data;
  } catch (err) {
    return { error: err.response?.data || err.message };
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const data = await axiosInstance.patch(`/tasks/${taskId}/${status}`);
    return data;
  } catch (err) {
    return { error: err.response?.data || err.message };
  }
};