import api from "./axios";

export const serviceApi = {
  getAll: () => api.get("/service").then((r) => r.data),
  getOne: (id) => api.get(`/service/${id}`).then((r) => r.data),
  create: (payload) =>
    api
      .post("/service", payload, {
        headers:
          payload instanceof FormData
            ? { "Content-Type": undefined }
            : undefined,
      })
      .then((r) => r.data),
  update: (id, payload) =>
    api
      .patch(`/service/${id}`, payload, {
        headers:
          payload instanceof FormData
            ? { "Content-Type": undefined }
            : undefined,
      })
      .then((r) => r.data),
  remove: (id) => api.delete(`/service/${id}`).then((r) => r.data),
};
