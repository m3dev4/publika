"use server";

import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export async function verifyEmail(token: string) {
  try {
    console.log("Vérification du token:", token);
    
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    console.log("Utilisateur trouvé:", user?.email);

    if (!user) {
      console.log("Aucun utilisateur trouvé avec ce token");
      return { success: false, message: "Code de vérification invalide ou expiré" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerify: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    console.log("Email vérifié avec succès pour:", user.email);
    return { success: true, message: "Email vérifié avec succès", user: updatedUser };
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return { success: false, message: "Erreur lors de la vérification de l'email" };
  }
}
