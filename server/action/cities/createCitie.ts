"use server";

import { PrismaClient } from "@/lib/prisma-client-js";
const prisma = new PrismaClient();

interface CreateCityInput {
  name: string;
  regionId: string;
  longitude?: number;
  latitude?: number;
}

export const createCitie = async (cityData: CreateCityInput) => {
  try {
    // Vérifier si une ville avec ce nom existe déjà dans cette région
    const foundCity = await prisma.city.findFirst({
      where: {
        name: {
          equals: cityData.name,
          mode: "insensitive", // Recherche insensible à la casse
        },
        regionId: cityData.regionId,
      },
    });

    if (foundCity) {
      throw new Error(`La ville "${cityData.name}" existe déjà dans cette région`);
    }

    const newCity = await prisma.city.create({
      data: {
        name: cityData.name,
        regionId: cityData.regionId,
        longitude: cityData.longitude || null,
        latitude: cityData.latitude || null,
      },
      include: {
        region: true,
      },
    });

    return newCity;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
