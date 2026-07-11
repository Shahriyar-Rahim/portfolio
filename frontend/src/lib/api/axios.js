import axios from "axios";

const AUTH_TOKEN_KEY = "portfolio-auth-token";

// Keep the fallback credential scoped to this browser tab. Safari and some
// mobile browsers block the API's cross-site httpOnly cookie, while the API
// also supports Bearer authentication.
export const setAuthToken = (token) => {
  if (token) sessionStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

// Central axios instance. withCredentials keeps the cookie path working in
// browsers that allow it; the request interceptor supplies the mobile fallback.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Normalize errors so callers always get a readable message string.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message });
  },
);

export default api;
