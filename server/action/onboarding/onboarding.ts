"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { User, UserOnboarding } from "@/types/user.type";

const prisma = new PrismaClient();

export const onboarding = async (
  data: UserOnboarding
): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    if (!user.isVerify) {
      return { success: false, message: "Email non vérifié" };
    }

    if (user.onboarding) {
      return { success: false, message: "Onboarding déjà terminé" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        avatar: data.avatar,
        city: data.city,
        description: data.description,
        isTalent: data.isTalent,
        isAnnouncer: data.isAnnouncer,
        onboarding: true, // Marquer l'onboarding comme terminé
      },
    });

    return { success: true, message: "Onboarding terminé avec succès", user: updatedUser };
  } catch (error: any) {
    console.error("Erreur onboarding:", error);
    return { success: false, message: "Erreur lors de l'onboarding" };
  }
};
