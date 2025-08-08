"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { User, UserOnboarding, UserWithRelations } from "@/types/user.type";

const prisma = new PrismaClient();

export const onboarding = async (
  data: UserOnboarding,
): Promise<{ success: boolean; message: string; user?: UserWithRelations }> => {
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

    // Gérer la logique de ville personnalisée
    let finalCityId = data.cityId;

    // Si l'utilisateur a saisi une ville personnalisée, la créer
    if (data.customCity && !data.cityId) {
      try {
        const newCity = await prisma.city.create({
          data: {
            name: data.customCity,
            regionId: data.regionId,
          },
        });
        finalCityId = newCity.id;
        console.log(
          `Nouvelle ville créée: ${data.customCity} (ID: ${newCity.id})`,
        );
      } catch (cityError: any) {
        // Si la ville existe déjà, la récupérer
        if (cityError.code === "P2002") {
          const existingCity = await prisma.city.findFirst({
            where: {
              name: data.customCity,
              regionId: data.regionId,
            },
          });
          if (existingCity) {
            finalCityId = existingCity.id;
            console.log(
              `Ville existante trouvée: ${data.customCity} (ID: ${existingCity.id})`,
            );
          }
        } else {
          throw cityError;
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        avatar: data.avatar,
        cityId: finalCityId, // Utiliser cityId au lieu de city
        description: data.description,
        isTalent: data.isTalent,
        isAnnouncer: data.isAnnouncer,
        onboarding: true, // Marquer l'onboarding comme terminé
      },
      include: {
        city: {
          include: {
            region: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Onboarding terminé avec succès",
      user: updatedUser as UserWithRelations,
    };
  } catch (error: any) {
    console.error("Erreur onboarding:", error);
    return { success: false, message: "Erreur lors de l'onboarding" };
  }
};
