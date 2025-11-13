import { LogModel } from "../models/Log";

export const logError = async (message: string, stack?: string, context?: Record<string, unknown>): Promise<void> => {
  try {
    await LogModel.create({ message, stack, context });
  } catch (err) {
    // fail silently to avoid crashing error handler
  }
};

