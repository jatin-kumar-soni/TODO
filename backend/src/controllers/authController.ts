import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middlewares/errorHandler";
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from "../validation/authSchemas";
import { UserModel } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/password";
import { createAuthToken, createPasswordResetToken, hashResetToken } from "../services/tokenService";

const buildUserResponse = (user: { _id: unknown; name: string; email: string }) => {
  return { id: String(user._id), name: user.name, email: user.email };
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid input", parsed.error.flatten());
  }

  const { email, name, password } = parsed.data;
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Account already exists");
  }

  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({ email, name, passwordHash });
  const token = createAuthToken({ userId: String(user._id) });
  res.status(201).json({ token, user: buildUserResponse(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid input", parsed.error.flatten());
  }

  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = createAuthToken({ userId: String(user._id) });
  res.json({ token, user: buildUserResponse(user) });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid input", parsed.error.flatten());
  }

  const { email } = parsed.data;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.json({ message: "If the account exists a reset link will be sent" });
    return;
  }

  const { raw, hashed, expiresAt } = createPasswordResetToken();
  user.resetToken = hashed;
  user.resetTokenExpiresAt = expiresAt;
  await user.save();

  res.json({
    message: "Reset link generated",
    resetToken: raw,
    expiresAt: expiresAt.toISOString()
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid input", parsed.error.flatten());
  }

  const { token, password } = parsed.data;
  const hashed = hashResetToken(token);

  const user = await UserModel.findOne({
    resetToken: hashed,
    resetTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or expired");
  }

  user.passwordHash = await hashPassword(password);
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  res.json({ message: "Password updated" });
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { userId?: string }).userId;
  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "Account not found");
  }

  res.json({ user: buildUserResponse(user) });
});

