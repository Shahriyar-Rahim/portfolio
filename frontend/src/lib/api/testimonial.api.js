import api from "./axios";

export const testimonialApi = {
  getApproved: () => api.get("/testimonial").then((r) => r.data),
  getAll: () => api.get("/testimonial/all/list").then((r) => r.data),
  add: (payload) =>
    api
      .post("/testimonial", payload, {
        headers:
          payload instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      })
      .then((r) => r.data),
  setApproval: (id, isApproved) =>
    api.patch(`/testimonial/${id}/approve`, { isApproved }).then((r) => r.data),
  remove: (id) => api.delete(`/testimonial/${id}`).then((r) => r.data),
};
