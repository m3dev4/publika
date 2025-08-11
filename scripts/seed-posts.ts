import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding posts data...");

  // Vérifier si des posts existent déjà
  const existingPosts = await prisma.posts.count();
  if (existingPosts > 0) {
    console.log("✅ Posts already exist, skipping seed");
    return;
  }

  // Récupérer les utilisateurs, catégories, et villes existants
  const users = await prisma.user.findMany({ take: 5 });
  const categories = await prisma.category.findMany();
  const cities = await prisma.city.findMany();

  if (users.length === 0 || categories.length === 0 || cities.length === 0) {
    console.log("❌ Need users, categories, and cities to seed posts");
    return;
  }

  // Données de test pour les posts
  const postsData = [
    {
      title: "Développeur Web Frontend React/Next.js",
      content:
        "Recherche développeur expérimenté en React et Next.js pour projet e-commerce. Maîtrise de TypeScript et Tailwind CSS requise. Mission de 3 mois renouvelable.",
      type: "MISSION" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
      ],
      prices: 150000,
      userId: users[0].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("informatique"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("dakar"))?.id ||
        cities[0].id,
    },
    {
      title: "Designer UI/UX pour application mobile",
      content:
        "Création d'interfaces modernes pour application de livraison. Expérience en design mobile et prototypage Figma indispensable.",
      type: "MISSION" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
      ],
      prices: 120000,
      userId: users[1].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("design"))?.id ||
        categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("pikine"))?.id ||
        cities[1].id,
    },
    {
      title: "Cours particuliers de mathématiques",
      content:
        "Professeur certifié propose cours de mathématiques niveau lycée et université. Préparation aux examens et concours.",
      type: "GENERAL" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500",
      ],
      prices: 15000,
      userId: users[2].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("éducation"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("dakar"))?.id ||
        cities[0].id,
    },
    {
      title: "Photographe événementiel disponible",
      content:
        "Photographe professionnel spécialisé dans les mariages, baptêmes et événements corporatifs. Portfolio disponible sur demande.",
      type: "GENERAL" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1542038784456-1ea8e732a1e?w=500",
      ],
      prices: 75000,
      userId: users[3].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("photographie"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("rufisque"))?.id ||
        cities[2].id,
    },
    {
      title: "Consultant en marketing digital",
      content:
        "Aide les entreprises à développer leur présence en ligne. Stratégies SEO, réseaux sociaux, et campagnes publicitaires.",
      type: "MISSION" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
      ],
      prices: 200000,
      userId: users[4].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("marketing"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("guédiawaye"))?.id ||
        cities[3].id,
    },
    {
      title: "Réparation et maintenance informatique",
      content:
        "Service de réparation d'ordinateurs et maintenance de systèmes informatiques. Déplacement à domicile possible.",
      type: "GENERAL" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500",
      ],
      prices: 25000,
      userId: users[0].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("informatique"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("pikine"))?.id ||
        cities[1].id,
    },
    {
      title: "Chef cuisinier pour événements",
      content:
        "Chef expérimenté propose services de restauration pour mariages, fêtes et événements corporatifs. Cuisine sénégalaise et internationale.",
      type: "GENERAL" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      ],
      prices: 50000,
      userId: users[1].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("restauration"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("dakar"))?.id ||
        cities[0].id,
    },
    {
      title: "Traducteur français-anglais-wolof",
      content:
        "Services de traduction professionnelle pour documents officiels, sites web et communications d'entreprise.",
      type: "MISSION" as const,
      status: "PUBLISHED" as const,
      photo: [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500",
      ],
      prices: 10000,
      userId: users[2].id,
      categoryId:
        categories.find((c) => c.name.toLowerCase().includes("traduction"))
          ?.id || categories[0].id,
      cityId:
        cities.find((c) => c.name.toLowerCase().includes("keur massar"))?.id ||
        cities[4].id,
    },
  ];

  // Créer les posts
  for (const postData of postsData) {
    try {
      await prisma.posts.create({
        data: postData,
      });
      console.log(`✅ Created post: ${postData.title}`);
    } catch (error) {
      console.error(`❌ Error creating post ${postData.title}:`, error);
    }
  }

  console.log("🎉 Posts seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
