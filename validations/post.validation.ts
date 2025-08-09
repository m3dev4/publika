import { z } from "zod";

export const postValidation = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  content: z
    .string()
    .min(10, "Le contenu doit contenir au moins 10 caractères"),
  type: z.enum(["GENERAL", "MISSION"]),
  categoryId: z.string().optional(),
  cityId: z.string().optional(),
  photos: z.array(z.string()).optional(),
  price: z.number().optional(),
});

export type PostValidationValue = z.infer<typeof postValidation>;
