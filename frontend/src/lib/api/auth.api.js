import api from "./axios";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  requestRecovery: (payload) =>
    api.post("/auth/forgot-password", payload).then((r) => r.data),
  verifyRecovery: (payload) =>
    api.post("/auth/verify-recovery", payload).then((r) => r.data),
};
