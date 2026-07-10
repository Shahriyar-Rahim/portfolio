import api from "./axios";

export const testimonialApi = {
  getApproved: () => api.get("/testimonial").then((r) => r.data),
  getAll: () => api.get("/testimonial/all").then((r) => r.data),
  add: (payload) => api.post("/testimonial", payload).then((r) => r.data),
  setApproval: (id, isApproved) =>
    api.patch(`/testimonial/${id}/approve`, { isApproved }).then((r) => r.data),
  remove: (id) => api.delete(`/testimonial/${id}`).then((r) => r.data),
};
