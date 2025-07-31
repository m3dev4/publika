"use server"
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
    if (data.city) updateUser.city = data.city;
    if (data.description) updateUser.description = data.description;
    if (data.isTalent !== undefined) updateUser.isTalent = data.isTalent;
    if (data.isAnnouncer !== undefined) updateUser.isAnnouncer = data.isAnnouncer;

    if (data.password && data.password.trim() !== "") updateUser.passwordHash = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
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

    return { success: true, message: "User updated successfully" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
