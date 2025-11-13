import { Schema, model, Types } from "mongoose";

export interface TodoDocument {
  _id: Schema.Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<TodoDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const TodoModel = model<TodoDocument>("Todo", todoSchema);

