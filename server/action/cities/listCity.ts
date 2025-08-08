"use server";

import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const listCity = async () => {
  try {
    const cities = await prisma.city.findMany();
    return cities;
  } catch (error) {
    console.error("Error listing cities:", error);
    throw error;
  }
};
