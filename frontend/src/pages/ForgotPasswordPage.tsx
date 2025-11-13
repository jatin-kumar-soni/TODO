import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "../api/client";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "../validation/authSchemas";

interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
  expiresAt?: string;
}

const ForgotPasswordPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const mutation = useMutation({
    mutationFn: (values: ForgotPasswordFormValues) =>
      apiFetch<ForgotPasswordResponse>("/auth/forgot-password", { method: "POST", body: values }),
    onSuccess: (data) => {
      setSuccessMessage(
        data.resetToken
          ? `Reset link created. Use token ${data.resetToken} before ${data.expiresAt?.slice(0, 19)?.replace("T", " ")}`
          : data.message
      );
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to process request right now.");
    }
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setError(null);
    setSuccessMessage(null);
    mutation.mutate(values);
  };

  return (
    <section className="card">
      <h1>Forgot password</h1>
      {error && <p className="error-text">{error}</p>}
      {successMessage && <p className="success-text">{successMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <button type="submit" className="primary-button" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Sending link..." : "Send reset link"}
        </button>
      </form>
      <p>
        Remembered credentials? <Link to="/login">Back to login</Link>
      </p>
    </section>
  );
};

export default ForgotPasswordPage;

