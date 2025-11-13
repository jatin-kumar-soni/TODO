import { Schema, model } from "mongoose";

export interface UserDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiresAt: { type: Date }
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);

