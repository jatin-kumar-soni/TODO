import { Schema, model } from "mongoose";

export interface LogDocument {
  _id: Schema.Types.ObjectId;
  level: "error";
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  createdAt: Date;
}

const logSchema = new Schema<LogDocument>(
  {
    level: { type: String, enum: ["error"], default: "error" },
    message: { type: String, required: true },
    stack: { type: String },
    context: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LogModel = model<LogDocument>("Log", logSchema);

