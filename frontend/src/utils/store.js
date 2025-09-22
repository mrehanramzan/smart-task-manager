export const getToken = () => localStorage.getItem("access_token");

export const storeToken = (token) => localStorage.setItem("access_token", token);