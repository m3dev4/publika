import { useCityStore } from "@/app/api/store/city.store";
import { cities } from "@/types/cities.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateCity = () => {
  const { addCity } = useCityStore();

  return useMutation({
    mutationFn: async (city: {
      name: string;
      regionId: string;
      longitude?: number;
      latitude?: number;
    }) => {
      const res = await fetch("/api/city/createCity", {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create city");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.city) {
        addCity(data.city);
      }
      console.log("City created successfully");
    },
    onError: (error: any) => {
      console.error("Failed to create city:", error.message);
    },
  });
};

export const useListCities = () => {
  const { setCities, setLoading, setError } = useCityStore();

  return useQuery({
    queryKey: ["cities"],
    queryFn: async (): Promise<cities[]> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/city/listCity", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok) {
          const errorMessage = result.error || "Failed to fetch cities list";
          setError(errorMessage);
          throw new Error(errorMessage);
        }

        // L'API retourne { cities: [...] }
        if (result.cities) {
          setCities(result.cities);
          console.log("Cities chargées avec succès");
          return result.cities;
        }

        return [];
      } catch (error: any) {
        const errorMessage = error.message || "Failed to fetch cities list";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
