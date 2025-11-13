import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export const useAuthGuard = () => {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: false,
    onSuccess: (data) => {
      setAuth(data);
    },
    onError: () => {
      useAuthStore.getState().clear();
    }
  });

  return query;
};

