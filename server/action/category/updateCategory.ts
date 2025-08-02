import { PrismaClient } from "@/lib/prisma-client-js";
import { Category } from "@/types/category.types";

const prisma = new PrismaClient();

export const updateCategory = async (data: Category) => {
  const foundCategory = await prisma.category.findUnique({
    where: { id: data.id },
  });

  if (!foundCategory) {
    throw new Error("Erreur lors du mise à jour");
  }

  const categoryUpdate = await prisma.category.update({
    where: { id: data.id },
    data: {
      name: data.name,
    },
  });

  return categoryUpdate;
};
