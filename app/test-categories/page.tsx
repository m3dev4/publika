"use client";

import { useState, useEffect } from "react";
import { createCategory, useCategories } from "@/hooks/category";
import { useCategoryStore } from "@/app/api/store/category.store";
import { useAuthStore } from "@/app/api/store/auth.store";

export default function TestCategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { categories, isLoading, error } = useCategoryStore();
  const { user, isAuthenticated, hydrated } = useAuthStore();
  
  // Hooks
  const { data: fetchedCategories, isLoading: isFetching, error: fetchError } = useCategories();
  const createCategoryMutation = createCategory();

  // Debug: Log auth state
  useEffect(() => {
    console.log("Auth state:", { user, isAuthenticated, hydrated });
  }, [user, isAuthenticated, hydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await createCategoryMutation.mutateAsync({ name: categoryName.trim() });
      setCategoryName("");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const testAuth = async () => {
    try {
      const response = await fetch("/api/debug/auth", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      setDebugInfo(result);
      console.log("Debug auth result:", result);
    } catch (error: any) {
      console.error("Debug auth error:", error);
      setDebugInfo({ error: error.message });
    }
  };

  // Show loading while hydrating
//   if (!hydrated) {
//     return (
//       <div className="container mx-auto p-6 max-w-2xl">
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <p className="mt-2 text-gray-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <h2 className="font-bold">Authentification requise</h2>
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <p className="mt-2">
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-sm">
            {JSON.stringify({ user, isAuthenticated, hydrated }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Test des Catégories</h1>
      
      {/* Debug info */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Info utilisateur:</h3>
        <p className="text-sm text-blue-700">
          Utilisateur: {user?.firstName} {user?.lastName} ({user?.email})
        </p>
        <p className="text-sm text-blue-700">ID: {user?.id}</p>
        
        <button
          onClick={testAuth}
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Tester l'authentification API
        </button>
        
        {debugInfo && (
          <div className="mt-3 bg-gray-100 p-3 rounded">
            <h4 className="font-semibold text-sm mb-2">Résultat du test API:</h4>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Formulaire de création */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Créer une nouvelle catégorie</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le nom de la catégorie"
              disabled={createCategoryMutation.isPending}
            />
          </div>
          <button
            type="submit"
            disabled={createCategoryMutation.isPending || !categoryName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCategoryMutation.isPending ? "Création en cours..." : "Créer la catégorie"}
          </button>
        </form>
        
        {/* Messages d'erreur */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {createCategoryMutation.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {createCategoryMutation.error.message}
          </div>
        )}
      </div>

      {/* Liste des catégories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Mes Catégories</h2>
        
        {(isLoading || isFetching) && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement des catégories...</p>
          </div>
        )}
        
        {fetchError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            Erreur lors du chargement: {fetchError.message}
          </div>
        )}
        
        {categories.length === 0 && !isLoading && !isFetching ? (
          <p className="text-gray-500 text-center py-4">Aucune catégorie trouvée. Créez votre première catégorie !</p>
        ) : (
          <div className="grid gap-3">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Créée le {new Date(category.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    {category.tags && category.tags.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Tags:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
