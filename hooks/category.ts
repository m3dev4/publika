import { useCategoryStore } from "@/app/api/store/category.store";
import { Category } from "@/types/category.types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const createCategory = () => {
  const { addCategory, setLoading, setError, clearError } = useCategoryStore();

  return useMutation({
    mutationFn: async (data: { name: string }): Promise<Category> => {
      setLoading(true);
      clearError();
      
      try {
        const res = await fetch("/api/category/createCategory", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          const errorMessage = result.error || "Failed to create category";
          setError(errorMessage);
          throw new Error(errorMessage);
        }
        
        // Add the created category to the store
        if (result.category) {
          addCategory(result.category);
          return result.category;
        }
        
        throw new Error("Invalid response format");
      } catch (error: any) {
        const errorMessage = error.message || "Une erreur est survenue";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (category: Category) => {
      console.log("Catégorie créée avec succès:", category);
    },
    onError: (error: any) => {
      console.error("Erreur lors de la création de la catégorie:", error);
    },
  });
};

// Hook pour récupérer les catégories
export const useCategories = () => {
  const { setCategories, setLoading, setError, clearError } = useCategoryStore();

  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      setLoading(true);
      clearError();
      
      try {
        const res = await fetch("/api/category/getCategories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          const errorMessage = result.error || "Failed to fetch categories";
          setError(errorMessage);
          throw new Error(errorMessage);
        }
        
        if (result.categories) {
          setCategories(result.categories);
          console.log("Catégories chargées avec succès:", result.categories);
          return result.categories;
        }
        
        return [];
      } catch (error: any) {
        const errorMessage = error.message || "Une erreur est survenue lors du chargement";
        setError(errorMessage);
        console.error("Erreur lors du chargement des catégories:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
};
