import { useRegionStore } from "@/app/api/store/region.store";
import { Region } from "@/types/region.type";
import { useQuery } from "@tanstack/react-query";

export const useListRegions = () => {
  const { setRegion, setIsLoading, setError } = useRegionStore();

  return useQuery({
    queryKey: ["regions"],
    queryFn: async (): Promise<Region[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/region", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok) {
          const errorMessage = result.error || "Failed to fetch regions list";
          setError(errorMessage);
          throw new Error(errorMessage);
        }

        // L'API retourne { regions: [...] }
        if (result.regions) {
          setRegion(result.regions);
          console.log("Regions chargées avec succès");
          return result.regions;
        }

        return [];
      } catch (error: any) {
        const errorMessage = error.message || "Failed to fetch regions list";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (les régions changent rarement)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
