import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middlewares/errorHandler";
import { createTodoSchema, updateTodoSchema } from "../validation/todoSchemas";
import { TodoModel } from "../models/Todo";

const getUserId = (req: Request): string => {
  const id = (req as Request & { userId?: string }).userId;
  if (!id) {
    throw new ApiError(401, "Authentication required");
  }
  return id;
};

export const listTodos = asyncHandler(async (req: Request, res: Response) => {
  const owner = getUserId(req);
  const todos = await TodoModel.find({ owner }).sort({ createdAt: -1 });
  res.json({
    todos: todos.map((todo) => ({
      id: String(todo._id),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    }))
  });
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const owner = getUserId(req);
  const parsed = createTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid input", parsed.error.flatten());
  }

  const todo = await TodoModel.create({ ...parsed.data, owner });
  res.status(201).json({
    todo: {
      id: String(todo._id),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    }
  });
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  const owner = getUserId(req);
  const parsed = updateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid input", parsed.error.flatten());
  }

  const todo = await TodoModel.findOneAndUpdate({ _id: req.params.id, owner }, parsed.data, {
    new: true
  });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  res.json({
    todo: {
      id: String(todo._id),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    }
  });
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const owner = getUserId(req);
  const deleted = await TodoModel.findOneAndDelete({ _id: req.params.id, owner });
  if (!deleted) {
    throw new ApiError(404, "Todo not found");
  }
  res.status(204).send();
});

