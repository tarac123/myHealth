import axios from "axios";

const api = axios.create({
  baseURL: "https://ca2-med-api.vercel.app",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
