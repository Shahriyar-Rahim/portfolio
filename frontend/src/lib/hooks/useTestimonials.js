import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { testimonialApi } from "../api/testimonial.api";

// Public — approved testimonials only (used on the homepage).
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials", "approved"],
    queryFn: () => testimonialApi.getApproved(),
  });
}

// Admin — every testimonial including pending ones, for moderation.
export function useAllTestimonials() {
  return useQuery({
    queryKey: ["testimonials", "all"],
    queryFn: () => testimonialApi.getAll(),
  });
}

export function useAddTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => testimonialApi.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Thank you! Your review is pending approval.");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useSetTestimonialApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isApproved }) => testimonialApi.setApproval(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Updated.");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => testimonialApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Removed.");
    },
    onError: (err) => toast.error(err.message),
  });
}
