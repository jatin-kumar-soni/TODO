import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "../api/client";
import { AuthResponse } from "../api/types";
import { useAuthStore } from "../store/authStore";
import { SignupFormValues, signupSchema } from "../validation/authSchemas";

const SignupPage = () => {
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const mutation = useMutation({
    mutationFn: (values: SignupFormValues) => apiFetch<AuthResponse>("/auth/signup", { method: "POST", body: values }),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/todos");
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to sign up right now.");
    }
  });

  const onSubmit = (values: SignupFormValues) => {
    setError(null);
    mutation.mutate(values);
  };

  return (
    <section className="card">
      <h1>Create account</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" autoComplete="name" {...register("name")} />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <button type="submit" className="primary-button" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
};

export default SignupPage;

