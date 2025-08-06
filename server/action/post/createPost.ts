"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { Post } from "@/types/post.type";

const prisma = new PrismaClient();

export const createPost = async (post: Post, userId: string) => {
  try {
    const userSession = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userSession) {
      throw new Error("User not found");
    }

    const newPost = await prisma.posts.create({
      data: {
        title: post.title,
        content: post.content,
        type: post.type,
        photo: post.photo || null,
        status: post.status,
        prices: post.prices,
        user: {
          connect: { id: userId },
        },
        category: {
          connect: { id: post.categoryId },
        },
      },
      include: {
        user: true,
        category: true,
      },
    });

    return newPost;
  } catch (error: any) {
    console.log(`Error creating post: ${error}`);
    throw error;
  }
};
