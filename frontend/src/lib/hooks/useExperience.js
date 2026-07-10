import { experienceApi } from "../api/experience.api";
import { createResourceHooks } from "./useResource";

export const {
  useList: useExperience,
  useCreate: useCreateExperience,
  useUpdate: useUpdateExperience,
  useRemove: useDeleteExperience,
} = createResourceHooks("experience", experienceApi);
