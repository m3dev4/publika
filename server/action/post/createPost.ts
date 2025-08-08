"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
import { CreatePostInput } from "@/types/post.type";

const prisma = new PrismaClient();

export const createPost = async (postData: CreatePostInput, userId: string) => {
  try {
    const userSession = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userSession) {
      throw new Error("User not found");
    }

    const newPost = await prisma.posts.create({
      data: {
        title: postData.title,
        content: postData.content,
        type: postData.type,
        photo: postData.photo || [],
        status: postData.status,
        prices: postData.prices,
        user: {
          connect: { id: userId },
        },
        ...(postData.categoryId && {
          category: {
            connect: { id: postData.categoryId },
          },
        }),
      },
      include: {
        user: true,
        category: true,
      },
    });

    return newPost;
  } catch (error: any) {
    console.error(`Error creating post:`, error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
};
