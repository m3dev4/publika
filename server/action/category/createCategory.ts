"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { Category } from "@/types/category.types";

const prisma = new PrismaClient();

export const createCategory = async (data: { name: string; userId: string }) => {
  try {
    const foundExistingCategory = await prisma.category.findFirst({
      where: {
        userId: data.userId,
        name: data.name,
      },
    });

    if (foundExistingCategory) {
      throw new Error("Category already exists");
    }

    const category = await prisma.category.create({
      data: {
        userId: data.userId,
        name: data.name,
      },
      include: {
        tags: true
      }
    });
    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};
