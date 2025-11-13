import { apiFetch } from "./client";
import { CreateTodoInput, Todo, TodosResponse, UpdateTodoInput } from "./types";

export const listTodos = () => {
  return apiFetch<TodosResponse>("/todos");
};

export const createTodo = (payload: CreateTodoInput) => {
  return apiFetch<{ todo: Todo }>("/todos", { method: "POST", body: payload });
};

export const updateTodo = (id: string, payload: UpdateTodoInput) => {
  return apiFetch<{ todo: Todo }>(`/todos/${id}`, { method: "PATCH", body: payload });
};

export const deleteTodo = (id: string) => {
  return apiFetch<void>(`/todos/${id}`, { method: "DELETE" });
};

