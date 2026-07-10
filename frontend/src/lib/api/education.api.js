import api from "./axios";

export const educationApi = {
  getAll: () => api.get("/me/education").then((r) => r.data),
  create: (payload) => api.post("/me/education", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/me/education/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/me/education/${id}`).then((r) => r.data),
};
