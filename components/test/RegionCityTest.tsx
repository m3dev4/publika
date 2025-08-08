"use client";

import { useListRegions } from "@/hooks/region";
import { useListCities } from "@/hooks/city";

export default function RegionCityTest() {
  const { data: regions, isLoading: regionsLoading, error: regionsError } = useListRegions();
  const { data: cities, isLoading: citiesLoading, error: citiesError } = useListCities();

  if (regionsLoading || citiesLoading) {
    return <div className="p-4 text-white">Chargement des données...</div>;
  }

  if (regionsError || citiesError) {
    return (
      <div className="p-4 text-red-400">
        Erreur: {regionsError || citiesError}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 text-white">
      <div>
        <h2 className="text-xl font-bold mb-2">Régions ({regions?.length || 0})</h2>
        <div className="space-y-2">
          {regions?.map((region) => (
            <div key={region.id} className="p-2 bg-gray-800 rounded">
              <strong>{region.name}</strong> (ID: {region.id})
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Villes ({cities?.length || 0})</h2>
        <div className="space-y-2">
          {cities?.map((city) => (
            <div key={city.id} className="p-2 bg-gray-800 rounded">
              <strong>{city.name}</strong> - Région ID: {city.regionId}
              {city.longitude && city.latitude && (
                <span className="text-gray-400 text-sm ml-2">
                  ({city.longitude}, {city.latitude})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
