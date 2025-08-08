import { region } from "@/types/region.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RegionState {
  region: region[];
  isLoading: boolean;
  error: string | null;

  setRegion: (region: region[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState = {
  region: [],
  isLoading: false,
  error: null,
};

export const useRegionStore = create<RegionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setRegion: (region: region[]) => set({ region }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "region-store",
    },
  ),
);
