import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const verifyEmail = async (token: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return { success: false, message: "User not found or token expired" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerify: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    return { success: true, message: "Email verified successfully", user: updatedUser };
  } catch (error) {
    return { success: false, message: "Failed to verify email" };
  }
};
