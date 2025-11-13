import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { createTodo, deleteTodo, listTodos, updateTodo } from "../controllers/todoController";

const router = Router();

router.use(authenticate);
router.get("/", listTodos);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;

