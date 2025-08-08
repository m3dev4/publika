import { PrismaClient } from "@/lib/prisma-client-js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log("🔄 Création d'un utilisateur de test...");

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@example.com" }
    });

    if (existingUser) {
      console.log("✅ L'utilisateur de test existe déjà:", existingUser.email);
      return existingUser;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        isVerify: true, // Marquer comme vérifié pour éviter les problèmes
        onboarding: true, // Marquer l'onboarding comme terminé
        role: "USER",
        isTalent: true,
        isAnnouncer: false,
      },
    });

    console.log("✅ Utilisateur de test créé avec succès:");
    console.log("📧 Email:", user.email);
    console.log("🔑 Mot de passe: password123");
    console.log("🆔 ID:", user.id);

    return user;
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur de test:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log("🎉 Script terminé avec succès!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur du script:", error);
      process.exit(1);
    });
}

export { createTestUser };
