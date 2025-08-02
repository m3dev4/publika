import { Category } from "@/types/category.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;

  // Getters (optionnels - vous pouvez accéder directement aux propriétés)
  getCategoryById: (id: string) => Category | undefined;
}

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setCategories: (categories) => set({ categories, error: null }),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
          error: null,
        })),

      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updatedCategory } : cat
          ),
          error: null,
        })),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          error: null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),

      reset: () => set(initialState),

      // Getters
      getCategoryById: (id) => get().categories.find((cat) => cat.id === id),
    }),
    {
      name: "category-storage",
      // Optimisation : ne persister que les données nécessaires
      partialize: (state) => ({
        categories: state.categories,
        // Ne pas persister isLoading et error car ils sont temporaires
      }),
      // Optionnel : gestion des versions pour les migrations
      version: 1,
    }
  )
);
