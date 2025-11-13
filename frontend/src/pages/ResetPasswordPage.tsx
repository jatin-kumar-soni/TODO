import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";
import { ResetPasswordFormValues, resetPasswordSchema } from "../validation/authSchemas";

interface ResetPasswordResponse {
  message: string;
}

const ResetPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      password: ""
    }
  });

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      setValue("token", token);
    }
  }, [params, setValue]);

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      apiFetch<ResetPasswordResponse>("/auth/reset-password", { method: "POST", body: values }),
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to reset password right now.");
    }
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setError(null);
    mutation.mutate(values);
  };

  return (
    <section className="card">
      <h1>Reset password</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-field">
          <label htmlFor="token">Reset token</label>
          <input id="token" type="text" {...register("token")} />
          {errors.token && <p className="error-text">{errors.token.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="password">New password</label>
          <input id="password" type="password" autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <button type="submit" className="primary-button" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update password"}
        </button>
      </form>
      <p>
        Back to <Link to="/login">login</Link>
      </p>
    </section>
  );
};

export default ResetPasswordPage;

