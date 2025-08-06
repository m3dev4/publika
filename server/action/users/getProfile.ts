"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { User } from "@/types/user.type";

const prisma = new PrismaClient();

export const getProfile = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};
