import { blogApi } from "../api/blog.api";
import { createResourceHooks } from "./useResource";

export const {
  useList: useBlogs,
  useOne: useBlog,
  useCreate: useCreateBlog,
  useUpdate: useUpdateBlog,
  useRemove: useDeleteBlog,
} = createResourceHooks("blogs", blogApi);
