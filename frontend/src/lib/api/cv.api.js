import api from "./axios";

export const cvApi = {
  getProfile: () => api.get("/cv/profile").then((r) => r.data),
  updateProfile: (payload) => api.patch("/cv/profile", payload).then((r) => r.data),
  uploadCv: (payload) =>
    api
      .post("/cv/upload", payload, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  uploadImage: (payload) =>
    api
      .post("/cv/profile/image", payload, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  removeImage: () => api.delete("/cv/profile/image").then((r) => r.data),
};
