"use client";
import { useCategoryStore } from "@/app/api/store/category.store";
import CreateCategory from "@/components/createCategory";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCategories } from "@/hooks/category";
import React from "react";

const CategoryPage = () => {
  const { error, isLoading, categories } = useCategoryStore();

  return (
    <div className="w-full overflow-hidden">
      <div className="px-7 py-7 ">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">Category</h1>
          <p className="text-sm text-gray-500">Manage your categories</p>
        </div>
        {/* Create Category */}
        <CreateCategory />

        {/* List Categories */}
        <div className="mt-7">
          <div className="flex flex-col">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Categories</h2>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    <p className="text-sm text-gray-500">Chargement des catégories...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-4">
                    <p className="text-sm text-red-500">Erreur lors du chargement des catégories</p>
                  </div>
                )}

                {categories.length === 0 && !isLoading ? (
                  <div>
                    <p className="text-sm text-gray-500">Aucune catégorie trouvée</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border rounded p-4 hover:scale-105 transition-all    "
                      >
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-xs">
                          Crée le {new Date(category.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
