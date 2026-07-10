import { educationApi } from "../api/education.api";
import { createResourceHooks } from "./useResource";

export const {
  useList: useEducation,
  useCreate: useCreateEducation,
  useUpdate: useUpdateEducation,
  useRemove: useDeleteEducation,
} = createResourceHooks("education", educationApi);
