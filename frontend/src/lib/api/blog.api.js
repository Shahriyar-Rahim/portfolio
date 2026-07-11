import api from "./axios";
import { toFormData } from "../helper/formData.js";

// create/update accept either a File (new upload, sent as multipart) or a
// plain payload with no image change (sent as JSON) — image is optional on update.
export const blogApi = {
  getAll: () =>
    api.get("/blogs", { params: { limit: 100 } }).then((r) => r.data),
  getOne: (id) => api.get(`/blogs/${id}`).then((r) => r.data),
  create: (payload) =>
    api
      .post("/blogs/create-blog", toFormData(payload), {
        // IMPORTANT: do not hardcode "multipart/form-data" here — that string
        // has no boundary, and the browser needs to generate one itself when
        // it sees the body is a FormData instance. Setting this to `undefined`
        // removes our axios instance's default "application/json" header for
        // just this request, letting the browser set the correct
        // "multipart/form-data; boundary=..." header on its own.
        headers: { "Content-Type": undefined },
      })
      .then((r) => r.data),
  update: (id, payload) => {
    if (payload.image instanceof File) {
      return api
        .patch(`/blogs/${id}`, toFormData(payload), {
          headers: { "Content-Type": undefined },
        })
        .then((r) => r.data);
    }
    return api.patch(`/blogs/${id}`, payload).then((r) => r.data);
  },
  remove: (id) => api.delete(`/blogs/${id}`).then((r) => r.data),
};
