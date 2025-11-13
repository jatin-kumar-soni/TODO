import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "../api/types";
import { createTodo, updateTodo } from "../api/todos";
import { CreateTodoFormValues, createTodoSchema, editTodoSchema, EditTodoFormValues } from "../validation/todoSchemas";
import { ApiError } from "../api/client";
import { useState } from "react";

type Mode = "create" | "edit";

interface TodoFormProps {
  mode: Mode;
  todo: Todo | null;
  onCreated: () => void;
  onUpdated: () => void;
  onReset: () => void;
}

const TodoForm = ({ mode, todo, onCreated, onUpdated, onReset }: TodoFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTodoFormValues & EditTodoFormValues>({
    resolver: zodResolver(mode === "create" ? createTodoSchema : editTodoSchema),
    defaultValues: {
      title: "",
      description: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateTodoFormValues) => createTodo(values),
    onSuccess: () => {
      onCreated();
      form.reset({
        title: "",
        description: ""
      });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to create todo right now.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (values: EditTodoFormValues) => updateTodo(todo?.id ?? "", values),
    onSuccess: () => {
      onUpdated();
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to update todo right now.");
    }
  });

  useEffect(() => {
    // populate form when editing
    if (mode === "edit" && todo) {
      form.reset({
        title: todo.title,
        description: todo.description ?? ""
      });
      return;
    }
    // clear form for new todo
    form.reset({
      title: "",
      description: ""
    });
  }, [mode, todo, form]);

  const onSubmit = (values: CreateTodoFormValues) => {
    setError(null);
    if (mode === "edit" && todo) {
      updateMutation.mutate(values);
      return;
    }
    createMutation.mutate(values);
  };

  const isProcessing = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="todo-board">
      <div>
        <h2>{mode === "create" ? "Add a new todo" : "Edit todo"}</h2>
        {error && <p className="error-text">{error}</p>}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" placeholder="Pick up groceries" {...form.register("title")} />
          {form.formState.errors.title && <p className="error-text">{form.formState.errors.title.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={3} placeholder="Add optional notes" {...form.register("description")} />
          {form.formState.errors.description && <p className="error-text">{form.formState.errors.description.message}</p>}
        </div>
        <div className="todo-actions">
          <button type="submit" className="primary-button" disabled={isProcessing}>
            {mode === "create" ? (createMutation.isPending ? "Saving..." : "Add todo") : updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>
          {mode === "edit" && (
            <button type="button" className="ghost-button" onClick={onReset}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default TodoForm;

