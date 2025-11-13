import { useAuthStore } from "../store/authStore";

const envBaseUrl = import.meta.env.VITE_API_URL;
const baseUrl = (envBaseUrl && envBaseUrl.replace(/\/$/, "")) || "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export const apiFetch = async <T>(path: string, options?: FetchOptions): Promise<T> => {
  const token = useAuthStore.getState().token;
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options?.headers ?? {})
  };

  let body: BodyInit | undefined;
  if (options?.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: options?.method ?? "GET",
    headers,
    body
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().clear();
    }
    const message = data?.message || "Request failed";
    throw new ApiError(response.status, message, data?.details);
  }

  return data as T;
};

