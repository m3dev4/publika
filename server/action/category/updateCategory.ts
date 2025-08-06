import prisma from "@/lib/prisma";
import { Category } from "@/types/category.types";

export const updateCategory = async (data: Category) => {
  try {
    const foundCategory = await prisma.category.findUnique({
      where: { id: data.id },
    });

    if (!foundCategory) {
      throw new Error("Catégorie introuvable");
    }

    const categoryUpdate = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });

    return categoryUpdate;
  } catch (error: any) {
    throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
  }
};
