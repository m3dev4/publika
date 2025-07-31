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

  export const userLoginSchema = z.object({
    email: email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  export const userUpdateProfileSchema = z.object({
    firstName: z.string().min(2, "Le prénom est requis").max(50, "Le prénom doit contenir au plus 50 caractères"),
    lastName: z.string().min(2, "Le nom est requis").max(50, "Le nom doit contenir au plus 50 caractères"),
    username: z.string().min(2, "Le pseudo est requis").max(30, "Le pseudo doit contenir au plus 30 caractères").regex(/^[a-zA-Z0-9_-]+$/, "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores"),
    avatar: z.string().optional(),
    city: z.string().min(2, "La ville est requise").max(100, "Le nom de la ville est trop long"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(500, "La description ne peut pas dépasser 500 caractères"),
    isTalent: z.boolean(),
    isAnnouncer: z.boolean(),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
  }).refine((data) => data.isTalent || data.isAnnouncer, {
    message: "Vous devez sélectionner au moins un rôle (Talent ou Annonceur)",
    path: ["isTalent"],
  });

export type registerFormValue = z.infer<typeof userRegisterSchema>;
export type verifyEmailFormValue = z.infer<typeof userVerifyEmailSchema>;
export type loginFormValue = z.infer<typeof userLoginSchema>;
export type updateProfileFormValue = z.infer<typeof userUpdateProfileSchema>;
