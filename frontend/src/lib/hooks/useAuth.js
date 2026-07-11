import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../stores/authStore";

// Verifies the httpOnly-cookie session on load, so a page refresh doesn't
// silently boot the admin out (or worse, show a false "logged in" state).
export function useSessionCheck() {
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isError, isFetched } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated, // only bother checking if we think we're logged in
    retry: false,
  });

  useEffect(() => {
    if (data?.data) setUser(data.data);
    if (isError) clear();
  }, [data, isError, setUser, clear]);

  return { checked: !isAuthenticated || isFetched };
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (res) => {
      setUser(res.data);
      toast.success("Welcome back.");
      navigate("/admin");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRecovery() {
  return useMutation({
    mutationFn: (payload) => authApi.requestRecovery(payload),
    onSuccess: () => toast.success("Recovery instructions sent."),
    onError: (err) => toast.error(err.message),
  });
}

export function useVerifyRecovery() {
  return useMutation({
    mutationFn: (payload) => authApi.verifyRecovery(payload),
    onSuccess: () => toast.success("Recovery verified. You can now sign in."),
    onError: (err) => toast.error(err.message),
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clear();
      queryClient.clear();
      navigate("/login");
    },
  });
}
