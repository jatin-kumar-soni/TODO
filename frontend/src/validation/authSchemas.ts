import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

