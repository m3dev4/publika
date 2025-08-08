// Script to insert categories with tags directly in the database

import { categories } from "@/constants";
import prisma from "@/lib/prisma";

const insertCategories = async () => {
  try {
    // Créer un utilisateur système pour les catégories
    let systemUser = await prisma.user.findFirst({
      where: { email: "m3dev4@gmail.com" },
    });

    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          email: "system@publika.com",
          password: "system",
          firstName: "System",
          lastName: "Admin",
          isVerify: true,
        },
      });
    }

    const existingCategories = await prisma.category.findMany({
      where: {
        name: {
          in: categories.map((cat) => cat.name),
        },
      },
      include: {
        tags: true,
      },
    });

    // Vérifier et ajouter les tags manquants pour les catégories existantes
    for (const constantCategory of categories) {
      const existingCategory = existingCategories.find(
        (cat) => cat.name === constantCategory.name,
      );

      if (existingCategory && constantCategory.tags) {
        const existingTagNames = existingCategory.tags.map((tag) => tag.name);
        const missingTags = constantCategory.tags.filter(
          (tag) => !existingTagNames.includes(tag.name),
        );

        if (missingTags.length > 0) {
          await prisma.tag.createMany({
            data: missingTags.map((tag) => ({
              name: tag.name,
              categoryId: existingCategory.id,
            })),
          });
          console.log(
            `✅ ${missingTags.length} tags ajoutés à la catégorie "${existingCategory.name}"`,
          );
        }
      }
    }

    if (existingCategories.length === categories.length) {
      console.log("✅ Vérification des tags terminée");
      return;
    }

    const missingCategories = categories.filter(
      (category) =>
        !existingCategories.some((existing) => existing.name === category.name),
    );

    if (missingCategories.length > 0) {
      for (const category of missingCategories) {
        const createdCategory = await prisma.category.create({
          data: {
            name: category.name,
            userId: systemUser!.id,
          },
        });

        // Ajouter les tags si ils existent
        if (category.tags && category.tags.length > 0) {
          await prisma.tag.createMany({
            data: category.tags.map((tag) => ({
              name: tag.name,
              categoryId: createdCategory.id,
            })),
          });
        }
      }
      console.log(
        `✅ ${missingCategories.length} nouvelles catégories avec leurs tags ajoutées avec succès`,
      );
    }
  } catch (error: any) {
    console.error(`❌ Erreur: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

// Exécuter le script
insertCategories();
