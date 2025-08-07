import { PrismaClient } from '@/lib/prisma-client-js';
import { city } from '@/constants/city';

const prisma = new PrismaClient();

async function seedRegionsAndCities() {
  try {
    console.log('🌍 Début de l\'injection des régions et villes...');

    // Vérifier si des données existent déjà
    const existingRegions = await prisma.region.count();
    const existingCities = await prisma.city.count();
    
    if (existingRegions > 0 || existingCities > 0) {
      console.log(`⚠️  ${existingRegions} régions et ${existingCities} villes existent déjà.`);
      console.log('Voulez-vous les supprimer et les remplacer ? (Ctrl+C pour annuler)');
      
      // Attendre 3 secondes pour permettre l'annulation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Supprimer dans l'ordre (villes puis régions à cause des relations)
      await prisma.city.deleteMany({});
      await prisma.region.deleteMany({});
      console.log('🗑️  Données existantes supprimées.');
    }

    // 1. Extraire les régions uniques
    const uniqueRegions = [...new Set(city.map(c => c.region))];
    console.log(`📍 Création de ${uniqueRegions.length} régions...`);
    
    // 2. Créer les régions
    const regionsToCreate = uniqueRegions.map(regionName => ({
      name: regionName
    }));

    await prisma.region.createMany({
      data: regionsToCreate,
      skipDuplicates: true,
    });

    // 3. Récupérer les régions créées avec leurs IDs
    const createdRegions = await prisma.region.findMany();
    const regionMap = new Map(createdRegions.map(r => [r.name, r.id]));
    
    console.log(`✅ ${createdRegions.length} régions créées !`);
    
    // 4. Créer les villes avec les bons regionId
    console.log(`🏙️  Création de ${city.length} villes...`);
    
    const citiesToCreate = city.map(cityData => ({
      name: cityData.name,
      longitude: cityData.longitude,
      latitude: cityData.latitude,
      regionId: regionMap.get(cityData.region)!
    }));

    const cityResult = await prisma.city.createMany({
      data: citiesToCreate,
      skipDuplicates: true,
    });

    console.log(`✅ ${cityResult.count} villes créées avec succès !`);
    
    // 5. Afficher un résumé
    const finalRegions = await prisma.region.findMany({
      include: {
        cities: true
      },
      orderBy: { name: 'asc' }
    });
    
    console.log('\n📊 Résumé des données créées :');
    finalRegions.forEach((region) => {
      console.log(`\n🏛️  ${region.name} (${region.cities.length} villes):`);
      region.cities.forEach((city, index) => {
        console.log(`   ${index + 1}. ${city.name}`);
      });
    });

    console.log(`\n🎯 Total: ${finalRegions.length} régions, ${finalRegions.reduce((sum, r) => sum + r.cities.length, 0)} villes`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'injection:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
seedRegionsAndCities()
  .then(() => {
    console.log('\n🎉 Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
