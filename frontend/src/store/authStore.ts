import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse, User } from "../api/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (payload: AuthResponse) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (payload) =>
        set({
          user: payload.user,
          token: payload.token
        }),
      clear: () =>
        set({
          user: null,
          token: null
        })
    }),
    {
      name: "todo-auth"
    }
  )
);

