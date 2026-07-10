import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Generic query/mutation factory for simple CRUD resources (education,
// experience, service, testimonial, inbox, blog). Keeps six near-identical
// admin sections from turning into six near-identical files.
export function createResourceHooks(key, resourceApi) {
  function useList(options = {}) {
    return useQuery({
      queryKey: [key, "list"],
      queryFn: () => resourceApi.getAll(),
      ...options,
    });
  }

  function useOne(id, options = {}) {
    return useQuery({
      queryKey: [key, "detail", id],
      queryFn: () => resourceApi.getOne(id),
      enabled: !!id,
      ...options,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload) => resourceApi.create(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key, "list"] });
        toast.success("Saved.");
      },
      onError: (err) => toast.error(err.message),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }) => resourceApi.update(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key, "list"] });
        toast.success("Updated.");
      },
      onError: (err) => toast.error(err.message),
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id) => resourceApi.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key, "list"] });
        toast.success("Removed.");
      },
      onError: (err) => toast.error(err.message),
    });
  }

  return { useList, useOne, useCreate, useUpdate, useRemove };
}
