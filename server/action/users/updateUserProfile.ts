"use server";
import { PrismaClient } from "@/lib/prisma-client-js";
import { UserUpdateProfile } from "@/types/user.type";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const updateUserProfile = async (data: UserUpdateProfile) => {
  try {
    const userExist = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!userExist) {
      throw new Error("User not found");
    }

    const updateUser: any = {};

    if (data.firstName) updateUser.firstName = data.firstName;
    if (data.lastName) updateUser.lastName = data.lastName;
    if (data.username) updateUser.username = data.username;
    if (data.avatar) updateUser.avatar = data.avatar;
    if (data.description) updateUser.description = data.description;
    if (data.isTalent !== undefined) updateUser.isTalent = data.isTalent;
    if (data.isAnnouncer !== undefined)
      updateUser.isAnnouncer = data.isAnnouncer;

    // Gérer la logique de ville personnalisée (comme dans l'onboarding)
    let finalCityId = data.cityId;

    // Si l'utilisateur a saisi une ville personnalisée, la créer
    if (data.customCity && !data.cityId && data.regionId) {
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

    // Mettre à jour le cityId si une ville a été sélectionnée ou créée
    if (finalCityId) {
      updateUser.cityId = finalCityId;
    }

    if (data.password && data.password.trim() !== "")
      updateUser.passwordHash = await bcrypt.hash(data.password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: updateUser,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        city: true,
        description: true,
        isTalent: true,
        isAnnouncer: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, message: "User updated successfully", user: updatedUser };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
