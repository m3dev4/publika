import { email, z } from "zod";

export const userRegisterSchema = z.object({
  email: email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
