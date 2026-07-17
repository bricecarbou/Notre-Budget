import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
}
