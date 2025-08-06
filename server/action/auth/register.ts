"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { sendVerificationEmail } from "@/mail/resend";
import { UserRegister, User } from "@/types/user.type";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const register = async (data: UserRegister) => {
  try {
    // Validation des données d'entrée
    if (!data.email || !data.password) {
      return {
        error: "Email et mot de passe requis",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        error: "Un utilisateur avec cet email existe déjà",
      };
    }

    const salt = 12;
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const emailVerificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        isVerify: false,
        emailVerificationToken: emailVerificationToken,
        emailVerificationTokenExpiresAt: tomorrow,
        onboarding: false,
      },
    });

    await sendVerificationEmail(user.email, emailVerificationToken);

    return {
      success: true,
      user: user,
    };
  } catch (error: any) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      error: error.message || "Échec de l'inscription",
    };
  }
};
