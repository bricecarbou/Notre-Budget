import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const apiClient = axios.create({ baseURL: "/api" });

// Échec réseau (pas de réponse du tout) vs erreur applicative (4xx/5xx avec
// réponse) — seul le premier cas justifie une mise en file hors ligne.
export function isNetworkError(err: unknown): boolean {
  return axios.isAxiosError(err) && !err.response;
}

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
  if (!refreshToken) throw new Error("Pas de refresh token");

  try {
    const { data } = await axios.post("/api/auth/refresh", { refreshToken });
    setAccessToken(data.accessToken);
    return data.accessToken as string;
  } catch (err) {
    logout();
    throw err;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise ??= refreshAccessToken();
        const accessToken = await refreshPromise;
        refreshPromise = null;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
