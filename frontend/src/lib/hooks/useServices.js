import { serviceApi } from "../api/service.api";
import { createResourceHooks } from "./useResource";

export const {
  useList: useServices,
  useOne: useService,
  useCreate: useCreateService,
  useUpdate: useUpdateService,
  useRemove: useDeleteService,
} = createResourceHooks("services", serviceApi);
