import axios from "axios";

// Central axios instance. withCredentials is required because the backend
// issues its auth token as an httpOnly cookie ("user-token") on login.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
