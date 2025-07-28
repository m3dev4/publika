"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { sendVerificationEmail } from "@/mail/resend";
import { UserRegister, User } from "@/types/user.type";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const register = async (data: UserRegister): Promise<User> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = 12;
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
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
    return user;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to register user");
  }
};
