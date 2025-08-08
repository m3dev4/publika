import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerify: true,
        onboarding: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`📋 ${users.length} utilisateur(s) trouvé(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   👤 ${user.firstName || "N/A"} ${user.lastName || "N/A"}`);
      console.log(`   🔑 Rôle: ${user.role}`);
      console.log(`   ✅ Vérifié: ${user.isVerify ? "Oui" : "Non"}`);
      console.log(
        `   📝 Onboarding: ${user.onboarding ? "Terminé" : "En attente"}`,
      );
      console.log(`   📅 Créé: ${user.createdAt.toLocaleDateString("fr-FR")}`);
      console.log("   ---");
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
