import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { commentApi } from "../api/comment.api";

export function useComments(blogId) {
  return useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => commentApi.getForBlog(blogId),
    enabled: !!blogId,
  });
}

export function useAddComment(blogId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => commentApi.add(blogId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      toast.success("Comment posted.");
    },
    onError: (err) => toast.error(err.message),
  });
}
