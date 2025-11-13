import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";
import { AuthResponse } from "../api/types";
import { useAuthStore } from "../store/authStore";
import { LoginFormValues, loginSchema } from "../validation/authSchemas";
import { useState } from "react";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation() as { state?: { from?: string } };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => apiFetch<AuthResponse>("/auth/login", { method: "POST", body: values }),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // redirect to where user came from or todos page
      const redirectPath = location.state?.from || "/todos";
      navigate(redirectPath, { replace: true });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to sign in. Please try again.");
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    setError(null);
    mutation.mutate(values);
  };

  return (
    <section className="card">
      <h1>Welcome back</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <button type="submit" className="primary-button" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <Link to="/forgot-password" className="secondary-link">
        Forgot password?
      </Link>
      <p>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  );
};

export default LoginPage;

