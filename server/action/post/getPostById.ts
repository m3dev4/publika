"use server";

import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const getPostById = async (id: string) => {
  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        category: true,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
