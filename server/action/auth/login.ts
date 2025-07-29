import { PrismaClient } from "@/lib/prisma-client-js";
import { User, UserLogin } from "@/types/user.type";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const login = async (data: UserLogin, request: Request): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { sessions: true }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (!user.isVerify) {
      throw new Error("Email not verified");
    }

    if (!user.onboarding) {
      throw new Error("Onboarding not completed");
    }

    // Génération du token de session
    const token = uuidv4();
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);

    const ipAdress = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') 
    const userAgent = request.headers.get('user-agent')

    // Création de la session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
         ipAddress: ipAdress || "",
         userAgent: userAgent || "",
        isOnline: true,
        lastActivityAt: new Date(),
        createdAt: new Date(),
        token: token,
        expiresAt: threeDays
      }
    });

    // Configuration du cookie de session
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3 // 3 jours en secondes
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;

  } catch (error) {
    console.error("Login error:", error);
    throw error; // Relancer l'erreur pour la gestion au niveau supérieur
  }
};