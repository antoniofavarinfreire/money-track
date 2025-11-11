import axios from "axios";

const api = axios.create({
  baseURL:
    "https://money-track-service-hqb8fshta4hzadez.eastus2-01.azurewebsites.net/",
});

// adiciona automaticamente o token JWT a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
