import api from "./axios";

export const blogApi = {
  getAll: () =>
    api.get("/blogs", { params: { limit: 100 } }).then((r) => r.data),
  getOne: (id) => api.get(`/blogs/${id}`).then((r) => r.data),
  create: (payload) =>
    api
      .post("/blogs/create-blog", payload, {
        headers:
          payload instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      })
      .then((r) => r.data),
  update: (id, payload) =>
    api
      .patch(`/blogs/${id}`, payload, {
        headers:
          payload instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      })
      .then((r) => r.data),
  remove: (id) => api.delete(`/blogs/${id}`).then((r) => r.data),
};
