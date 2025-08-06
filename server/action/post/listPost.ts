"use server";

import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const listPost = async () => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
