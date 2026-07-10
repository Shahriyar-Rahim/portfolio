import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { inboxApi } from "../api/inbox.api";

export function useInboxList() {
  return useQuery({ queryKey: ["inbox", "list"], queryFn: () => inboxApi.getAll() });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: (payload) => inboxApi.send(payload),
    onSuccess: () => toast.success("Message sent — I'll get back to you soon."),
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateInboxStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => inboxApi.updateStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inbox", "list"] }),
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => inboxApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "list"] });
      toast.success("Message deleted.");
    },
    onError: (err) => toast.error(err.message),
  });
}
