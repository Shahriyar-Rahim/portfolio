import api from "./axios";

export const inboxApi = {
  send: (payload) => api.post("/inbox", payload).then((r) => r.data),
  getAll: () => api.get("/inbox").then((r) => r.data),
  getOne: (id) => api.get(`/inbox/${id}`).then((r) => r.data),
  reply: (id, payload) => api.post(`/inbox/${id}/reply`, payload).then((r) => r.data),
  updateStatus: (id, payload) => api.patch(`/inbox/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/inbox/${id}`).then((r) => r.data),
};
