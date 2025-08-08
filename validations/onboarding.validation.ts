import { z } from "zod";

export const onboardingStepOneSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom est requis")
    .max(50, "Le prénom doit contenir au plus 50 caractères"),
  lastName: z
    .string()
    .min(2, "Le nom est requis")
    .max(50, "Le nom doit contenir au plus 50 caractères"),
});

export const onboardingStepTwoSchema = z.object({
  username: z
    .string()
    .min(2, "Le pseudo est requis")
    .max(30, "Le pseudo doit contenir au plus 30 caractères")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores",
    ),
});

export const onboardingStepThreeSchema = z
  .object({
    avatar: z.string().optional(), // Temporairement optionnel
    regionId: z.string().min(1, "La région est requise"),
    cityId: z.string().optional(), // Optionnel si l'utilisateur choisit "Autre"
    customCity: z.string().optional(), // Nom de la ville personnalisée
  })
  .refine(
    (data) => data.cityId || (data.customCity && data.customCity.length >= 2),
    {
      message:
        "Veuillez sélectionner une ville ou entrer le nom de votre ville",
      path: ["cityId"],
    },
  );

export const onboardingStepFourSchema = z
  .object({
    isTalent: z.boolean(),
    isAnnouncer: z.boolean(),
  })
  .refine((data) => data.isTalent || data.isAnnouncer, {
    message: "Vous devez sélectionner au moins un rôle (Talent ou Annonceur)",
    path: ["isTalent"], // Affiche l'erreur sur le premier champ
  });

export const onboardingStepFiveSchema = z.object({
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
});

export const onboardingSchema = z.object({
  stepOne: onboardingStepOneSchema,
  stepTwo: onboardingStepTwoSchema,
  stepThree: onboardingStepThreeSchema,
  stepFour: onboardingStepFourSchema,
  stepFive: onboardingStepFiveSchema,
});
