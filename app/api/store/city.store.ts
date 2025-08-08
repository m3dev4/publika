import { cities } from "@/types/cities.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CityState {
  cities: cities[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCities: () => Promise<void>;
  setCities: (cities: cities[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  addCity: (city: cities) => void;
  updateCity: (id: string, city: Partial<cities>) => void;
  deleteCity: (id: string) => void;

  // Getters
  getCities: () => cities[];
  getCityById: (id: string) => cities | undefined;
}

const initialState = {
  cities: [],
  isLoading: false,
  error: null,
};

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      fetchCities: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/city/listCity");
          if (!response.ok) {
            throw new Error("Failed to fetch cities");
          }
          const data = await response.json();
          set({ cities: data.cities, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      setCities: (cities: cities[]) => set({ cities }),

      addCity: (city: cities) => {
        set((state) => ({ cities: [...state.cities, city] }));
      },

      updateCity: (id: string, city: Partial<cities>) => {
        set((state) => ({
          cities: state.cities.map((c) =>
            c.id === id ? { ...c, ...city } : c,
          ),
        }));
      },

      deleteCity: (id: string) => {
        set((state) => ({ cities: state.cities.filter((c) => c.id !== id) }));
      },

      // Getters
      getCities: () => get().cities,
      getCityById: (id: string) => get().cities.find((c) => c.id === id),
    }),
    {
      name: "city-store",
    },
  ),
);
