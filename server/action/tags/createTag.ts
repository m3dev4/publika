import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const createTag = async (data: { name: string; categoryId: string }) => {
  try {
    const foundTag = await prisma.tag.findFirst({
      where: {
        name: data.name,
        categoryId: data.categoryId,
      },
    });

    if (foundTag) {
      throw new Error("Tag already exists");
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return tag;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};
