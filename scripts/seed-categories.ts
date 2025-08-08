import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

async function seedCategories() {
  try {
    console.log("🌱 Début du seed des catégories...");

    // Supprimer les catégories existantes
    await prisma.category.deleteMany();
    console.log("🗑️ Catégories existantes supprimées");

    // Créer un utilisateur admin pour les catégories (si nécessaire)
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: "admin@publika.com",
          password: "hashed_password", // En production, utiliser un hash
          firstName: "Admin",
          lastName: "System",
          username: "admin",
          role: "ADMIN",
          isVerify: true,
          onboarding: true,
        },
      });
      console.log("👤 Utilisateur admin créé");
    }

    // Catégories à créer
    const categories = [
      {
        name: "Développement Web",
        userId: adminUser.id,
      },
      {
        name: "Design Graphique",
        userId: adminUser.id,
      },
      {
        name: "Marketing Digital",
        userId: adminUser.id,
      },
      {
        name: "Rédaction",
        userId: adminUser.id,
      },
      {
        name: "Traduction",
        userId: adminUser.id,
      },
      {
        name: "Photographie",
        userId: adminUser.id,
      },
      {
        name: "Vidéo & Animation",
        userId: adminUser.id,
      },
      {
        name: "Consulting",
        userId: adminUser.id,
      },
    ];

    // Créer les catégories
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData,
      });
      console.log(`✅ Catégorie créée: ${category.name} (ID: ${category.id})`);
    }

    console.log("🎉 Seed des catégories terminé avec succès!");
    console.log(`📊 Total: ${categories.length} catégories créées`);
  } catch (error) {
    console.error("❌ Erreur lors du seed des catégories:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
if (require.main === module) {
  seedCategories()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedCategories };
