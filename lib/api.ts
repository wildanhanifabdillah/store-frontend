import axios from "axios";
import { getAdminToken } from "@/lib/auth";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "https://apiweb.whastore.my.id/api/v1";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
);

export default api;
