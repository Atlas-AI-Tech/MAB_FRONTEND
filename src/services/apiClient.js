import axios from "axios";
import { ROOT_BACKEND_API } from "../utils/constants";

// Axios instance and common configurations
// Do NOT set a global Content-Type. Let Axios set it per request
// (e.g., multipart/form-data for FormData uploads).
const apiClient = axios.create({
  baseURL: ROOT_BACKEND_API,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const browserUUID = localStorage.getItem("browser_uuid") || "dasdas";

  if (token) {
    config.headers.token = token;
  }

  if (browserUUID) {
    config.headers["browser-uuid"] = browserUUID;
  }

  return config;
});

export default apiClient;
