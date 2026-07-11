// Builds a multipart FormData payload for endpoints that accept file
// uploads (blog/service cover images, testimonial photos). Any value that
// is a File/Blob is appended as-is; File arrays are appended repeatedly
// under the same field name (matches multer's upload.array()); everything
// else is stringified normally.
export function toFormData(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}
