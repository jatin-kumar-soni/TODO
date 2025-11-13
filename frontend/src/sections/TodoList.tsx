import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../api/types";
import { deleteTodo, listTodos, updateTodo } from "../api/todos";
import { ApiError } from "../api/client";
import { useState } from "react";

interface TodoListProps {
  onEdit: (todo: Todo) => void;
}

const TodoList = ({ onEdit }: TodoListProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: listTodos
  });

  const toggleMutation = useMutation({
    mutationFn: (todo: Todo) => updateTodo(todo.id, { completed: !todo.completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to update todo status.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => deleteTodo(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError("Unable to delete todo.");
    }
  });

  const handleToggle = (todo: Todo) => {
    setError(null);
    toggleMutation.mutate(todo);
  };

  const handleDelete = (todo: Todo) => {
    setError(null);
    deleteMutation.mutate(todo.id);
  };

  if (isLoading) {
    return (
      <section className="todo-board">
        <p>Loading todos...</p>
      </section>
    );
  }

  const todos = data?.todos ?? [];

  return (
    <section className="todo-board">
      <div className="todo-list-header">
        <h2>Your todos</h2>
        {error && <p className="error-text">{error}</p>}
      </div>
      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Add your first task above.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <article key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
              <div className="todo-item-header">
                <span className="todo-title">{todo.title}</span>
                <span className="todo-meta">{new Date(todo.updatedAt).toLocaleString()}</span>
              </div>
              {todo.description && <p>{todo.description}</p>}
              <div className="todo-actions">
                <button type="button" className="toggle" onClick={() => handleToggle(todo)} disabled={toggleMutation.isPending}>
                  {todo.completed ? "Mark incomplete" : "Mark complete"}
                </button>
                <button type="button" className="edit" onClick={() => onEdit(todo)}>
                  Edit
                </button>
                <button type="button" className="delete" onClick={() => handleDelete(todo)} disabled={deleteMutation.isPending}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default TodoList;

