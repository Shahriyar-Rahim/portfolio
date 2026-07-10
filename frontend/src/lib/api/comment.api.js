import api from "./axios";

export const commentApi = {
  getForBlog: (blogId) => api.get(`/comment/blog/${blogId}`).then((r) => r.data),
  add: (blogId, payload) =>
    api.post(`/comment/blog/${blogId}/comment`, payload).then((r) => r.data),
};
