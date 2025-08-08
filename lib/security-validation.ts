import { z } from "zod";

// Schemas de validation sécurisés
export const secureEmailSchema = z
  .string()
  .email("Email invalide")
  .max(255, "Email trop long")
  .toLowerCase()
  .trim();

export const securePasswordSchema = z
  .string()
  .min(8, "Mot de passe trop court (min 8 caractères)")
  .max(128, "Mot de passe trop long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
  );

export const secureTextSchema = z.string().max(1000, "Texte trop long").trim();

export const secureNameSchema = z
  .string()
  .min(1, "Nom requis")
  .max(50, "Nom trop long")
  .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Nom invalide")
  .trim();

export const secureUsernameSchema = z
  .string()
  .min(3, "Nom d'utilisateur trop court")
  .max(30, "Nom d'utilisateur trop long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Nom d'utilisateur invalide")
  .toLowerCase()
  .trim();

// Fonction de sanitisation simple
export function sanitizeHtml(input: string): string {
  return input.replace(/[<>"'&]/g, (match) => {
    const escapeMap: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "&": "&amp;",
    };
    return escapeMap[match] || match;
  });
}

export function sanitizeInput(input: any): string {
  if (typeof input !== "string") {
    return "";
  }
  return sanitizeHtml(input.trim());
}

// Validation des IDs
export const secureIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_-]+$/, "ID invalide")
  .min(1)
  .max(50);

// Middleware de validation
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (
    data: unknown,
  ): { success: true; data: T } | { success: false; error: string } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map((e: any) => e.message).join(", ");
        return { success: false, error: errorMessage };
      }
      return { success: false, error: "Données invalides" };
    }
  };
}
