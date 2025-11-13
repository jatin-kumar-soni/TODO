import { apiFetch } from "./client";
import { AuthResponse } from "./types";

interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
  expiresAt?: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const signup = (payload: { name: string; email: string; password: string }) => {
  return apiFetch<AuthResponse>("/auth/signup", { method: "POST", body: payload });
};

export const login = (payload: { email: string; password: string }) => {
  return apiFetch<AuthResponse>("/auth/login", { method: "POST", body: payload });
};

export const fetchCurrentUser = () => {
  return apiFetch<AuthResponse>("/auth/me");
};

export const forgotPassword = (payload: { email: string }) => {
  return apiFetch<ForgotPasswordResponse>("/auth/forgot-password", { method: "POST", body: payload });
};

export const resetPassword = (payload: { token: string; password: string }) => {
  return apiFetch<ResetPasswordResponse>("/auth/reset-password", { method: "POST", body: payload });
};

