import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(20),
  CLIENT_URL: z.string().url(),
  RESET_TOKEN_EXPIRY_MINUTES: z.coerce.number().default(30)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorMessages = parsed.error.errors.map((item) => `${item.path.join(".")} ${item.message}`);
  throw new Error(`Invalid environment configuration: ${errorMessages.join(", ")}`);
}

export const env = parsed.data;

