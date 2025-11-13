import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TodoList from "../sections/TodoList";
import TodoForm from "../sections/TodoForm";
import { Todo } from "../api/types";

const TodoPage = () => {
  const [editing, setEditing] = useState<Todo | null>(null);
  const queryClient = useQueryClient();

  const resetEditing = () => setEditing(null);

  const handleEdit = (todo: Todo) => {
    setEditing(todo);
  };

  const handleUpdated = (todo: Todo) => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    setEditing(todo);
  };

  const handleCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  };

  return (
    <div className="todo-layout">
      <TodoForm mode={editing ? "edit" : "create"} todo={editing} onCreated={handleCreated} onUpdated={handleUpdated} onReset={resetEditing} />
      <TodoList onEdit={handleEdit} />
    </div>
  );
};

export default TodoPage;

