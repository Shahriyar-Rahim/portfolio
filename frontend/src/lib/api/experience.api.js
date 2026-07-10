import api from "./axios";

export const experienceApi = {
  getAll: () => api.get("/me/experience").then((r) => r.data),
  create: (payload) => api.post("/me/experience", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/me/experience/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/me/experience/${id}`).then((r) => r.data),
};
