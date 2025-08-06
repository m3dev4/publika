import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

async function promoteUserToAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Utilisateur avec l'email ${email} introuvable`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`✅ Utilisateur ${email} promu admin avec succès !`);
    console.log(`📋 Détails:`, {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la promotion:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Récupérer l'email depuis les arguments de ligne de commande
const email = process.argv[2];

if (!email) {
  console.error("❌ Veuillez fournir un email:");
  console.log("Usage: npx tsx scripts/promote-admin.ts <email>");
  process.exit(1);
}

promoteUserToAdmin(email);
