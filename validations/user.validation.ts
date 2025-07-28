import { email, z } from "zod";

export const userRegisterSchema = z
  .object({
    email: email().min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

  export const userVerifyEmailSchema = z.object({
    code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
  });

export type registerFormValue = z.infer<typeof userRegisterSchema>;
export type verifyEmailFormValue = z.infer<typeof userVerifyEmailSchema>;

