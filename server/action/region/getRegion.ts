"use server";

import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export const getRegions = async () => {
  const regions = await prisma.region.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return regions;
};
