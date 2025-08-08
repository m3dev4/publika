"use client";

import RegionCityTest from "@/components/test/RegionCityTest";

export default function TestRegionCityPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Test Régions et Villes
        </h1>
        <RegionCityTest />
      </div>
    </div>
  );
}
