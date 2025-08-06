"use server"

import { Post } from "@/types/post.type";
import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const updatePost = async (id: string, post: Post) => {
  try {
    const updatedPost = await prisma.posts.update({
      where: {
        id: id,
      },
      data: {
        title: post.title,
        content: post.content,
        type: post.type,
        photo: post.photo || null,
        status: post.status,
        prices: post.prices,
      },
      include: {
        user: true,
        category: true,
      },
    });

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
